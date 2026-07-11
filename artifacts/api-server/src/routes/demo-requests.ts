import { Router, type IRouter } from "express";
import { and, eq, gte, lt, ne } from "drizzle-orm";
import {
  db,
  demoRequestsTable,
  insertDemoRequestSchema,
  updateDemoRequestSchema,
} from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";
import { sendDemoRequestNotification, sendDemoRequestConfirmation } from "../lib/mailer";
import {
  BOOKING_TIMEZONE_LABEL,
  getBookingSettings,
  getDaySlots,
  getIstDayRangeUtc,
  isValidSlotIso,
  istCalendarDateForInstant,
  parseDateParam,
} from "../lib/scheduling";

const router: IRouter = Router();

// Public config so the visitor-facing calendar can grey out non-bookable
// weekdays and blocked dates before the visitor even picks a day.
router.get("/demo-requests/booking-config", async (_req, res) => {
  try {
    const settings = await getBookingSettings();
    res.json({
      timezone: BOOKING_TIMEZONE_LABEL,
      bookableWeekdays: settings.bookableWeekdays,
      blockedDates: settings.blockedDates,
    });
  } catch (err) {
    res.status(500).json({ error: "server_error" });
  }
});

router.get("/demo-requests/available-slots", async (req, res) => {
  const dateStr = String(req.query.date || "");
  const parsedDate = parseDateParam(dateStr);
  if (!parsedDate) {
    res.status(400).json({ error: "invalid_date" });
    return;
  }
  const now = new Date();
  const daySlots = await getDaySlots(parsedDate.y, parsedDate.m, parsedDate.d, now);
  if (daySlots.length === 0) {
    res.json({ date: dateStr, timezone: BOOKING_TIMEZONE_LABEL, slots: [] });
    return;
  }
  const { start, end } = getIstDayRangeUtc(parsedDate.y, parsedDate.m, parsedDate.d);
  const booked = await db
    .select({ scheduledAt: demoRequestsTable.scheduledAt })
    .from(demoRequestsTable)
    .where(
      and(
        gte(demoRequestsTable.scheduledAt, start),
        lt(demoRequestsTable.scheduledAt, end),
        ne(demoRequestsTable.status, "declined"),
      ),
    );
  const bookedIsoSet = new Set(
    booked.filter((b) => b.scheduledAt).map((b) => new Date(b.scheduledAt as Date).toISOString()),
  );
  res.json({
    date: dateStr,
    timezone: BOOKING_TIMEZONE_LABEL,
    slots: daySlots.map((slot) => ({ ...slot, available: !bookedIsoSet.has(slot.iso) })),
  });
});

router.post("/demo-requests", async (req, res) => {
  const parsed = insertDemoRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_failed", issues: parsed.error.flatten() });
    return;
  }

  const scheduledAt = new Date(parsed.data.scheduledAt);
  const { y, m, d } = istCalendarDateForInstant(scheduledAt);
  if (!(await isValidSlotIso(y, m, d, scheduledAt.toISOString()))) {
    res.status(400).json({ error: "invalid_slot" });
    return;
  }

  try {
    // A partial unique index on (scheduled_at) for non-declined rows
    // (see lib/db/src/schema/demo-requests.ts) is the source of truth for
    // slot exclusivity: it makes double-booking impossible even when two
    // requests race, regardless of this pre-check.
    let row: typeof demoRequestsTable.$inferSelect;
    try {
      [row] = await db
        .insert(demoRequestsTable)
        .values({
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone || null,
          company: parsed.data.company || null,
          productInterest: parsed.data.productInterest || null,
          scheduledAt,
          message: parsed.data.message || null,
        })
        .returning();
    } catch (insertErr) {
      if (isUniqueViolation(insertErr)) {
        res.status(409).json({ error: "slot_unavailable" });
        return;
      }
      throw insertErr;
    }

    res.status(201).json({ ok: true, id: row.id });
    const emailPayload = {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      company: row.company,
      productInterest: row.productInterest,
      scheduledAt: row.scheduledAt ? row.scheduledAt.toISOString() : null,
      message: row.message,
    };
    void sendDemoRequestNotification(emailPayload);
    void sendDemoRequestConfirmation(emailPayload);
  } catch (err) {
    req.log?.error({ err }, "failed to insert demo request");
    res.status(500).json({ error: "server_error" });
  }
});

function isUniqueViolation(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const code = (err as { code?: string }).code;
  if (code === "23505") return true;
  const cause = (err as { cause?: unknown }).cause;
  return typeof cause === "object" && cause !== null && (cause as { code?: string }).code === "23505";
}

router.get("/admin/demo-requests", requireAdmin, async (_req, res) => {
  const rows = await db
    .select()
    .from(demoRequestsTable)
    .orderBy(demoRequestsTable.createdAt);
  rows.reverse();
  res.json({ demoRequests: rows });
});

router.patch("/admin/demo-requests/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "invalid_id" });
    return;
  }
  const parsed = updateDemoRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_failed" });
    return;
  }
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.data.status !== undefined) updates.status = parsed.data.status;
  if (parsed.data.notes !== undefined) updates.notes = parsed.data.notes;

  const [row] = await db
    .update(demoRequestsTable)
    .set(updates)
    .where(eq(demoRequestsTable.id, id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({ ok: true, demoRequest: row });
});

router.delete("/admin/demo-requests/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "invalid_id" });
    return;
  }
  await db.delete(demoRequestsTable).where(eq(demoRequestsTable.id, id));
  res.json({ ok: true });
});

export default router;

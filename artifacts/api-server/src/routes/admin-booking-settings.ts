import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import {
  db,
  bookingSettingsTable,
  updateBookingSettingsSchema,
  DEFAULT_BOOKING_SETTINGS,
  type BookingSettings,
} from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";
import { clearBookingSettingsCache } from "../lib/scheduling";

const router: IRouter = Router();

async function readSettings(): Promise<BookingSettings | null> {
  const [row] = await db.select().from(bookingSettingsTable).limit(1);
  return row ?? null;
}

function sanitize(row: BookingSettings | null) {
  if (!row) {
    return { id: null, ...DEFAULT_BOOKING_SETTINGS, updatedAt: null };
  }
  return row;
}

router.get("/booking", requireAdmin, async (_req, res) => {
  try {
    const row = await readSettings();
    res.json({ settings: sanitize(row) });
  } catch (err) {
    res.status(500).json({ error: "server_error" });
  }
});

router.put("/booking", requireAdmin, async (req, res) => {
  try {
    const parsed = updateBookingSettingsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "validation_failed", issues: parsed.error.flatten() });
      return;
    }
    const data = parsed.data;
    const existing = await readSettings();
    const startHour: number = data.startHour ?? existing?.startHour ?? DEFAULT_BOOKING_SETTINGS.startHour;
    const endHour: number = data.endHour ?? existing?.endHour ?? DEFAULT_BOOKING_SETTINGS.endHour;
    const values: typeof bookingSettingsTable.$inferInsert = {
      bookableWeekdays: data.bookableWeekdays ?? existing?.bookableWeekdays ?? DEFAULT_BOOKING_SETTINGS.bookableWeekdays,
      startHour,
      endHour,
      breakStartHour:
        data.breakStartHour !== undefined ? data.breakStartHour : (existing?.breakStartHour ?? DEFAULT_BOOKING_SETTINGS.breakStartHour),
      breakEndHour:
        data.breakEndHour !== undefined ? data.breakEndHour : (existing?.breakEndHour ?? DEFAULT_BOOKING_SETTINGS.breakEndHour),
      blockedDates: data.blockedDates ?? existing?.blockedDates ?? DEFAULT_BOOKING_SETTINGS.blockedDates,
      updatedAt: new Date(),
    };

    if (endHour <= startHour) {
      res.status(400).json({ error: "validation_failed", issues: { fieldErrors: { endHour: ["End hour must be after start hour"] } } });
      return;
    }
    const hasBreakStart = values.breakStartHour !== null && values.breakStartHour !== undefined;
    const hasBreakEnd = values.breakEndHour !== null && values.breakEndHour !== undefined;
    if (hasBreakStart !== hasBreakEnd) {
      res.status(400).json({
        error: "validation_failed",
        issues: { fieldErrors: { breakEndHour: ["Both break start and end hour must be set together, or both left empty"] } },
      });
      return;
    }
    if (hasBreakEnd && (values.breakEndHour as number) <= (values.breakStartHour as number)) {
      res.status(400).json({ error: "validation_failed", issues: { fieldErrors: { breakEndHour: ["Break end hour must be after break start hour"] } } });
      return;
    }

    if (existing) {
      await db.update(bookingSettingsTable).set(values).where(eq(bookingSettingsTable.id, existing.id));
    } else {
      await db.insert(bookingSettingsTable).values(values);
    }
    clearBookingSettingsCache();
    const fresh = await readSettings();
    res.json({ ok: true, settings: fresh });
  } catch (err) {
    req.log?.error({ err }, "failed to update booking settings");
    res.status(500).json({ error: "server_error" });
  }
});

export default router;

import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import {
  db,
  demoRequestsTable,
  insertDemoRequestSchema,
  updateDemoRequestSchema,
} from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";
import { sendDemoRequestNotification, sendDemoRequestConfirmation } from "../lib/mailer";

const router: IRouter = Router();

router.post("/demo-requests", async (req, res) => {
  const parsed = insertDemoRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_failed", issues: parsed.error.flatten() });
    return;
  }
  try {
    const [row] = await db
      .insert(demoRequestsTable)
      .values({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        company: parsed.data.company || null,
        productInterest: parsed.data.productInterest || null,
        preferredDate: parsed.data.preferredDate || null,
        message: parsed.data.message || null,
      })
      .returning();
    res.status(201).json({ ok: true, id: row.id });
    const emailPayload = {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      company: row.company,
      productInterest: row.productInterest,
      preferredDate: row.preferredDate,
      message: row.message,
    };
    void sendDemoRequestNotification(emailPayload);
    void sendDemoRequestConfirmation(emailPayload);
  } catch (err) {
    req.log?.error({ err }, "failed to insert demo request");
    res.status(500).json({ error: "server_error" });
  }
});

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

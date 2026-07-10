import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import { db, officeLocationsTable, upsertOfficeLocationSchema, type OfficeLocation } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

function publicShape(row: OfficeLocation) {
  const { createdAt: _c, updatedAt: _u, ...rest } = row;
  return rest;
}

router.get("/public/locations", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(officeLocationsTable)
      .where(eq(officeLocationsTable.enabled, true))
      .orderBy(asc(officeLocationsTable.sortOrder), asc(officeLocationsTable.id));
    res.json({ locations: rows.map(publicShape) });
  } catch {
    res.status(500).json({ error: "server_error" });
  }
});

router.get("/admin/settings/locations", requireAdmin, async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(officeLocationsTable)
      .orderBy(asc(officeLocationsTable.sortOrder), asc(officeLocationsTable.id));
    res.json({ locations: rows });
  } catch {
    res.status(500).json({ error: "server_error" });
  }
});

router.post("/admin/settings/locations", requireAdmin, async (req, res) => {
  try {
    const parsed = upsertOfficeLocationSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "validation_failed", issues: parsed.error.flatten() });
      return;
    }
    const data = parsed.data;
    const values: Record<string, unknown> = { ...data };
    for (const k of Object.keys(values)) {
      if (values[k] === "") values[k] = null;
    }
    const [row] = await db
      .insert(officeLocationsTable)
      .values(values as typeof officeLocationsTable.$inferInsert)
      .returning();
    res.json({ ok: true, location: row });
  } catch (err) {
    req.log?.error({ err }, "failed to create location");
    res.status(500).json({ error: "server_error" });
  }
});

router.put("/admin/settings/locations/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: "invalid_id" });
      return;
    }
    const parsed = upsertOfficeLocationSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "validation_failed", issues: parsed.error.flatten() });
      return;
    }
    const values: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
    for (const k of Object.keys(values)) {
      if (values[k] === "") values[k] = null;
    }
    const [row] = await db
      .update(officeLocationsTable)
      .set(values as Partial<typeof officeLocationsTable.$inferInsert>)
      .where(eq(officeLocationsTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    res.json({ ok: true, location: row });
  } catch (err) {
    req.log?.error({ err }, "failed to update location");
    res.status(500).json({ error: "server_error" });
  }
});

router.delete("/admin/settings/locations/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: "invalid_id" });
      return;
    }
    await db.delete(officeLocationsTable).where(eq(officeLocationsTable.id, id));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "server_error" });
  }
});

export default router;

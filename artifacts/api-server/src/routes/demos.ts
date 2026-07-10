import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import { db, productDemosTable, upsertProductDemoSchema, type ProductDemo } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

function publicShape(row: ProductDemo) {
  const { createdAt: _c, updatedAt: _u, ...rest } = row;
  return rest;
}

router.get("/public/demos", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(productDemosTable)
      .where(eq(productDemosTable.enabled, true))
      .orderBy(asc(productDemosTable.sortOrder), asc(productDemosTable.id));
    res.json({ demos: rows.map(publicShape) });
  } catch {
    res.status(500).json({ error: "server_error" });
  }
});

router.get("/admin/settings/demos", requireAdmin, async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(productDemosTable)
      .orderBy(asc(productDemosTable.sortOrder), asc(productDemosTable.id));
    res.json({ demos: rows });
  } catch {
    res.status(500).json({ error: "server_error" });
  }
});

router.post("/admin/settings/demos", requireAdmin, async (req, res) => {
  try {
    const parsed = upsertProductDemoSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "validation_failed", issues: parsed.error.flatten() });
      return;
    }
    const values: Record<string, unknown> = { ...parsed.data };
    for (const k of Object.keys(values)) if (values[k] === "") values[k] = null;
    const [row] = await db.insert(productDemosTable).values(values as typeof productDemosTable.$inferInsert).returning();
    res.json({ ok: true, demo: row });
  } catch (err) {
    req.log?.error({ err }, "failed to create demo");
    res.status(500).json({ error: "server_error" });
  }
});

router.put("/admin/settings/demos/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) { res.status(400).json({ error: "invalid_id" }); return; }
    const parsed = upsertProductDemoSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "validation_failed", issues: parsed.error.flatten() });
      return;
    }
    const values: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
    for (const k of Object.keys(values)) if (values[k] === "") values[k] = null;
    const [row] = await db
      .update(productDemosTable)
      .set(values as Partial<typeof productDemosTable.$inferInsert>)
      .where(eq(productDemosTable.id, id))
      .returning();
    if (!row) { res.status(404).json({ error: "not_found" }); return; }
    res.json({ ok: true, demo: row });
  } catch (err) {
    req.log?.error({ err }, "failed to update demo");
    res.status(500).json({ error: "server_error" });
  }
});

router.delete("/admin/settings/demos/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) { res.status(400).json({ error: "invalid_id" }); return; }
    await db.delete(productDemosTable).where(eq(productDemosTable.id, id));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "server_error" });
  }
});

export default router;

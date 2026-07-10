import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import {
  db,
  productsTable,
  upsertProductSchema,
  updateProductSchema,
  type Product,
} from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

function publicShape(row: Product) {
  const { createdAt: _c, updatedAt: _u, ...rest } = row;
  return rest;
}

router.get("/public/products", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.enabled, true))
      .orderBy(asc(productsTable.sortOrder), asc(productsTable.id));
    res.json({ products: rows.map(publicShape) });
  } catch (err) {
    res.status(500).json({ error: "server_error" });
  }
});

router.get("/admin/settings/products", requireAdmin, async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(productsTable)
      .orderBy(asc(productsTable.sortOrder), asc(productsTable.id));
    res.json({ products: rows });
  } catch {
    res.status(500).json({ error: "server_error" });
  }
});

function normaliseValues<T extends Record<string, unknown>>(input: T): T {
  const out: Record<string, unknown> = { ...input };
  for (const k of Object.keys(out)) {
    if (out[k] === "") out[k] = null;
  }
  return out as T;
}

router.post("/admin/settings/products", requireAdmin, async (req, res) => {
  try {
    const parsed = upsertProductSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "validation_failed", issues: parsed.error.flatten() });
      return;
    }
    const data = parsed.data;
    const values: typeof productsTable.$inferInsert = normaliseValues({
      ...data,
      key: data.key.toLowerCase(),
      features: data.features ?? [],
    }) as typeof productsTable.$inferInsert;

    const existing = await db
      .select({ id: productsTable.id })
      .from(productsTable)
      .where(eq(productsTable.key, values.key))
      .limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "key_already_exists" });
      return;
    }

    const [row] = await db.insert(productsTable).values(values).returning();
    res.json({ ok: true, product: row });
  } catch (err) {
    req.log?.error({ err }, "failed to create product");
    res.status(500).json({ error: "server_error" });
  }
});

router.put("/admin/settings/products/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: "invalid_id" });
      return;
    }
    const parsed = updateProductSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "validation_failed", issues: parsed.error.flatten() });
      return;
    }
    const patch: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
    if (typeof patch.key === "string") patch.key = patch.key.toLowerCase();
    for (const k of Object.keys(patch)) if (patch[k] === "") patch[k] = null;

    if (typeof patch.key === "string") {
      const conflict = await db
        .select({ id: productsTable.id })
        .from(productsTable)
        .where(eq(productsTable.key, patch.key as string))
        .limit(1);
      if (conflict.length > 0 && conflict[0].id !== id) {
        res.status(409).json({ error: "key_already_exists" });
        return;
      }
    }

    const [row] = await db
      .update(productsTable)
      .set(patch as Partial<typeof productsTable.$inferInsert>)
      .where(eq(productsTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    res.json({ ok: true, product: row });
  } catch (err) {
    req.log?.error({ err }, "failed to update product");
    res.status(500).json({ error: "server_error" });
  }
});

router.delete("/admin/settings/products/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: "invalid_id" });
      return;
    }
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "server_error" });
  }
});

export default router;

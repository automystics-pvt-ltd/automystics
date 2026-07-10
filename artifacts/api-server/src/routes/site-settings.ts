import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, siteSettingsTable, updateSiteSettingsSchema, type SiteSettings } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

async function readSettings(): Promise<SiteSettings | null> {
  const [row] = await db.select().from(siteSettingsTable).limit(1);
  return row ?? null;
}

function publicShape(row: SiteSettings | null) {
  if (!row) return null;
  const { id: _id, updatedAt: _u, ...rest } = row;
  return rest;
}

router.get("/public/site", async (_req, res) => {
  try {
    const row = await readSettings();
    res.json({ settings: publicShape(row) });
  } catch {
    res.status(500).json({ error: "server_error" });
  }
});

router.get("/admin/settings/site", requireAdmin, async (_req, res) => {
  try {
    const row = await readSettings();
    res.json({ settings: row });
  } catch {
    res.status(500).json({ error: "server_error" });
  }
});

router.put("/admin/settings/site", requireAdmin, async (req, res) => {
  try {
    const parsed = updateSiteSettingsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "validation_failed", issues: parsed.error.flatten() });
      return;
    }
    const data = parsed.data;
    const values: Record<string, unknown> = { ...data, updatedAt: new Date() };
    for (const k of Object.keys(values)) {
      if (values[k] === "") values[k] = null;
    }

    const existing = await readSettings();
    if (existing) {
      await db
        .update(siteSettingsTable)
        .set(values as Partial<typeof siteSettingsTable.$inferInsert>)
        .where(eq(siteSettingsTable.id, existing.id));
    } else {
      await db.insert(siteSettingsTable).values(values as typeof siteSettingsTable.$inferInsert);
    }
    const fresh = await readSettings();
    res.json({ ok: true, settings: fresh });
  } catch (err) {
    req.log?.error({ err }, "failed to update site settings");
    res.status(500).json({ error: "server_error" });
  }
});

export default router;

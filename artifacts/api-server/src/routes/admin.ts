import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { eq } from "drizzle-orm";
import {
  db,
  adminUsersTable,
  enquiriesTable,
  updateEnquirySchema,
} from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";
import emailSettingsRouter from "./admin-email";

const router: IRouter = Router();

router.use("/settings", emailSettingsRouter);

const loginSchema = z.object({
  username: z.string().trim().min(1).max(64),
  password: z.string().min(1).max(255),
});

const loginAttempts = new Map<string, { count: number; firstAt: number; lockedUntil: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const LOCK_MS = 15 * 60 * 1000;

function attemptKey(req: import("express").Request, username: string): string {
  const ip = (req.ip || req.socket.remoteAddress || "unknown").toString();
  return `${ip}|${username.toLowerCase()}`;
}

function checkLock(key: string): { locked: boolean; retryAfter?: number } {
  const rec = loginAttempts.get(key);
  if (!rec) return { locked: false };
  const now = Date.now();
  if (rec.lockedUntil > now) {
    return { locked: true, retryAfter: Math.ceil((rec.lockedUntil - now) / 1000) };
  }
  if (now - rec.firstAt > WINDOW_MS) {
    loginAttempts.delete(key);
  }
  return { locked: false };
}

function recordFailure(key: string): void {
  const now = Date.now();
  const rec = loginAttempts.get(key);
  if (!rec || now - rec.firstAt > WINDOW_MS) {
    loginAttempts.set(key, { count: 1, firstAt: now, lockedUntil: 0 });
    return;
  }
  rec.count += 1;
  if (rec.count >= MAX_ATTEMPTS) {
    rec.lockedUntil = now + LOCK_MS;
  }
}

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_failed" });
    return;
  }
  const key = attemptKey(req, parsed.data.username);
  const lock = checkLock(key);
  if (lock.locked) {
    res.setHeader("Retry-After", String(lock.retryAfter ?? 900));
    res.status(429).json({ error: "too_many_attempts", retryAfter: lock.retryAfter });
    return;
  }
  const [user] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.username, parsed.data.username.toLowerCase()))
    .limit(1);

  if (!user) {
    recordFailure(key);
    res.status(401).json({ error: "invalid_credentials" });
    return;
  }

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) {
    recordFailure(key);
    res.status(401).json({ error: "invalid_credentials" });
    return;
  }

  loginAttempts.delete(key);
  req.session.adminId = user.id;
  req.session.adminUsername = user.username;
  req.session.save((err) => {
    if (err) {
      res.status(500).json({ error: "session_error" });
      return;
    }
    res.json({ ok: true, username: user.username });
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("automystics.sid");
    res.json({ ok: true });
  });
});

router.get("/me", (req, res) => {
  if (!req.session?.adminId) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  res.json({ id: req.session.adminId, username: req.session.adminUsername });
});

router.get("/enquiries", requireAdmin, async (_req, res) => {
  const rows = await db
    .select()
    .from(enquiriesTable)
    .orderBy(enquiriesTable.createdAt);
  rows.reverse();
  res.json({ enquiries: rows });
});

router.patch("/enquiries/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "invalid_id" });
    return;
  }
  const parsed = updateEnquirySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_failed" });
    return;
  }
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.data.status !== undefined) updates.status = parsed.data.status;
  if (parsed.data.notes !== undefined) updates.notes = parsed.data.notes;

  const [row] = await db
    .update(enquiriesTable)
    .set(updates)
    .where(eq(enquiriesTable.id, id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({ ok: true, enquiry: row });
});

router.delete("/enquiries/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "invalid_id" });
    return;
  }
  await db.delete(enquiriesTable).where(eq(enquiriesTable.id, id));
  res.json({ ok: true });
});

export default router;

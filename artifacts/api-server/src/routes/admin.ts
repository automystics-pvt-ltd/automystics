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
import bookingSettingsRouter from "./admin-booking-settings";
import { sendAdminPasswordChangedNotification, sendAdminLockoutNotification } from "../lib/mailer";

const router: IRouter = Router();

router.use("/settings", emailSettingsRouter);
router.use("/settings", bookingSettingsRouter);

const loginSchema = z.object({
  username: z.string().trim().min(1).max(64),
  password: z.string().min(1).max(255),
});

const loginAttempts = new Map<string, { count: number; firstAt: number; lockedUntil: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const LOCK_MS = 15 * 60 * 1000;

// Throttle lockout emails so a sustained attack (possibly across many
// usernames/IPs) can't spam the admin's inbox. At most one lockout
// notification goes out per NOTIFY_THROTTLE_MS, regardless of how many
// individual keys are locking out in that window.
const NOTIFY_THROTTLE_MS = 15 * 60 * 1000;
let lastLockoutNotifiedAt = 0;

function clientIp(req: import("express").Request): string {
  return (req.ip || req.socket.remoteAddress || "unknown").toString();
}

function attemptKey(req: import("express").Request, username: string): string {
  return `${clientIp(req)}|${username.toLowerCase()}`;
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

function recordFailure(key: string, username: string, ip: string): void {
  const now = Date.now();
  const rec = loginAttempts.get(key);
  if (!rec || now - rec.firstAt > WINDOW_MS) {
    loginAttempts.set(key, { count: 1, firstAt: now, lockedUntil: 0 });
    return;
  }
  rec.count += 1;
  if (rec.count >= MAX_ATTEMPTS && rec.lockedUntil <= now) {
    rec.lockedUntil = now + LOCK_MS;
    notifyLockout(username, ip, rec.count, new Date(rec.lockedUntil));
  }
}

function notifyLockout(username: string, ip: string, attempts: number, lockedUntil: Date): void {
  const now = Date.now();
  if (now - lastLockoutNotifiedAt < NOTIFY_THROTTLE_MS) return;
  lastLockoutNotifiedAt = now;
  void sendAdminLockoutNotification({ username, ip, attempts, lockedUntil });
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
    recordFailure(key, parsed.data.username, clientIp(req));
    res.status(401).json({ error: "invalid_credentials" });
    return;
  }

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) {
    recordFailure(key, parsed.data.username, clientIp(req));
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

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(255),
  newPassword: z.string().min(8).max(255),
});

router.post("/change-password", requireAdmin, async (req, res) => {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_failed" });
    return;
  }

  const adminId = req.session.adminId as number;
  const [user] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.id, adminId))
    .limit(1);

  if (!user) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  const ok = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!ok) {
    res.status(400).json({ error: "invalid_current_password" });
    return;
  }

  if (parsed.data.newPassword === parsed.data.currentPassword) {
    res.status(400).json({ error: "password_unchanged" });
    return;
  }

  const hash = await bcrypt.hash(parsed.data.newPassword, 10);
  await db
    .update(adminUsersTable)
    .set({ passwordHash: hash })
    .where(eq(adminUsersTable.id, adminId));

  // Fire-and-forget: notify the admin's configured recipients that the
  // password changed, in case this wasn't the real admin doing it. Never
  // include the new password in the email.
  void sendAdminPasswordChangedNotification(new Date());

  // Invalidate the current session so the admin must sign back in with the
  // new password. This also protects against a stolen session being used to
  // keep changing the password indefinitely.
  req.session.destroy(() => {
    res.clearCookie("automystics.sid");
    res.json({ ok: true });
  });
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

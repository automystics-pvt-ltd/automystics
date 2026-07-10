import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import {
  db,
  emailSettingsTable,
  updateEmailSettingsSchema,
  testEmailSchema,
  type EmailSettings,
} from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";
import { buildTransport, fromAddress, getEmailSettings } from "../lib/mailer";
import { encryptSecret } from "../lib/crypto";

const router: IRouter = Router();

const PASSWORD_PLACEHOLDER = "__unchanged__";

function sanitize(row: EmailSettings | null) {
  if (!row) {
    return {
      smtpHost: "",
      smtpPort: 587,
      smtpSecure: false,
      smtpUser: "",
      hasPassword: false,
      fromEmail: "",
      fromName: "",
      notifyEmails: "",
      notifyOnNewEnquiry: true,
      enabled: false,
      updatedAt: null,
    };
  }
  return {
    smtpHost: row.smtpHost || "",
    smtpPort: row.smtpPort || 587,
    smtpSecure: !!row.smtpSecure,
    smtpUser: row.smtpUser || "",
    hasPassword: !!row.smtpPassword,
    fromEmail: row.fromEmail || "",
    fromName: row.fromName || "",
    notifyEmails: row.notifyEmails || "",
    notifyOnNewEnquiry: !!row.notifyOnNewEnquiry,
    enabled: !!row.enabled,
    updatedAt: row.updatedAt,
  };
}

router.get("/email", requireAdmin, async (_req, res) => {
  try {
    const row = await getEmailSettings();
    res.json({ settings: sanitize(row) });
  } catch (err) {
    res.status(500).json({ error: "server_error" });
  }
});

router.put("/email", requireAdmin, async (req, res) => {
  try {
  const parsed = updateEmailSettingsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_failed", issues: parsed.error.flatten() });
    return;
  }
  const data = parsed.data;
  const existing = await getEmailSettings();

  const values: Record<string, unknown> = {
    smtpHost: data.smtpHost ?? existing?.smtpHost ?? null,
    smtpPort: data.smtpPort ?? existing?.smtpPort ?? 587,
    smtpSecure: data.smtpSecure ?? existing?.smtpSecure ?? false,
    smtpUser: data.smtpUser ?? existing?.smtpUser ?? null,
    fromEmail: data.fromEmail ?? existing?.fromEmail ?? null,
    fromName: data.fromName ?? existing?.fromName ?? null,
    notifyEmails: data.notifyEmails ?? existing?.notifyEmails ?? null,
    notifyOnNewEnquiry: data.notifyOnNewEnquiry ?? existing?.notifyOnNewEnquiry ?? true,
    enabled: data.enabled ?? existing?.enabled ?? false,
    updatedAt: new Date(),
  };
  // empty strings -> null for optional text columns
  for (const k of ["smtpHost", "smtpUser", "fromEmail", "fromName", "notifyEmails"]) {
    if (values[k] === "") values[k] = null;
  }

  if (data.smtpPassword !== undefined && data.smtpPassword !== PASSWORD_PLACEHOLDER) {
    values.smtpPassword = data.smtpPassword ? encryptSecret(data.smtpPassword) : null;
  } else {
    values.smtpPassword = existing?.smtpPassword ?? null;
  }

  if (typeof values.notifyEmails === "string" && values.notifyEmails) {
    const list = (values.notifyEmails as string)
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const bad = list.find((e) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    if (bad) {
      res.status(400).json({ error: "invalid_recipient", message: `Not a valid email: ${bad}` });
      return;
    }
    values.notifyEmails = list.join(", ");
  }

  if (existing) {
    await db
      .update(emailSettingsTable)
      .set(values)
      .where(eq(emailSettingsTable.id, existing.id));
  } else {
    await db.insert(emailSettingsTable).values(values as typeof emailSettingsTable.$inferInsert);
  }

  const fresh = await getEmailSettings();
  res.json({ ok: true, settings: sanitize(fresh) });
  } catch (err) {
    req.log?.error({ err }, "failed to update email settings");
    res.status(500).json({ error: "server_error" });
  }
});

router.post("/email/test", requireAdmin, async (req, res) => {
  const parsed = testEmailSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_failed" });
    return;
  }
  const settings = await getEmailSettings();
  if (!settings || !settings.smtpHost || !settings.fromEmail) {
    res.status(400).json({ error: "smtp_not_configured", message: "Save SMTP host and From address before sending a test." });
    return;
  }
  try {
    const transport = await buildTransport(settings);
    await transport.sendMail({
      from: fromAddress(settings),
      to: parsed.data.to,
      subject: "Automystics — SMTP test email",
      text: "This is a test email from your Automystics admin console. SMTP is configured correctly.",
      html: `<div style="font-family:Inter,system-ui,sans-serif;color:#0a0612">
        <h2 style="color:#06b6d4">SMTP test successful</h2>
        <p>This test email was sent from your Automystics admin console. Your SMTP settings are working correctly.</p>
      </div>`,
    });
    res.json({ ok: true });
  } catch (err) {
    req.log?.error({ err }, "smtp test failed");
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(502).json({ error: "smtp_failed", message });
  }
});

export default router;

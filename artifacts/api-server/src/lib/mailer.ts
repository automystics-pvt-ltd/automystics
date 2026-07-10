import nodemailer, { type Transporter } from "nodemailer";
import { db, emailSettingsTable, type EmailSettings } from "@workspace/db";
import { logger } from "./logger";
import { decryptSecret } from "./crypto";
import { assertSafeSmtpHost } from "./smtp-host-guard";

export async function getEmailSettings(): Promise<EmailSettings | null> {
  const [row] = await db.select().from(emailSettingsTable).limit(1);
  return row ?? null;
}

export async function buildTransport(s: EmailSettings): Promise<Transporter> {
  await assertSafeSmtpHost(s.smtpHost ?? "");
  return nodemailer.createTransport({
    host: s.smtpHost ?? undefined,
    port: s.smtpPort ?? 587,
    secure: !!s.smtpSecure,
    auth: s.smtpUser ? { user: s.smtpUser, pass: decryptSecret(s.smtpPassword) } : undefined,
  });
}

export function fromAddress(s: EmailSettings): string {
  if (!s.fromEmail) return "";
  return s.fromName ? `"${s.fromName}" <${s.fromEmail}>` : s.fromEmail;
}

export type EnquiryEmailPayload = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  company?: string | null;
  message: string;
};

export async function sendEnquiryNotification(payload: EnquiryEmailPayload): Promise<void> {
  try {
    const settings = await getEmailSettings();
    if (!settings || !settings.enabled || !settings.notifyOnNewEnquiry) return;
    if (!settings.smtpHost || !settings.fromEmail || !settings.notifyEmails) return;

    const recipients = settings.notifyEmails
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (recipients.length === 0) return;

    const transport = await buildTransport(settings);
    const subject = `New enquiry from ${payload.firstName} ${payload.lastName}${payload.company ? ` (${payload.company})` : ""}`;
    const text = [
      `New enquiry received on the Automystics website.`,
      ``,
      `Name:    ${payload.firstName} ${payload.lastName}`,
      `Email:   ${payload.email}`,
      `Company: ${payload.company || "—"}`,
      ``,
      `Message:`,
      payload.message,
      ``,
      `View in admin: /admin`,
    ].join("\n");
    const html = `
      <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:0 auto;color:#0a0612">
        <h2 style="color:#06b6d4;margin:0 0 16px">New enquiry received</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
          <tr><td style="padding:6px 0;color:#64748b">Name</td><td style="padding:6px 0;font-weight:600">${escapeHtml(payload.firstName)} ${escapeHtml(payload.lastName)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Email</td><td style="padding:6px 0"><a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Company</td><td style="padding:6px 0">${escapeHtml(payload.company || "—")}</td></tr>
        </table>
        <h3 style="margin:0 0 8px">Message</h3>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;white-space:pre-wrap">${escapeHtml(payload.message)}</div>
        <p style="margin-top:24px;color:#64748b;font-size:13px">View and manage this enquiry in the admin console.</p>
      </div>
    `;

    await transport.sendMail({
      from: fromAddress(settings),
      to: recipients.join(", "),
      subject,
      text,
      html,
    });
    logger.info({ id: payload.id, recipients: recipients.length }, "enquiry notification sent");
  } catch (err) {
    logger.error({ err, id: payload.id }, "failed to send enquiry notification");
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

import nodemailer, { type Transporter } from "nodemailer";
import { db, emailSettingsTable, type EmailSettings } from "@workspace/db";
import { logger } from "./logger";
import { decryptSecret } from "./crypto";
import { assertSafeSmtpHost } from "./smtp-host-guard";
import { formatScheduledAt } from "./scheduling";

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

export type DemoRequestEmailPayload = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  productInterest?: string | null;
  scheduledAt?: string | null;
  message?: string | null;
};

export async function sendDemoRequestNotification(payload: DemoRequestEmailPayload): Promise<void> {
  try {
    const settings = await getEmailSettings();
    if (!settings || !settings.enabled || !settings.notifyOnNewDemoRequest) return;
    if (!settings.smtpHost || !settings.fromEmail || !settings.notifyEmails) return;

    const recipients = settings.notifyEmails
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (recipients.length === 0) return;

    const transport = await buildTransport(settings);
    const subject = `New demo request from ${payload.name}${payload.company ? ` (${payload.company})` : ""}`;
    const text = [
      `New demo request received on the Automystics website.`,
      ``,
      `Name:              ${payload.name}`,
      `Email:             ${payload.email}`,
      `Phone:             ${payload.phone || "—"}`,
      `Company:           ${payload.company || "—"}`,
      `Product interest:  ${payload.productInterest || "—"}`,
      `Scheduled for:     ${formatScheduledAt(payload.scheduledAt)}`,
      ``,
      `Message:`,
      payload.message || "—",
      ``,
      `View in admin: /admin`,
    ].join("\n");
    const html = `
      <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:0 auto;color:#0a0612">
        <h2 style="color:#06b6d4;margin:0 0 16px">New demo request received</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
          <tr><td style="padding:6px 0;color:#64748b">Name</td><td style="padding:6px 0;font-weight:600">${escapeHtml(payload.name)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Email</td><td style="padding:6px 0"><a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Phone</td><td style="padding:6px 0">${escapeHtml(payload.phone || "—")}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Company</td><td style="padding:6px 0">${escapeHtml(payload.company || "—")}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Product interest</td><td style="padding:6px 0">${escapeHtml(payload.productInterest || "—")}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Scheduled for</td><td style="padding:6px 0">${escapeHtml(formatScheduledAt(payload.scheduledAt))}</td></tr>
        </table>
        <h3 style="margin:0 0 8px">Message</h3>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;white-space:pre-wrap">${escapeHtml(payload.message || "—")}</div>
        <p style="margin-top:24px;color:#64748b;font-size:13px">View and manage this request in the admin console.</p>
      </div>
    `;

    await transport.sendMail({
      from: fromAddress(settings),
      to: recipients.join(", "),
      subject,
      text,
      html,
    });
    logger.info({ id: payload.id, recipients: recipients.length }, "demo request notification sent");
  } catch (err) {
    logger.error({ err, id: payload.id }, "failed to send demo request notification");
  }
}

export async function sendDemoRequestConfirmation(payload: DemoRequestEmailPayload): Promise<void> {
  try {
    const settings = await getEmailSettings();
    if (!settings || !settings.enabled || !settings.notifyVisitorOnDemoRequest) return;
    if (!settings.smtpHost || !settings.fromEmail) return;

    const transport = await buildTransport(settings);
    const subject = `We received your demo request — Automystics`;
    const text = [
      `Hi ${payload.name},`,
      ``,
      `Thanks for requesting a demo of Automystics${payload.productInterest ? ` for ${payload.productInterest}` : ""}!`,
      `We've received your request and a member of our team will reach out to ${payload.email} shortly to schedule a time.`,
      ``,
      `Here's a summary of what you submitted:`,
      `Name:              ${payload.name}`,
      `Email:             ${payload.email}`,
      `Phone:             ${payload.phone || "—"}`,
      `Company:           ${payload.company || "—"}`,
      `Product interest:  ${payload.productInterest || "—"}`,
      `Scheduled for:     ${formatScheduledAt(payload.scheduledAt)}`,
      payload.message ? `Message:           ${payload.message}` : undefined,
      ``,
      `If any of this looks incorrect or you'd like to add more details, just reply to this email.`,
      ``,
      `Talk soon,`,
      `The Automystics Team`,
    ]
      .filter((line): line is string => line !== undefined)
      .join("\n");
    const html = `
      <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:0 auto;color:#0a0612">
        <h2 style="color:#06b6d4;margin:0 0 16px">Thanks for requesting a demo!</h2>
        <p>Hi ${escapeHtml(payload.name)},</p>
        <p>Thanks for requesting a demo of Automystics${payload.productInterest ? ` for <strong>${escapeHtml(payload.productInterest)}</strong>` : ""}! We've received your request and a member of our team will reach out to <a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a> shortly to schedule a time.</p>
        <h3 style="margin:24px 0 8px">Your request</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
          <tr><td style="padding:6px 0;color:#64748b">Name</td><td style="padding:6px 0;font-weight:600">${escapeHtml(payload.name)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Email</td><td style="padding:6px 0">${escapeHtml(payload.email)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Phone</td><td style="padding:6px 0">${escapeHtml(payload.phone || "—")}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Company</td><td style="padding:6px 0">${escapeHtml(payload.company || "—")}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Product interest</td><td style="padding:6px 0">${escapeHtml(payload.productInterest || "—")}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Scheduled for</td><td style="padding:6px 0">${escapeHtml(formatScheduledAt(payload.scheduledAt))}</td></tr>
        </table>
        ${payload.message ? `<h3 style="margin:0 0 8px">Your message</h3><div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;white-space:pre-wrap">${escapeHtml(payload.message)}</div>` : ""}
        <p style="margin-top:24px;color:#64748b;font-size:13px">If any of this looks incorrect or you'd like to add more details, just reply to this email.</p>
      </div>
    `;

    await transport.sendMail({
      from: fromAddress(settings),
      to: payload.email,
      subject,
      text,
      html,
    });
    logger.info({ id: payload.id }, "demo request confirmation sent");
  } catch (err) {
    logger.error({ err, id: payload.id }, "failed to send demo request confirmation");
  }
}

export async function sendAdminPasswordChangedNotification(changedAt: Date): Promise<void> {
  try {
    const settings = await getEmailSettings();
    if (!settings || !settings.enabled) return;
    if (!settings.smtpHost || !settings.fromEmail || !settings.notifyEmails) return;

    const recipients = settings.notifyEmails
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (recipients.length === 0) return;

    const transport = await buildTransport(settings);
    const when = changedAt.toLocaleString("en-US", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "UTC",
    }) + " UTC";
    const subject = "Your Automystics admin password was changed";
    const text = [
      `This is a confirmation that the Automystics admin password was changed.`,
      ``,
      `When: ${when}`,
      ``,
      `If you made this change, no action is needed.`,
      `If you did not make this change, someone else may have access to your admin account — reset the password immediately and review recent activity.`,
    ].join("\n");
    const html = `
      <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:0 auto;color:#0a0612">
        <h2 style="color:#06b6d4;margin:0 0 16px">Admin password changed</h2>
        <p>This is a confirmation that the Automystics admin password was changed.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:6px 0;color:#64748b">When</td><td style="padding:6px 0;font-weight:600">${escapeHtml(when)}</td></tr>
        </table>
        <p>If you made this change, no action is needed.</p>
        <p style="color:#b91c1c;font-weight:600">If you did not make this change, someone else may have access to your admin account — reset the password immediately and review recent activity.</p>
      </div>
    `;

    await transport.sendMail({
      from: fromAddress(settings),
      to: recipients.join(", "),
      subject,
      text,
      html,
    });
    logger.info("admin password change notification sent");
  } catch (err) {
    logger.error({ err }, "failed to send admin password change notification");
  }
}

export async function sendAdminLockoutNotification(payload: {
  username: string;
  ip: string;
  attempts: number;
  lockedUntil: Date;
}): Promise<void> {
  try {
    const settings = await getEmailSettings();
    if (!settings || !settings.enabled) return;
    if (!settings.smtpHost || !settings.fromEmail || !settings.notifyEmails) return;

    const recipients = settings.notifyEmails
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (recipients.length === 0) return;

    const transport = await buildTransport(settings);
    const until = payload.lockedUntil.toLocaleString("en-US", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "UTC",
    }) + " UTC";
    const subject = "Automystics admin login locked — repeated failed attempts";
    const text = [
      `The Automystics admin login was locked out after ${payload.attempts} failed sign-in attempts.`,
      ``,
      `Username attempted: ${payload.username}`,
      `Source IP:          ${payload.ip}`,
      `Locked until:       ${until}`,
      ``,
      `If this wasn't you, someone may be trying to guess your admin password. No action is required — the account stays locked until the time above — but you may want to review activity once you're able to sign in again.`,
    ].join("\n");
    const html = `
      <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:0 auto;color:#0a0612">
        <h2 style="color:#b91c1c;margin:0 0 16px">Admin login locked — repeated failed attempts</h2>
        <p>The Automystics admin login was locked out after <strong>${payload.attempts}</strong> failed sign-in attempts.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:6px 0;color:#64748b">Username attempted</td><td style="padding:6px 0;font-weight:600">${escapeHtml(payload.username)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Source IP</td><td style="padding:6px 0;font-weight:600">${escapeHtml(payload.ip)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Locked until</td><td style="padding:6px 0;font-weight:600">${escapeHtml(until)}</td></tr>
        </table>
        <p>If this wasn't you, someone may be trying to guess your admin password. No action is required — the account stays locked until the time above — but you may want to review activity once you're able to sign in again.</p>
      </div>
    `;

    await transport.sendMail({
      from: fromAddress(settings),
      to: recipients.join(", "),
      subject,
      text,
      html,
    });
    logger.info({ username: payload.username, ip: payload.ip }, "admin lockout notification sent");
  } catch (err) {
    logger.error({ err }, "failed to send admin lockout notification");
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

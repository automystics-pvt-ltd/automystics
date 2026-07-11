import { pgTable, serial, varchar, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const emailSettingsTable = pgTable("email_settings", {
  id: serial("id").primaryKey(),
  smtpHost: varchar("smtp_host", { length: 255 }),
  smtpPort: integer("smtp_port"),
  smtpSecure: boolean("smtp_secure").notNull().default(false),
  smtpUser: varchar("smtp_user", { length: 255 }),
  smtpPassword: text("smtp_password"),
  fromEmail: varchar("from_email", { length: 255 }),
  fromName: varchar("from_name", { length: 255 }),
  notifyEmails: text("notify_emails"),
  notifyOnNewEnquiry: boolean("notify_on_new_enquiry").notNull().default(true),
  notifyOnNewDemoRequest: boolean("notify_on_new_demo_request").notNull().default(true),
  notifyVisitorOnDemoRequest: boolean("notify_visitor_on_demo_request").notNull().default(true),
  enabled: boolean("enabled").notNull().default(false),
  demoConfirmationSubject: varchar("demo_confirmation_subject", { length: 255 }),
  demoConfirmationBody: text("demo_confirmation_body"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Placeholders admins can use inside the demo confirmation subject/body template.
// Keep in sync with the substitution logic in artifacts/api-server/src/lib/mailer.ts.
export const DEMO_CONFIRMATION_PLACEHOLDERS = [
  "name",
  "email",
  "phone",
  "company",
  "productInterest",
  "scheduledAt",
  "message",
] as const;

export const DEFAULT_DEMO_CONFIRMATION_SUBJECT = "We received your demo request — Automystics";
export const DEFAULT_DEMO_CONFIRMATION_BODY = `Hi {{name}},

Thanks for requesting a demo of Automystics{{#productInterest}} for {{productInterest}}{{/productInterest}}!
We've received your request and a member of our team will reach out to {{email}} shortly to schedule a time.

Here's a summary of what you submitted:
Name:              {{name}}
Email:             {{email}}
Phone:             {{phone}}
Company:           {{company}}
Product interest:  {{productInterest}}
Scheduled for:     {{scheduledAt}}
{{#message}}Message:           {{message}}
{{/message}}
If any of this looks incorrect or you'd like to add more details, just reply to this email.

Talk soon,
The Automystics Team`;

export type EmailSettings = typeof emailSettingsTable.$inferSelect;

export const updateEmailSettingsSchema = z.object({
  smtpHost: z.string().trim().max(255).optional().or(z.literal("")),
  smtpPort: z.coerce.number().int().min(1).max(65535).optional(),
  smtpSecure: z.boolean().optional(),
  smtpUser: z.string().trim().max(255).optional().or(z.literal("")),
  smtpPassword: z.string().max(1024).optional(),
  fromEmail: z.string().trim().email().max(255).optional().or(z.literal("")),
  fromName: z.string().trim().max(255).optional().or(z.literal("")),
  notifyEmails: z.string().trim().max(2000).optional().or(z.literal("")),
  notifyOnNewEnquiry: z.boolean().optional(),
  notifyOnNewDemoRequest: z.boolean().optional(),
  notifyVisitorOnDemoRequest: z.boolean().optional(),
  enabled: z.boolean().optional(),
  demoConfirmationSubject: z.string().trim().max(255).optional().or(z.literal("")),
  demoConfirmationBody: z.string().max(10000).optional().or(z.literal("")),
});
export type UpdateEmailSettings = z.infer<typeof updateEmailSettingsSchema>;

export const testEmailSchema = z.object({
  to: z.string().trim().email(),
});

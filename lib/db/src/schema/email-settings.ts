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
  enabled: boolean("enabled").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

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
  enabled: z.boolean().optional(),
});
export type UpdateEmailSettings = z.infer<typeof updateEmailSettingsSchema>;

export const testEmailSchema = z.object({
  to: z.string().trim().email(),
});

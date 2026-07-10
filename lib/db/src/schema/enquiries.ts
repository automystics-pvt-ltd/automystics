import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";

export const enquiriesTable = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 120 }).notNull(),
  lastName: varchar("last_name", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  message: text("message").notNull(),
  status: varchar("status", { length: 32 }).notNull().default("new"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertEnquirySchema = z.object({
  firstName: z.string().trim().min(1).max(120),
  lastName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  company: z.string().trim().max(255).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(5000),
});

export type InsertEnquiry = z.infer<typeof insertEnquirySchema>;
export type Enquiry = typeof enquiriesTable.$inferSelect;

export const ENQUIRY_STATUSES = ["new", "in_progress", "contacted", "won", "lost"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const updateEnquirySchema = z.object({
  status: z.enum(ENQUIRY_STATUSES).optional(),
  notes: z.string().max(5000).optional(),
});
export type UpdateEnquiry = z.infer<typeof updateEnquirySchema>;

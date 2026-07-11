import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";

export const demoRequestsTable = pgTable("demo_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  company: varchar("company", { length: 255 }),
  productInterest: varchar("product_interest", { length: 120 }),
  preferredDate: varchar("preferred_date", { length: 64 }),
  message: text("message"),
  status: varchar("status", { length: 32 }).notNull().default("new"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDemoRequestSchema = z.object({
  name: z.string().trim().min(1).max(160),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(64).optional().or(z.literal("")),
  company: z.string().trim().max(255).optional().or(z.literal("")),
  productInterest: z.string().trim().max(120).optional().or(z.literal("")),
  preferredDate: z.string().trim().max(64).optional().or(z.literal("")),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
});

export type InsertDemoRequest = z.infer<typeof insertDemoRequestSchema>;
export type DemoRequest = typeof demoRequestsTable.$inferSelect;

export const DEMO_REQUEST_STATUSES = ["new", "contacted", "scheduled", "completed", "declined"] as const;
export type DemoRequestStatus = (typeof DEMO_REQUEST_STATUSES)[number];

export const updateDemoRequestSchema = z.object({
  status: z.enum(DEMO_REQUEST_STATUSES).optional(),
  notes: z.string().max(5000).optional(),
});
export type UpdateDemoRequest = z.infer<typeof updateDemoRequestSchema>;

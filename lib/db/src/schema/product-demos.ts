import { pgTable, serial, varchar, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const productDemosTable = pgTable("product_demos", {
  id: serial("id").primaryKey(),
  productKey: varchar("product_key", { length: 64 }),
  title: varchar("title", { length: 255 }).notNull(),
  tagline: varchar("tagline", { length: 255 }),
  description: text("description"),
  category: varchar("category", { length: 64 }),
  demoUrl: text("demo_url"),
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  demoUsername: varchar("demo_username", { length: 128 }),
  demoPassword: varchar("demo_password", { length: 128 }),
  ctaLabel: varchar("cta_label", { length: 64 }),
  badge: varchar("badge", { length: 64 }),
  enabled: boolean("enabled").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ProductDemo = typeof productDemosTable.$inferSelect;

const optionalString = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

export const upsertProductDemoSchema = z.object({
  productKey: optionalString(64),
  title: z.string().trim().min(1).max(255),
  tagline: optionalString(255),
  description: optionalString(4000),
  category: optionalString(64),
  demoUrl: optionalString(2000),
  videoUrl: optionalString(2000),
  thumbnailUrl: optionalString(2000),
  demoUsername: optionalString(128),
  demoPassword: optionalString(128),
  ctaLabel: optionalString(64),
  badge: optionalString(64),
  enabled: z.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional(),
});
export type UpsertProductDemo = z.infer<typeof upsertProductDemoSchema>;

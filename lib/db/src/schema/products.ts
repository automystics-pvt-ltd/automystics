import { pgTable, serial, varchar, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 64 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 128 }),
  description: text("description"),
  icon: varchar("icon", { length: 64 }),
  features: text("features").array().notNull().default([] as string[]),
  enabled: boolean("enabled").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Product = typeof productsTable.$inferSelect;

const optionalString = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

const slug = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i, "Use letters, numbers and dashes only");

export const upsertProductSchema = z.object({
  key: slug,
  title: z.string().trim().min(1).max(255),
  category: optionalString(128),
  description: optionalString(8000),
  icon: optionalString(64),
  features: z.array(z.string().trim().max(255)).max(50).optional(),
  enabled: z.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional(),
});
export type UpsertProduct = z.infer<typeof upsertProductSchema>;

export const updateProductSchema = upsertProductSchema.partial();
export type UpdateProduct = z.infer<typeof updateProductSchema>;

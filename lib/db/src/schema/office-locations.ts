import { pgTable, serial, varchar, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const officeLocationsTable = pgTable("office_locations", {
  id: serial("id").primaryKey(),
  label: varchar("label", { length: 128 }).notNull(),
  locationType: varchar("location_type", { length: 32 }).notNull().default("office"),
  addressLine1: varchar("address_line1", { length: 255 }),
  addressLine2: varchar("address_line2", { length: 255 }),
  city: varchar("city", { length: 128 }),
  state: varchar("state", { length: 128 }),
  postalCode: varchar("postal_code", { length: 32 }),
  country: varchar("country", { length: 128 }),
  phone: varchar("phone", { length: 64 }),
  email: varchar("email", { length: 255 }),
  mapUrl: text("map_url"),
  enabled: boolean("enabled").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type OfficeLocation = typeof officeLocationsTable.$inferSelect;

export const LOCATION_TYPES = [
  "headquarters",
  "branch",
  "sales",
  "support",
  "registered",
  "warehouse",
  "office",
] as const;
export type LocationType = (typeof LOCATION_TYPES)[number];

const optionalString = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));
const optionalEmail = (max: number) =>
  z.string().trim().max(max).email().optional().or(z.literal(""));

export const upsertOfficeLocationSchema = z.object({
  label: z.string().trim().min(1).max(128),
  locationType: z.enum(LOCATION_TYPES).default("office"),
  addressLine1: optionalString(255),
  addressLine2: optionalString(255),
  city: optionalString(128),
  state: optionalString(128),
  postalCode: optionalString(32),
  country: optionalString(128),
  phone: optionalString(64),
  email: optionalEmail(255),
  mapUrl: optionalString(2000),
  enabled: z.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional(),
});
export type UpsertOfficeLocation = z.infer<typeof upsertOfficeLocationSchema>;

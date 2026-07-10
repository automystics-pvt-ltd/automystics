import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  companyName: varchar("company_name", { length: 255 }),
  tagline: varchar("tagline", { length: 255 }),
  primaryEmail: varchar("primary_email", { length: 255 }),
  supportEmail: varchar("support_email", { length: 255 }),
  legalEmail: varchar("legal_email", { length: 255 }),
  privacyEmail: varchar("privacy_email", { length: 255 }),
  primaryPhone: varchar("primary_phone", { length: 64 }),
  secondaryPhone: varchar("secondary_phone", { length: 64 }),
  addressLine1: varchar("address_line1", { length: 255 }),
  addressLine2: varchar("address_line2", { length: 255 }),
  city: varchar("city", { length: 128 }),
  state: varchar("state", { length: 128 }),
  postalCode: varchar("postal_code", { length: 32 }),
  country: varchar("country", { length: 128 }),
  mapUrl: text("map_url"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type SiteSettings = typeof siteSettingsTable.$inferSelect;

const optionalString = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));
const optionalEmail = (max: number) =>
  z.string().trim().max(max).email().optional().or(z.literal(""));

export const updateSiteSettingsSchema = z.object({
  companyName: optionalString(255),
  tagline: optionalString(255),
  primaryEmail: optionalEmail(255),
  supportEmail: optionalEmail(255),
  legalEmail: optionalEmail(255),
  privacyEmail: optionalEmail(255),
  primaryPhone: optionalString(64),
  secondaryPhone: optionalString(64),
  addressLine1: optionalString(255),
  addressLine2: optionalString(255),
  city: optionalString(128),
  state: optionalString(128),
  postalCode: optionalString(32),
  country: optionalString(128),
  mapUrl: optionalString(2000),
});
export type UpdateSiteSettings = z.infer<typeof updateSiteSettingsSchema>;

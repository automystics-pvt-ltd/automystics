import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const adminUsersTable = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type AdminUser = typeof adminUsersTable.$inferSelect;

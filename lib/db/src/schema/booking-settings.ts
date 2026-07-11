import { pgTable, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

// Admin-configurable demo booking availability. Business hours/days/blocked
// dates are all in the fixed IST business timezone (see lib/scheduling.ts).
export const bookingSettingsTable = pgTable("booking_settings", {
  id: serial("id").primaryKey(),
  // 0=Sunday..6=Saturday. Days not in this list have no bookable slots.
  bookableWeekdays: jsonb("bookable_weekdays").$type<number[]>().notNull().default([1, 2, 3, 4, 5]),
  startHour: integer("start_hour").notNull().default(10),
  endHour: integer("end_hour").notNull().default(18),
  // Optional break window (e.g. lunch). Both null means no break.
  breakStartHour: integer("break_start_hour"),
  breakEndHour: integer("break_end_hour"),
  // Holidays / closures as "YYYY-MM-DD" strings, in the business timezone.
  blockedDates: jsonb("blocked_dates").$type<string[]>().notNull().default([]),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type BookingSettings = typeof bookingSettingsTable.$inferSelect;

export const DEFAULT_BOOKING_SETTINGS: Omit<BookingSettings, "id" | "updatedAt"> = {
  bookableWeekdays: [1, 2, 3, 4, 5],
  startHour: 10,
  endHour: 18,
  breakStartHour: 13,
  breakEndHour: 14,
  blockedDates: [],
};

const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");

export const updateBookingSettingsSchema = z
  .object({
    bookableWeekdays: z.array(z.number().int().min(0).max(6)).max(7).optional(),
    startHour: z.coerce.number().int().min(0).max(23).optional(),
    endHour: z.coerce.number().int().min(0).max(23).optional(),
    breakStartHour: z.coerce.number().int().min(0).max(23).nullable().optional(),
    breakEndHour: z.coerce.number().int().min(0).max(23).nullable().optional(),
    blockedDates: z.array(dateStringSchema).max(365).optional(),
  })
  .superRefine((data, ctx) => {
    const startHour = data.startHour;
    const endHour = data.endHour;
    if (startHour !== undefined && endHour !== undefined && endHour <= startHour) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End hour must be after start hour",
        path: ["endHour"],
      });
    }
    const hasBreakStart = data.breakStartHour !== undefined && data.breakStartHour !== null;
    const hasBreakEnd = data.breakEndHour !== undefined && data.breakEndHour !== null;
    if (hasBreakStart !== hasBreakEnd) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Both break start and end hour must be set together, or both left empty",
        path: ["breakEndHour"],
      });
    }
    if (hasBreakStart && hasBreakEnd && (data.breakEndHour as number) <= (data.breakStartHour as number)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Break end hour must be after break start hour",
        path: ["breakEndHour"],
      });
    }
  });
export type UpdateBookingSettings = z.infer<typeof updateBookingSettingsSchema>;

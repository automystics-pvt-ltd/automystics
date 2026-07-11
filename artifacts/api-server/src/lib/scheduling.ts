// Demo booking slot logic. Business hours/days are fixed in India Standard
// Time (IST, UTC+5:30, no DST) since Automystics operates out of India, but
// which weekdays/hours/blocked dates are bookable is admin-configurable
// (see booking-settings.ts schema + routes/admin-booking-settings.ts).

import { db, bookingSettingsTable, DEFAULT_BOOKING_SETTINGS, type BookingSettings } from "@workspace/db";

export const BOOKING_TIMEZONE_LABEL = "IST (India Standard Time)";

const TIMEZONE_OFFSET_MINUTES = 330; // Asia/Kolkata
const MIN_LEAD_TIME_MS = 2 * 60 * 60 * 1000; // must book at least 2 hours ahead
const MAX_DAYS_AHEAD = 30;

export type DemoSlot = { hour: number; label: string; iso: string };
export type CalendarDate = { y: number; m: number; d: number };

function istHourToUtcDate(y: number, m: number, d: number, hour: number): Date {
  return new Date(Date.UTC(y, m - 1, d, hour, 0, 0, 0) - TIMEZONE_OFFSET_MINUTES * 60_000);
}

function formatSlotLabel(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:00 ${period}`;
}

function dateKey(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function parseDateParam(dateStr: string): CalendarDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const check = new Date(Date.UTC(y, m - 1, d));
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== m - 1 || check.getUTCDate() !== d) {
    return null;
  }
  return { y, m, d };
}

// Cache the single settings row briefly so a burst of slot lookups (e.g. a
// visitor paging through a calendar) doesn't hit the DB per-day. Any admin
// update clears the cache immediately via clearBookingSettingsCache().
let cached: { settings: BookingSettings; expiresAt: number } | null = null;
const CACHE_TTL_MS = 30_000;

export function clearBookingSettingsCache(): void {
  cached = null;
}

export async function getBookingSettings(): Promise<BookingSettings> {
  if (cached && cached.expiresAt > Date.now()) return cached.settings;
  const [row] = await db.select().from(bookingSettingsTable).limit(1);
  const settings: BookingSettings =
    row ??
    ({
      id: 0,
      updatedAt: new Date(0),
      ...DEFAULT_BOOKING_SETTINGS,
    } as BookingSettings);
  cached = { settings, expiresAt: Date.now() + CACHE_TTL_MS };
  return settings;
}

function slotHoursFor(settings: BookingSettings): number[] {
  const hours: number[] = [];
  for (let h = settings.startHour; h < settings.endHour; h++) {
    if (
      settings.breakStartHour !== null &&
      settings.breakEndHour !== null &&
      h >= settings.breakStartHour &&
      h < settings.breakEndHour
    ) {
      continue;
    }
    hours.push(h);
  }
  return hours;
}

export function isBookableWeekday(y: number, m: number, d: number, settings: BookingSettings): boolean {
  const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return settings.bookableWeekdays.includes(day);
}

function isBlockedDate(y: number, m: number, d: number, settings: BookingSettings): boolean {
  return settings.blockedDates.includes(dateKey(y, m, d));
}

export function istCalendarDateForInstant(instant: Date): CalendarDate {
  const shifted = new Date(instant.getTime() + TIMEZONE_OFFSET_MINUTES * 60_000);
  return { y: shifted.getUTCFullYear(), m: shifted.getUTCMonth() + 1, d: shifted.getUTCDate() };
}

export function isWithinBookingWindow(y: number, m: number, d: number, now: Date): boolean {
  const today = istCalendarDateForInstant(now);
  const target = Date.UTC(y, m - 1, d);
  const todayUtc = Date.UTC(today.y, today.m - 1, today.d);
  const diffDays = Math.round((target - todayUtc) / 86_400_000);
  return diffDays >= 0 && diffDays <= MAX_DAYS_AHEAD;
}

export async function getDaySlots(y: number, m: number, d: number, now: Date = new Date()): Promise<DemoSlot[]> {
  const settings = await getBookingSettings();
  if (!isBookableWeekday(y, m, d, settings)) return [];
  if (isBlockedDate(y, m, d, settings)) return [];
  if (!isWithinBookingWindow(y, m, d, now)) return [];
  return slotHoursFor(settings)
    .map((hour) => ({
      hour,
      label: formatSlotLabel(hour),
      iso: istHourToUtcDate(y, m, d, hour).toISOString(),
    }))
    .filter((slot) => new Date(slot.iso).getTime() - now.getTime() >= MIN_LEAD_TIME_MS);
}

export async function isValidSlotIso(y: number, m: number, d: number, iso: string, now: Date = new Date()): Promise<boolean> {
  const daySlots = await getDaySlots(y, m, d, now);
  return daySlots.some((s) => s.iso === iso);
}

export function getIstDayRangeUtc(y: number, m: number, d: number): { start: Date; end: Date } {
  return { start: istHourToUtcDate(y, m, d, 0), end: istHourToUtcDate(y, m, d, 24) };
}

export function formatScheduledAt(input: Date | string | null | undefined): string {
  if (!input) return "—";
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return "—";
  try {
    return (
      new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(date) + " IST"
    );
  } catch {
    return "—";
  }
}

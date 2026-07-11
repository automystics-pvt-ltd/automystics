// Demo booking slot logic. Business hours are fixed in India Standard Time
// (IST, UTC+5:30, no DST) since Automystics operates out of India.

export const BOOKING_TIMEZONE_LABEL = "IST (India Standard Time)";

const TIMEZONE_OFFSET_MINUTES = 330; // Asia/Kolkata
const SLOT_HOURS = [10, 11, 12, 14, 15, 16, 17]; // hourly slots, lunch break 13:00-14:00
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

export function isBookableWeekday(y: number, m: number, d: number): boolean {
  const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return day !== 0 && day !== 6; // exclude Sat/Sun
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

export function getDaySlots(y: number, m: number, d: number, now: Date = new Date()): DemoSlot[] {
  if (!isBookableWeekday(y, m, d)) return [];
  if (!isWithinBookingWindow(y, m, d, now)) return [];
  return SLOT_HOURS.map((hour) => ({
    hour,
    label: formatSlotLabel(hour),
    iso: istHourToUtcDate(y, m, d, hour).toISOString(),
  })).filter((slot) => new Date(slot.iso).getTime() - now.getTime() >= MIN_LEAD_TIME_MS);
}

export function isValidSlotIso(y: number, m: number, d: number, iso: string, now: Date = new Date()): boolean {
  return getDaySlots(y, m, d, now).some((s) => s.iso === iso);
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

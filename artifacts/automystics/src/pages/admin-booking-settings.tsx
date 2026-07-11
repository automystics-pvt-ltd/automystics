import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CalendarClock, Clock, Plus, Save, Trash2 } from "lucide-react";

type BookingSettings = {
  bookableWeekdays: number[];
  startHour: number;
  endHour: number;
  breakStartHour: number | null;
  breakEndHour: number | null;
  blockedDates: string[];
  updatedAt?: string | null;
};

const EMPTY: BookingSettings = {
  bookableWeekdays: [1, 2, 3, 4, 5],
  startHour: 10,
  endHour: 18,
  breakStartHour: 13,
  breakEndHour: 14,
  blockedDates: [],
};

const WEEKDAYS = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

const HOURS = Array.from({ length: 24 }, (_, h) => h);

function formatHour(h: number): string {
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:00 ${period}`;
}

function HourSelect({ id, value, onChange, testId }: { id: string; value: number; onChange: (v: number) => void; testId?: string }) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-11 rounded-xl px-3 bg-white border border-card-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      data-testid={testId}
    >
      {HOURS.map((h) => (
        <option key={h} value={h}>{formatHour(h)}</option>
      ))}
    </select>
  );
}

export function AdminBookingSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [s, setS] = useState<BookingSettings>(EMPTY);
  const [hasBreak, setHasBreak] = useState(true);
  const [newBlockedDate, setNewBlockedDate] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings/booking", { credentials: "include" });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const json = await res.json();
      const data = json.settings || {};
      const merged: BookingSettings = {
        bookableWeekdays: data.bookableWeekdays ?? EMPTY.bookableWeekdays,
        startHour: data.startHour ?? EMPTY.startHour,
        endHour: data.endHour ?? EMPTY.endHour,
        breakStartHour: data.breakStartHour ?? null,
        breakEndHour: data.breakEndHour ?? null,
        blockedDates: data.blockedDates ?? [],
        updatedAt: data.updatedAt ?? null,
      };
      setS(merged);
      setHasBreak(merged.breakStartHour !== null && merged.breakEndHour !== null);
    } catch {
      toast({ title: "Could not load booking settings", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleWeekday = (value: number) => {
    setS((prev) => {
      const has = prev.bookableWeekdays.includes(value);
      const next = has ? prev.bookableWeekdays.filter((d) => d !== value) : [...prev.bookableWeekdays, value].sort();
      return { ...prev, bookableWeekdays: next };
    });
  };

  const addBlockedDate = () => {
    if (!newBlockedDate) return;
    if (s.blockedDates.includes(newBlockedDate)) {
      setNewBlockedDate("");
      return;
    }
    setS((prev) => ({ ...prev, blockedDates: [...prev.blockedDates, newBlockedDate].sort() }));
    setNewBlockedDate("");
  };

  const removeBlockedDate = (date: string) => {
    setS((prev) => ({ ...prev, blockedDates: prev.blockedDates.filter((d) => d !== date) }));
  };

  const save = async () => {
    if (s.endHour <= s.startHour) {
      toast({ title: "Invalid hours", description: "End hour must be after start hour.", variant: "destructive" });
      return;
    }
    if (hasBreak && (s.breakStartHour === null || s.breakEndHour === null || s.breakEndHour <= s.breakStartHour)) {
      toast({ title: "Invalid break", description: "Break end hour must be after break start hour.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        bookableWeekdays: s.bookableWeekdays,
        startHour: s.startHour,
        endHour: s.endHour,
        breakStartHour: hasBreak ? s.breakStartHour : null,
        breakEndHour: hasBreak ? s.breakEndHour : null,
        blockedDates: s.blockedDates,
      };
      const res = await fetch("/api/admin/settings/booking", {
        method: "PUT",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        const msg = json?.issues
          ? Object.entries(json.issues.fieldErrors || {}).map(([k, v]: [string, any]) => `${k}: ${(v as string[]).join(", ")}`).join("; ")
          : json?.message || "Save failed";
        throw new Error(msg);
      }
      toast({ title: "Booking hours saved", description: "Visitors will see the updated availability immediately." });
      await load();
    } catch (err: any) {
      toast({ title: "Could not save", description: err?.message || "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground">Loading booking settings…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-card-border rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 flex items-center justify-center">
            <CalendarClock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Bookable Days</h3>
            <p className="text-sm text-muted-foreground">Which weekdays visitors can book a demo. Times are shown in IST (India Standard Time).</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2" data-testid="booking-weekdays">
          {WEEKDAYS.map((wd) => {
            const active = s.bookableWeekdays.includes(wd.value);
            return (
              <button
                key={wd.value}
                type="button"
                onClick={() => toggleWeekday(wd.value)}
                data-testid={`booking-weekday-${wd.value}`}
                className={`h-11 px-5 rounded-xl border text-sm font-semibold transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "bg-white border-card-border text-foreground hover:border-primary/50"
                }`}
              >
                {wd.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-card-border rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Business Hours</h3>
            <p className="text-sm text-muted-foreground">Bookable window and an optional break (e.g. lunch).</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="startHour" className="text-foreground font-semibold">Opens at</Label>
            <HourSelect id="startHour" value={s.startHour} onChange={(v) => setS((p) => ({ ...p, startHour: v }))} testId="booking-start-hour" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endHour" className="text-foreground font-semibold">Closes at</Label>
            <HourSelect id="endHour" value={s.endHour} onChange={(v) => setS((p) => ({ ...p, endHour: v }))} testId="booking-end-hour" />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-card-border">
          <label className="flex items-center gap-3 mb-4 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hasBreak}
              onChange={(e) => setHasBreak(e.target.checked)}
              className="w-4 h-4 rounded border-card-border accent-primary"
              data-testid="booking-has-break"
            />
            <span className="text-foreground font-semibold">Block out a break (e.g. lunch)</span>
          </label>
          {hasBreak && (
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="breakStartHour" className="text-foreground font-semibold">Break starts</Label>
                <HourSelect
                  id="breakStartHour"
                  value={s.breakStartHour ?? 13}
                  onChange={(v) => setS((p) => ({ ...p, breakStartHour: v }))}
                  testId="booking-break-start-hour"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="breakEndHour" className="text-foreground font-semibold">Break ends</Label>
                <HourSelect
                  id="breakEndHour"
                  value={s.breakEndHour ?? 14}
                  onChange={(v) => setS((p) => ({ ...p, breakEndHour: v }))}
                  testId="booking-break-end-hour"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-card-border rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Blocked Dates</h3>
            <p className="text-sm text-muted-foreground">Holidays or closures with no bookable slots, even on a bookable weekday.</p>
          </div>
        </div>
        <div className="flex gap-3 mb-5">
          <Input
            type="date"
            value={newBlockedDate}
            onChange={(e) => setNewBlockedDate(e.target.value)}
            className="bg-white border-card-border h-11 rounded-xl max-w-xs"
            data-testid="booking-new-blocked-date"
          />
          <Button
            type="button"
            onClick={addBlockedDate}
            disabled={!newBlockedDate}
            variant="outline"
            className="rounded-xl border-card-border"
            data-testid="booking-add-blocked-date"
          >
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        </div>
        {s.blockedDates.length === 0 ? (
          <p className="text-sm text-muted-foreground">No blocked dates yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2" data-testid="booking-blocked-dates-list">
            {s.blockedDates.map((date) => (
              <span
                key={date}
                className="inline-flex items-center gap-2 h-10 pl-4 pr-2 rounded-xl bg-muted/50 border border-card-border text-sm font-medium text-foreground"
              >
                {date}
                <button
                  type="button"
                  onClick={() => removeBlockedDate(date)}
                  aria-label={`Remove ${date}`}
                  className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground"
                  data-testid={`booking-remove-blocked-date-${date}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={save}
          disabled={saving}
          className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 px-8 shadow-lg shadow-primary/20"
          data-testid="save-booking-settings"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving…" : "Save booking hours"}
        </Button>
      </div>
    </div>
  );
}

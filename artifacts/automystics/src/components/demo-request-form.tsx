import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { CalendarCheck, CheckCircle2, ArrowUpRight, Clock } from "lucide-react";
import type { PublicDemo } from "@/hooks/use-demos";

type DemoSlot = { hour: number; label: string; iso: string; available: boolean };

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function DemoRequestForm({ demos }: { demos: PublicDemo[] }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [slots, setSlots] = useState<DemoSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlotIso, setSelectedSlotIso] = useState<string | null>(null);
  const [timezoneLabel, setTimezoneLabel] = useState("IST");
  const [bookableWeekdays, setBookableWeekdays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 30);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/demo-requests/booking-config")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data.bookableWeekdays)) setBookableWeekdays(data.bookableWeekdays);
        if (Array.isArray(data.blockedDates)) setBlockedDates(data.blockedDates);
        if (data.timezone) setTimezoneLabel(data.timezone);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      return;
    }
    let cancelled = false;
    setLoadingSlots(true);
    setSelectedSlotIso(null);
    fetch(`/api/demo-requests/available-slots?date=${toDateKey(selectedDate)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setSlots(data.slots || []);
        if (data.timezone) setTimezoneLabel(data.timezone);
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!selectedSlotIso) {
      toast({
        title: "Pick a date and time",
        description: "Choose an available slot before booking your demo.",
        variant: "destructive",
      });
      return;
    }
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      company: String(data.get("company") || "").trim(),
      productInterest: String(data.get("productInterest") || "").trim(),
      scheduledAt: selectedSlotIso,
      message: String(data.get("message") || "").trim(),
    };
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/demo-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (err?.error === "slot_unavailable") {
          throw new Error("slot_unavailable");
        }
        throw new Error(err?.error || "request_failed");
      }
      setIsSuccess(true);
      form.reset();
      setSelectedDate(undefined);
      setSelectedSlotIso(null);
      setSlots([]);
      toast({
        title: "Demo request received",
        description: "Our team will meet you at your chosen time.",
      });
    } catch (err) {
      const isSlotConflict = err instanceof Error && err.message === "slot_unavailable";
      toast({
        title: isSlotConflict ? "That slot was just booked" : "Could not send your request",
        description: isSlotConflict
          ? "Please pick another available time."
          : "Please try again in a moment.",
        variant: "destructive",
      });
      if (isSlotConflict && selectedDate) {
        setSelectedSlotIso(null);
        fetch(`/api/demo-requests/available-slots?date=${toDateKey(selectedDate)}`)
          .then((r) => r.json())
          .then((d) => setSlots(d.slots || []))
          .catch(() => {});
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      id="book-a-demo"
      className="bg-white border border-card-border rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-black/5 relative overflow-hidden card-hover-effect scroll-mt-32"
      data-testid="demo-request-form"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {isSuccess ? (
        <div className="text-center py-16 relative z-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-8 border border-primary/30">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-3xl font-bold text-foreground mb-4 tracking-tight">Request Received</h3>
          <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
            Thank you — a specialist will reach out to schedule your personal walkthrough.
          </p>
          <Button onClick={() => setIsSuccess(false)} variant="outline" className="rounded-full h-12 px-8 border-card-border text-foreground font-semibold bg-white hover:bg-muted">
            Book Another Demo
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-card-border shadow-sm text-primary text-sm font-bold mb-4 uppercase tracking-wide">
              <CalendarCheck className="w-4 h-4" /> Prefer a guided tour?
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Book a Personal Demo</h3>
            <p className="text-muted-foreground mt-2">
              Tell us what you're looking for and our team will walk you through it live.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="demo-name" className="text-foreground font-semibold ml-1">Full Name</Label>
              <Input id="demo-name" name="name" required className="bg-white border-card-border focus-visible:ring-primary h-14 rounded-2xl px-4 text-lg shadow-sm" placeholder="John Doe" data-testid="demo-request-name" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="demo-email" className="text-foreground font-semibold ml-1">Work Email</Label>
              <Input id="demo-email" name="email" type="email" required className="bg-white border-card-border focus-visible:ring-primary h-14 rounded-2xl px-4 text-lg shadow-sm" placeholder="john@company.com" data-testid="demo-request-email" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="demo-phone" className="text-foreground font-semibold ml-1">Phone (optional)</Label>
              <Input id="demo-phone" name="phone" className="bg-white border-card-border focus-visible:ring-primary h-14 rounded-2xl px-4 text-lg shadow-sm" placeholder="+91 98765 43210" data-testid="demo-request-phone" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="demo-company" className="text-foreground font-semibold ml-1">Company (optional)</Label>
              <Input id="demo-company" name="company" className="bg-white border-card-border focus-visible:ring-primary h-14 rounded-2xl px-4 text-lg shadow-sm" placeholder="Acme Corp" data-testid="demo-request-company" />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="demo-product" className="text-foreground font-semibold ml-1">Which product? (optional)</Label>
            {demos.length > 0 ? (
              <select
                id="demo-product"
                name="productInterest"
                className="w-full h-14 rounded-2xl px-4 text-lg shadow-sm bg-white border border-card-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                data-testid="demo-request-product"
              >
                <option value="">Not sure yet</option>
                {demos.map((d) => (
                  <option key={d.id} value={d.title}>{d.title}</option>
                ))}
              </select>
            ) : (
              <Input id="demo-product" name="productInterest" className="bg-white border-card-border focus-visible:ring-primary h-14 rounded-2xl px-4 text-lg shadow-sm" placeholder="e.g. Chit Fund Management" data-testid="demo-request-product" />
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-foreground font-semibold ml-1">Pick a date &amp; time</Label>
            <p className="text-sm text-muted-foreground ml-1">
              Times are shown in {timezoneLabel}.
            </p>
            <div className="grid md:grid-cols-2 gap-6 bg-muted/30 border border-card-border rounded-2xl p-4 md:p-6">
              <div className="flex justify-center md:justify-start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) =>
                    date < today ||
                    date > maxDate ||
                    !bookableWeekdays.includes(date.getDay()) ||
                    blockedDates.includes(toDateKey(date))
                  }
                  data-testid="demo-request-calendar"
                />
              </div>
              <div>
                {!selectedDate ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm py-8">
                    Select a date to see available times.
                  </div>
                ) : loadingSlots ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm py-8">
                    Loading available times…
                  </div>
                ) : slots.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm py-8 text-center">
                    No slots left for this day. Please try another date.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3" data-testid="demo-request-slots">
                    {slots.map((slot) => (
                      <button
                        key={slot.iso}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedSlotIso(slot.iso)}
                        data-testid={`demo-slot-${slot.hour}`}
                        className={`h-12 rounded-xl border text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                          selectedSlotIso === slot.iso
                            ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                            : slot.available
                              ? "bg-white border-card-border hover:border-primary/50 text-foreground"
                              : "bg-muted text-muted-foreground border-card-border/60 line-through cursor-not-allowed opacity-60"
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" /> {slot.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="demo-message" className="text-foreground font-semibold ml-1">What would you like to see? (optional)</Label>
            <Textarea
              id="demo-message"
              name="message"
              className="min-h-[120px] bg-white border-card-border focus-visible:ring-primary resize-none rounded-2xl p-4 text-lg shadow-sm"
              placeholder="Tell us about your use case or specific questions..."
              data-testid="demo-request-message"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !selectedSlotIso}
            className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg h-16 group shadow-lg shadow-primary/20 disabled:opacity-60"
            data-testid="demo-request-submit"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Sending...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                Book My Demo
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            )}
          </Button>
        </form>
      )}
    </motion.div>
  );
}

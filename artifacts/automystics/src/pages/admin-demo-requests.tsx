import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  CalendarCheck,
  Mail,
  Phone,
  Building2,
  Calendar,
  CalendarClock,
  CalendarX,
  ChevronDown,
  ChevronUp,
  Clock,
  Package,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";

type DemoRequest = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  productInterest: string | null;
  scheduledAt: string | null;
  preferredDate: string | null;
  message: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "declined", label: "Declined" },
];

function formatScheduledAt(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
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
}

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

type AdminSlot = { hour: number; label: string; iso: string; available: boolean };

const STATUS_COLORS: Record<string, string> = {
  new: "bg-gradient-to-br from-primary/10 to-secondary/10 text-primary border-primary/40",
  contacted: "bg-purple-100 text-purple-800 border-purple-300",
  scheduled: "bg-amber-100 text-amber-800 border-amber-300",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-300",
  declined: "bg-rose-100 text-rose-800 border-rose-300",
};

export function AdminDemoRequests() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [draftNotes, setDraftNotes] = useState<Record<number, string>>({});
  const [reschedulingId, setReschedulingId] = useState<number | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(undefined);
  const [rescheduleSlots, setRescheduleSlots] = useState<AdminSlot[]>([]);
  const [loadingRescheduleSlots, setLoadingRescheduleSlots] = useState(false);
  const [savingReschedule, setSavingReschedule] = useState(false);
  const [bookableWeekdays, setBookableWeekdays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxRescheduleDate = new Date(today);
  maxRescheduleDate.setDate(maxRescheduleDate.getDate() + 30);

  useEffect(() => {
    fetch("/api/demo-requests/booking-config")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.bookableWeekdays)) setBookableWeekdays(data.bookableWeekdays);
        if (Array.isArray(data.blockedDates)) setBlockedDates(data.blockedDates);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!reschedulingId || !rescheduleDate) {
      setRescheduleSlots([]);
      return;
    }
    let cancelled = false;
    setLoadingRescheduleSlots(true);
    fetch(`/api/admin/demo-requests/${reschedulingId}/available-slots?date=${toDateKey(rescheduleDate)}`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) { handleUnauthorized(); return null; }
        return res.json();
      })
      .then((data) => {
        if (cancelled || !data) return;
        setRescheduleSlots(data.slots || []);
      })
      .catch(() => {
        if (!cancelled) setRescheduleSlots([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingRescheduleSlots(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reschedulingId, rescheduleDate]);

  const openReschedule = (r: DemoRequest) => {
    setReschedulingId(r.id);
    setRescheduleDate(r.scheduledAt ? new Date(r.scheduledAt) : undefined);
  };

  const closeReschedule = () => {
    setReschedulingId(null);
    setRescheduleDate(undefined);
    setRescheduleSlots([]);
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/admin/demo-requests", { credentials: "include" });
      if (res.status === 401) {
        navigate("/admin/login");
        return;
      }
      const data = await res.json();
      setRequests(data.demoRequests || []);
    } catch {
      toast({
        title: "Failed to load demo requests",
        description: "Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUnauthorized = () => {
    toast({
      title: "Session expired",
      description: "Please sign in again to continue.",
      variant: "destructive",
    });
    navigate("/admin/login");
  };

  const updateRequest = async (
    id: number,
    patch: { status?: string; notes?: string; scheduledAt?: string | null },
  ) => {
    const res = await fetch(`/api/admin/demo-requests/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.status === 401) { handleUnauthorized(); return false; }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast({
        title: "Update failed",
        description: err?.error === "slot_unavailable" ? "That slot was just taken." : err?.error === "invalid_slot" ? "That slot is no longer bookable." : undefined,
        variant: "destructive",
      });
      return false;
    }
    const data = await res.json();
    setRequests((prev) => prev.map((r) => (r.id === id ? data.demoRequest : r)));
    toast({ title: "Saved" });
    return true;
  };

  const confirmReschedule = async (iso: string) => {
    if (!reschedulingId) return;
    setSavingReschedule(true);
    const ok = await updateRequest(reschedulingId, { scheduledAt: iso });
    setSavingReschedule(false);
    if (ok) {
      toast({ title: "Demo rescheduled", description: "The visitor has been notified by email." });
      closeReschedule();
    } else if (reschedulingId && rescheduleDate) {
      fetch(`/api/admin/demo-requests/${reschedulingId}/available-slots?date=${toDateKey(rescheduleDate)}`, {
        credentials: "include",
      })
        .then((r) => r.json())
        .then((d) => setRescheduleSlots(d.slots || []))
        .catch(() => {});
    }
  };

  const clearSchedule = async (id: number) => {
    if (!confirm("Clear this visitor's scheduled time? They'll be notified their slot was cancelled.")) return;
    const ok = await updateRequest(id, { scheduledAt: null });
    if (ok) {
      toast({ title: "Slot cleared", description: "The visitor has been notified by email." });
      if (reschedulingId === id) closeReschedule();
    }
  };

  const deleteRequest = async (id: number) => {
    if (!confirm("Delete this demo request permanently?")) return;
    const res = await fetch(`/api/admin/demo-requests/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.status === 401) { handleUnauthorized(); return; }
    if (!res.ok) {
      toast({ title: "Delete failed", variant: "destructive" });
      return;
    }
    setRequests((prev) => prev.filter((r) => r.id !== id));
    toast({ title: "Demo request deleted" });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return requests.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.company || "").toLowerCase().includes(q) ||
        (r.productInterest || "").toLowerCase().includes(q) ||
        (r.message || "").toLowerCase().includes(q)
      );
    });
  }, [requests, search, statusFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: requests.length };
    for (const s of STATUS_OPTIONS) c[s.value] = 0;
    for (const r of requests) c[r.status] = (c[r.status] || 0) + 1;
    return c;
  }, [requests]);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
        <button
          onClick={() => setStatusFilter("all")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === "all" ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" : "bg-white border-card-border hover:border-primary/40"
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wide opacity-80">All</div>
          <div className="text-2xl font-extrabold mt-1">{counts.all}</div>
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              statusFilter === s.value ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" : "bg-white border-card-border hover:border-primary/40"
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wide opacity-80">{s.label}</div>
            <div className="text-2xl font-extrabold mt-1">{counts[s.value] || 0}</div>
          </button>
        ))}
      </div>

      <div className="bg-white border border-card-border rounded-2xl p-3 shadow-sm flex items-center gap-3 mb-6">
        <Search className="w-5 h-5 text-muted-foreground ml-2" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, company or product…"
          className="border-0 focus-visible:ring-0 bg-transparent h-10"
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading demo requests…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-card-border rounded-3xl p-16 text-center">
          <CalendarCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">No demo requests found</h3>
          <p className="text-muted-foreground">Try changing the filter or clearing the search.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => {
            const isOpen = expanded === r.id;
            const notes = draftNotes[r.id] ?? (r.notes || "");
            return (
              <div
                key={r.id}
                data-testid={`demo-request-row-${r.id}`}
                className="bg-white border border-card-border rounded-3xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : r.id)}
                  className="w-full text-left p-6 flex items-start gap-4 hover:bg-muted/40 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-foreground truncate">{r.name}</h3>
                      <Badge className={`border ${STATUS_COLORS[r.status] || "bg-muted text-foreground border-card-border"}`}>
                        {STATUS_OPTIONS.find((s) => s.value === r.status)?.label || r.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {r.email}</span>
                      {r.company && (
                        <span className="inline-flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {r.company}</span>
                      )}
                      {r.productInterest && (
                        <span className="inline-flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> {r.productInterest}</span>
                      )}
                      {formatScheduledAt(r.scheduledAt) ? (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-foreground"><CalendarCheck className="w-3.5 h-3.5" /> {formatScheduledAt(r.scheduledAt)}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Submitted {new Date(r.createdAt).toLocaleString()}</span>
                      )}
                    </div>
                    {!isOpen && r.message && (
                      <p className="mt-2 text-muted-foreground line-clamp-2">{r.message}</p>
                    )}
                  </div>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 border-t border-card-border">
                    <div className="pt-6 grid lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                          {r.phone && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="w-3.5 h-3.5" /> {r.phone}
                            </div>
                          )}
                          {formatScheduledAt(r.scheduledAt) ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <CalendarCheck className="w-3.5 h-3.5" /> {formatScheduledAt(r.scheduledAt)}
                            </div>
                          ) : r.preferredDate ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <CalendarCheck className="w-3.5 h-3.5" /> {r.preferredDate} (legacy request)
                            </div>
                          ) : null}
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" /> Submitted {new Date(r.createdAt).toLocaleString()}
                          </div>
                        </div>
                        {r.message && (
                          <div>
                            <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-2">Message</h4>
                            <div className="bg-muted/40 border border-card-border rounded-2xl p-5 whitespace-pre-wrap text-foreground/90">
                              {r.message}
                            </div>
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-2">Internal Notes</h4>
                          <Textarea
                            value={notes}
                            onChange={(ev) => setDraftNotes((d) => ({ ...d, [r.id]: ev.target.value }))}
                            placeholder="Add internal notes for the team…"
                            className="min-h-[120px] bg-white border-card-border rounded-2xl"
                          />
                          <div className="mt-3 flex justify-end">
                            <Button
                              onClick={() => updateRequest(r.id, { notes })}
                              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                              Save notes
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-2">Status</h4>
                          <Select
                            value={r.status}
                            onValueChange={(v) => updateRequest(r.id, { status: v })}
                          >
                            <SelectTrigger className="bg-white border-card-border rounded-xl h-11" data-testid={`demo-request-status-select-${r.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map((s) => (
                                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => openReschedule(r)}
                            variant="outline"
                            className="rounded-full border-card-border hover:border-primary/40 text-foreground font-semibold"
                            data-testid={`reschedule-demo-request-${r.id}`}
                          >
                            <CalendarClock className="w-4 h-4 mr-2" /> {r.scheduledAt ? "Reschedule" : "Schedule"}
                          </Button>
                          {r.scheduledAt && (
                            <Button
                              onClick={() => clearSchedule(r.id)}
                              variant="outline"
                              className="rounded-full border-amber-200 text-amber-800 hover:bg-amber-50"
                              data-testid={`clear-demo-request-slot-${r.id}`}
                            >
                              <CalendarX className="w-4 h-4 mr-2" /> Clear scheduled time
                            </Button>
                          )}
                          <a
                            href={`mailto:${r.email}?subject=Re:%20Your%20demo%20request%20with%20Automystics`}
                            className="inline-flex items-center justify-center gap-2 h-11 rounded-full bg-white border border-card-border hover:border-primary/40 text-foreground font-semibold transition-colors"
                          >
                            <Mail className="w-4 h-4" /> Reply by email
                          </a>
                          <Button
                            onClick={() => deleteRequest(r.id)}
                            variant="outline"
                            className="rounded-full border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                            data-testid={`delete-demo-request-${r.id}`}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </Button>
                        </div>
                      </div>
                    </div>

                    {reschedulingId === r.id && (
                      <div className="mt-6 border-t border-card-border pt-6" data-testid={`reschedule-panel-${r.id}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                            {r.scheduledAt ? "Pick a new time" : "Pick a time"}
                          </h4>
                          <button
                            onClick={closeReschedule}
                            className="text-muted-foreground hover:text-foreground"
                            aria-label="Close"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 bg-muted/30 border border-card-border rounded-2xl p-4 md:p-6">
                          <div className="flex justify-center md:justify-start">
                            <CalendarPicker
                              mode="single"
                              selected={rescheduleDate}
                              onSelect={setRescheduleDate}
                              disabled={(date) =>
                                date < today ||
                                date > maxRescheduleDate ||
                                !bookableWeekdays.includes(date.getDay()) ||
                                blockedDates.includes(toDateKey(date))
                              }
                              data-testid={`reschedule-calendar-${r.id}`}
                            />
                          </div>
                          <div>
                            {!rescheduleDate ? (
                              <div className="h-full flex items-center justify-center text-muted-foreground text-sm py-8">
                                Select a date to see available times.
                              </div>
                            ) : loadingRescheduleSlots ? (
                              <div className="h-full flex items-center justify-center text-muted-foreground text-sm py-8">
                                Loading available times…
                              </div>
                            ) : rescheduleSlots.length === 0 ? (
                              <div className="h-full flex items-center justify-center text-muted-foreground text-sm py-8 text-center">
                                No slots left for this day. Please try another date.
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-3" data-testid={`reschedule-slots-${r.id}`}>
                                {rescheduleSlots.map((slot) => (
                                  <button
                                    key={slot.iso}
                                    type="button"
                                    disabled={!slot.available || savingReschedule}
                                    onClick={() => confirmReschedule(slot.iso)}
                                    data-testid={`reschedule-slot-${r.id}-${slot.hour}`}
                                    className={`h-12 rounded-xl border text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                                      slot.iso === r.scheduledAt
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
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

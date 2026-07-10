import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AdminEmailSettings } from "@/pages/admin-email-settings";
import { AdminSiteSettings } from "@/pages/admin-site-settings";
import { AdminLocations } from "@/pages/admin-locations";
import { AdminDemos } from "@/pages/admin-demos";
import { AdminProducts } from "@/pages/admin-products";
import {
  Inbox,
  LogOut,
  Mail,
  Search,
  Trash2,
  RefreshCw,
  User,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Settings2,
  Phone,
  MapPin,
  PlayCircle,
  Package,
} from "lucide-react";

type Enquiry = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  message: string;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "contacted", label: "Contacted" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-300",
  in_progress: "bg-amber-100 text-amber-800 border-amber-300",
  contacted: "bg-purple-100 text-purple-800 border-purple-300",
  won: "bg-emerald-100 text-emerald-800 border-emerald-300",
  lost: "bg-rose-100 text-rose-800 border-rose-300",
};

export function AdminDashboard() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [draftNotes, setDraftNotes] = useState<Record<number, string>>({});
  const [adminName, setAdminName] = useState<string>("");

  const fetchEnquiries = async () => {
    try {
      const res = await fetch("/api/admin/enquiries", { credentials: "include" });
      if (res.status === 401) {
        navigate("/admin/login");
        return;
      }
      const data = await res.json();
      setEnquiries(data.enquiries || []);
    } catch {
      toast({
        title: "Failed to load enquiries",
        description: "Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const me = await fetch("/api/admin/me", { credentials: "include" });
        if (!me.ok) {
          navigate("/admin/login");
          return;
        }
        const meData = await me.json();
        setAdminName(meData.username || "admin");
        await fetchEnquiries();
      } catch {
        navigate("/admin/login");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    navigate("/admin/login");
  };

  const handleUnauthorized = () => {
    toast({
      title: "Session expired",
      description: "Please sign in again to continue.",
      variant: "destructive",
    });
    navigate("/admin/login");
  };

  const updateEnquiry = async (id: number, patch: { status?: string; notes?: string }) => {
    const res = await fetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.status === 401) { handleUnauthorized(); return; }
    if (!res.ok) {
      toast({ title: "Update failed", variant: "destructive" });
      return;
    }
    const data = await res.json();
    setEnquiries((prev) => prev.map((e) => (e.id === id ? data.enquiry : e)));
    toast({ title: "Saved" });
  };

  const deleteEnquiry = async (id: number) => {
    if (!confirm("Delete this enquiry permanently?")) return;
    const res = await fetch(`/api/admin/enquiries/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.status === 401) { handleUnauthorized(); return; }
    if (!res.ok) {
      toast({ title: "Delete failed", variant: "destructive" });
      return;
    }
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    toast({ title: "Enquiry deleted" });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enquiries.filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (!q) return true;
      return (
        e.firstName.toLowerCase().includes(q) ||
        e.lastName.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (e.company || "").toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q)
      );
    });
  }, [enquiries, search, statusFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: enquiries.length };
    for (const s of STATUS_OPTIONS) c[s.value] = 0;
    for (const e of enquiries) c[e.status] = (c[e.status] || 0) + 1;
    return c;
  }, [enquiries]);

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-24">
      <SEO
        title="Admin — Enquiries — Automystics"
        description="Manage incoming enquiries."
        canonical="/admin"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-card-border shadow-sm text-primary text-xs font-bold mb-4 uppercase tracking-wide">
              <Inbox className="w-3.5 h-3.5" /> Admin Console
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Signed in as <span className="font-semibold text-foreground">{adminName}</span> · {enquiries.length} enquiries total
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => { setLoading(true); fetchEnquiries(); }}
              variant="outline"
              className="rounded-full border-card-border bg-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              data-testid="admin-logout"
              className="rounded-full border-card-border bg-white"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign out
            </Button>
          </div>
        </div>

        <Tabs defaultValue="enquiries" className="w-full">
          <TabsList className="bg-white border border-card-border rounded-2xl p-1 mb-8 h-auto">
            <TabsTrigger
              value="enquiries"
              className="rounded-xl px-5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white font-semibold"
              data-testid="tab-enquiries"
            >
              <Inbox className="w-4 h-4 mr-2" /> Enquiries
            </TabsTrigger>
            <TabsTrigger
              value="email"
              className="rounded-xl px-5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white font-semibold"
              data-testid="tab-email"
            >
              <Settings2 className="w-4 h-4 mr-2" /> Email Settings
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="rounded-xl px-5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white font-semibold"
              data-testid="tab-contact"
            >
              <Phone className="w-4 h-4 mr-2" /> Contact Info
            </TabsTrigger>
            <TabsTrigger
              value="locations"
              className="rounded-xl px-5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white font-semibold"
              data-testid="tab-locations"
            >
              <MapPin className="w-4 h-4 mr-2" /> Locations
            </TabsTrigger>
            <TabsTrigger
              value="demos"
              className="rounded-xl px-5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white font-semibold"
              data-testid="tab-demos"
            >
              <PlayCircle className="w-4 h-4 mr-2" /> Demos
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="rounded-xl px-5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white font-semibold"
              data-testid="tab-products"
            >
              <Package className="w-4 h-4 mr-2" /> Products
            </TabsTrigger>
          </TabsList>

          <TabsContent value="enquiries" className="mt-0 focus-visible:outline-none">

        {/* Status summary */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
          <button
            onClick={() => setStatusFilter("all")}
            className={`p-4 rounded-2xl border text-left transition-all ${
              statusFilter === "all" ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white border-card-border hover:border-primary/40"
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
                statusFilter === s.value ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white border-card-border hover:border-primary/40"
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-wide opacity-80">{s.label}</div>
              <div className="text-2xl font-extrabold mt-1">{counts[s.value] || 0}</div>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white border border-card-border rounded-2xl p-3 shadow-sm flex items-center gap-3 mb-6">
          <Search className="w-5 h-5 text-muted-foreground ml-2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, company or message…"
            className="border-0 focus-visible:ring-0 bg-transparent h-10"
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading enquiries…</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-card-border rounded-3xl p-16 text-center">
            <Inbox className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No enquiries found</h3>
            <p className="text-muted-foreground">Try changing the filter or clearing the search.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((e) => {
              const isOpen = expanded === e.id;
              const notes = draftNotes[e.id] ?? (e.notes || "");
              return (
                <div
                  key={e.id}
                  data-testid={`enquiry-row-${e.id}`}
                  className="bg-white border border-card-border rounded-3xl shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setExpanded(isOpen ? null : e.id)}
                    className="w-full text-left p-6 flex items-start gap-4 hover:bg-muted/40 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-foreground truncate">
                          {e.firstName} {e.lastName}
                        </h3>
                        <Badge className={`border ${STATUS_COLORS[e.status] || "bg-muted text-foreground border-card-border"}`}>
                          {STATUS_OPTIONS.find((s) => s.value === e.status)?.label || e.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {e.email}</span>
                        {e.company && (
                          <span className="inline-flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {e.company}</span>
                        )}
                        <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(e.createdAt).toLocaleString()}</span>
                      </div>
                      {!isOpen && (
                        <p className="mt-2 text-foreground/80 line-clamp-2">{e.message}</p>
                      )}
                    </div>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 border-t border-card-border">
                      <div className="pt-6 grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                          <div>
                            <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-2">Message</h4>
                            <div className="bg-muted/40 border border-card-border rounded-2xl p-5 whitespace-pre-wrap text-foreground/90">
                              {e.message}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-2">Internal Notes</h4>
                            <Textarea
                              value={notes}
                              onChange={(ev) => setDraftNotes((d) => ({ ...d, [e.id]: ev.target.value }))}
                              placeholder="Add internal notes for the team…"
                              className="min-h-[120px] bg-white border-card-border rounded-2xl"
                            />
                            <div className="mt-3 flex justify-end">
                              <Button
                                onClick={() => updateEnquiry(e.id, { notes })}
                                className="rounded-full bg-primary hover:bg-primary/90 text-white"
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
                              value={e.status}
                              onValueChange={(v) => updateEnquiry(e.id, { status: v })}
                            >
                              <SelectTrigger className="bg-white border-card-border rounded-xl h-11" data-testid={`status-select-${e.id}`}>
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
                            <a
                              href={`mailto:${e.email}?subject=Re:%20Your%20enquiry%20to%20Automystics`}
                              className="inline-flex items-center justify-center gap-2 h-11 rounded-full bg-white border border-card-border hover:border-primary/40 text-foreground font-semibold transition-colors"
                            >
                              <Mail className="w-4 h-4" /> Reply by email
                            </a>
                            <Button
                              onClick={() => deleteEnquiry(e.id)}
                              variant="outline"
                              className="rounded-full border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                              data-testid={`delete-enquiry-${e.id}`}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
          </TabsContent>

          <TabsContent value="email" className="mt-0 focus-visible:outline-none">
            <AdminEmailSettings />
          </TabsContent>

          <TabsContent value="contact" className="mt-0 focus-visible:outline-none">
            <AdminSiteSettings />
          </TabsContent>

          <TabsContent value="locations" className="mt-0 focus-visible:outline-none">
            <AdminLocations />
          </TabsContent>

          <TabsContent value="demos" className="mt-0 focus-visible:outline-none">
            <AdminDemos />
          </TabsContent>

          <TabsContent value="products" className="mt-0 focus-visible:outline-none">
            <AdminProducts />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

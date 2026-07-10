import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, MapPin, Pencil, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { clearLocationsCache, LOCATION_TYPE_LABELS } from "@/hooks/use-locations";

type Location = {
  id: number;
  label: string;
  locationType: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  mapUrl: string | null;
  enabled: boolean;
  sortOrder: number;
};

const LOCATION_TYPES = [
  "headquarters", "branch", "sales", "support", "registered", "warehouse", "office",
] as const;

const TYPE_BADGE: Record<string, string> = {
  headquarters: "bg-primary/10 text-primary border-primary/20",
  branch: "bg-blue-50 text-blue-700 border-blue-200",
  sales: "bg-emerald-50 text-emerald-700 border-emerald-200",
  support: "bg-amber-50 text-amber-700 border-amber-200",
  registered: "bg-violet-50 text-violet-700 border-violet-200",
  warehouse: "bg-orange-50 text-orange-700 border-orange-200",
  office: "bg-slate-100 text-slate-700 border-slate-200",
};

const EMPTY: Omit<Location, "id"> = {
  label: "", locationType: "office", addressLine1: "", addressLine2: "",
  city: "", state: "", postalCode: "", country: "", phone: "", email: "",
  mapUrl: "", enabled: true, sortOrder: 0,
};

function LocationCard({
  loc, onChange, onSave, onDelete, onToggle, expanded, onToggleExpand,
}: {
  loc: Location;
  onChange: (patch: Partial<Location>) => void;
  onSave: () => void;
  onDelete: () => void;
  onToggle: (enabled: boolean) => void;
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  return (
    <div className="bg-white border border-card-border rounded-3xl shadow-sm overflow-hidden" data-testid={`location-card-${loc.id}`}>
      <div className="p-5 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h3 className="text-lg font-bold text-foreground truncate">{loc.label || "Untitled location"}</h3>
            <Badge className={`border ${TYPE_BADGE[loc.locationType] || TYPE_BADGE.office}`}>
              {LOCATION_TYPE_LABELS[loc.locationType] || loc.locationType}
            </Badge>
            {!loc.enabled && (
              <Badge className="border bg-rose-50 text-rose-700 border-rose-200">Hidden</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {[loc.addressLine1, loc.city, loc.country].filter(Boolean).join(" · ") || "No address yet"}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Switch
              checked={loc.enabled}
              onCheckedChange={onToggle}
              data-testid={`location-toggle-${loc.id}`}
            />
            <span className="text-xs font-semibold text-muted-foreground">{loc.enabled ? "Visible" : "Hidden"}</span>
          </div>
          <Button variant="outline" size="icon" onClick={onToggleExpand} className="rounded-full border-card-border bg-white" data-testid={`location-expand-${loc.id}`}>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-card-border bg-muted/30 p-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-semibold">Label</Label>
              <Input
                value={loc.label}
                onChange={(e) => onChange({ label: e.target.value })}
                placeholder="e.g. Coimbatore HQ"
                className="bg-white border-card-border h-11 rounded-xl"
                data-testid={`location-label-${loc.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Location Type</Label>
              <Select value={loc.locationType} onValueChange={(v) => onChange({ locationType: v })}>
                <SelectTrigger className="bg-white border-card-border h-11 rounded-xl" data-testid={`location-type-${loc.id}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCATION_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{LOCATION_TYPE_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="font-semibold">Address Line 1</Label>
              <Input value={loc.addressLine1 || ""} onChange={(e) => onChange({ addressLine1: e.target.value })} placeholder="Street address" className="bg-white border-card-border h-11 rounded-xl" data-testid={`location-line1-${loc.id}`} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="font-semibold">Address Line 2</Label>
              <Input value={loc.addressLine2 || ""} onChange={(e) => onChange({ addressLine2: e.target.value })} placeholder="Suite, floor, building (optional)" className="bg-white border-card-border h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">City</Label>
              <Input value={loc.city || ""} onChange={(e) => onChange({ city: e.target.value })} className="bg-white border-card-border h-11 rounded-xl" data-testid={`location-city-${loc.id}`} />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">State / Region</Label>
              <Input value={loc.state || ""} onChange={(e) => onChange({ state: e.target.value })} className="bg-white border-card-border h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Postal Code</Label>
              <Input value={loc.postalCode || ""} onChange={(e) => onChange({ postalCode: e.target.value })} className="bg-white border-card-border h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Country</Label>
              <Input value={loc.country || ""} onChange={(e) => onChange({ country: e.target.value })} className="bg-white border-card-border h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Phone (optional)</Label>
              <Input value={loc.phone || ""} onChange={(e) => onChange({ phone: e.target.value })} className="bg-white border-card-border h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Email (optional)</Label>
              <Input type="email" value={loc.email || ""} onChange={(e) => onChange({ email: e.target.value })} className="bg-white border-card-border h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Display Order</Label>
              <Input type="number" min={0} value={loc.sortOrder} onChange={(e) => onChange({ sortOrder: Number(e.target.value) || 0 })} className="bg-white border-card-border h-11 rounded-xl" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="font-semibold">Map / Directions URL (optional)</Label>
              <Textarea value={loc.mapUrl || ""} onChange={(e) => onChange({ mapUrl: e.target.value })} placeholder="https://maps.google.com/?q=…" className="min-h-[70px] bg-white border-card-border rounded-xl" />
            </div>
          </div>

          <div className="flex justify-between gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onDelete}
              className="rounded-full border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
              data-testid={`location-delete-${loc.id}`}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete location
            </Button>
            <Button
              onClick={onSave}
              className="rounded-full bg-primary hover:bg-primary/90 text-white"
              data-testid={`location-save-${loc.id}`}
            >
              <Save className="w-4 h-4 mr-2" /> Save changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminLocations() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Location[]>([]);
  const [drafts, setDrafts] = useState<Record<number, Partial<Location>>>({});
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ ...EMPTY });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings/locations", { credentials: "include" });
      if (res.status === 401) { window.location.href = "/admin/login"; return; }
      const json = await res.json();
      setItems(json.locations || []);
    } catch {
      toast({ title: "Could not load locations", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const merged = (loc: Location): Location => ({ ...loc, ...(drafts[loc.id] || {}) });

  const patch = (id: number, p: Partial<Location>) => {
    setDrafts((d) => ({ ...d, [id]: { ...(d[id] || {}), ...p } }));
  };

  const saveOne = async (id: number) => {
    const body = drafts[id];
    if (!body || Object.keys(body).length === 0) {
      toast({ title: "Nothing to save" });
      return;
    }
    try {
      const res = await fetch(`/api/admin/settings/locations/${id}`, {
        method: "PUT", credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Save failed");
      setItems((arr) => arr.map((x) => (x.id === id ? json.location : x)));
      setDrafts((d) => { const c = { ...d }; delete c[id]; return c; });
      clearLocationsCache();
      toast({ title: "Location saved" });
    } catch (err: any) {
      toast({ title: "Could not save", description: err?.message, variant: "destructive" });
    }
  };

  const toggleEnabled = async (id: number, enabled: boolean) => {
    setItems((arr) => arr.map((x) => (x.id === id ? { ...x, enabled } : x)));
    try {
      const res = await fetch(`/api/admin/settings/locations/${id}`, {
        method: "PUT", credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) throw new Error("toggle failed");
      clearLocationsCache();
      toast({ title: enabled ? "Location is now visible" : "Location hidden from site" });
    } catch {
      setItems((arr) => arr.map((x) => (x.id === id ? { ...x, enabled: !enabled } : x)));
      toast({ title: "Could not update", variant: "destructive" });
    }
  };

  const removeOne = async (id: number) => {
    if (!confirm("Delete this location? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/settings/locations/${id}`, {
        method: "DELETE", credentials: "include",
      });
      if (!res.ok) throw new Error();
      setItems((arr) => arr.filter((x) => x.id !== id));
      clearLocationsCache();
      toast({ title: "Location deleted" });
    } catch {
      toast({ title: "Could not delete", variant: "destructive" });
    }
  };

  const createNew = async () => {
    if (!draft.label.trim()) {
      toast({ title: "Label is required", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch("/api/admin/settings/locations", {
        method: "POST", credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Create failed");
      setItems((arr) => [...arr, json.location]);
      clearLocationsCache();
      setCreating(false);
      setDraft({ ...EMPTY });
      toast({ title: "Location added" });
    } catch (err: any) {
      toast({ title: "Could not add location", description: err?.message, variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground">Loading locations…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Office Locations</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Add multiple offices, label by type, and toggle visibility on the public site.
          </p>
        </div>
        {!creating && (
          <Button
            onClick={() => setCreating(true)}
            className="rounded-full bg-primary hover:bg-primary/90 text-white"
            data-testid="add-location-btn"
          >
            <Plus className="w-4 h-4 mr-2" /> Add location
          </Button>
        )}
      </div>

      {creating && (
        <div className="bg-white border-2 border-primary/30 rounded-3xl p-6 shadow-md space-y-4" data-testid="new-location-form">
          <h3 className="text-lg font-bold text-foreground">New location</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-semibold">Label *</Label>
              <Input
                value={draft.label}
                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                placeholder="e.g. Bangalore Sales Office"
                className="bg-white border-card-border h-11 rounded-xl"
                data-testid="new-location-label"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Location Type</Label>
              <Select value={draft.locationType} onValueChange={(v) => setDraft({ ...draft, locationType: v })}>
                <SelectTrigger className="bg-white border-card-border h-11 rounded-xl" data-testid="new-location-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCATION_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{LOCATION_TYPE_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="font-semibold">Address Line 1</Label>
              <Input value={draft.addressLine1 || ""} onChange={(e) => setDraft({ ...draft, addressLine1: e.target.value })} className="bg-white border-card-border h-11 rounded-xl" data-testid="new-location-line1" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">City</Label>
              <Input value={draft.city || ""} onChange={(e) => setDraft({ ...draft, city: e.target.value })} className="bg-white border-card-border h-11 rounded-xl" data-testid="new-location-city" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">State / Region</Label>
              <Input value={draft.state || ""} onChange={(e) => setDraft({ ...draft, state: e.target.value })} className="bg-white border-card-border h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Country</Label>
              <Input value={draft.country || ""} onChange={(e) => setDraft({ ...draft, country: e.target.value })} className="bg-white border-card-border h-11 rounded-xl" data-testid="new-location-country" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Phone (optional)</Label>
              <Input value={draft.phone || ""} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="bg-white border-card-border h-11 rounded-xl" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setCreating(false); setDraft({ ...EMPTY }); }} className="rounded-full border-card-border bg-white">Cancel</Button>
            <Button onClick={createNew} className="rounded-full bg-primary hover:bg-primary/90 text-white" data-testid="save-new-location">
              <Plus className="w-4 h-4 mr-2" /> Add location
            </Button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="bg-white border border-card-border rounded-3xl p-16 text-center">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">No locations yet</h3>
          <p className="text-muted-foreground">Add your first office to display it on the public site.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((raw) => {
            const loc = merged(raw);
            return (
              <LocationCard
                key={raw.id}
                loc={loc}
                expanded={!!expanded[raw.id]}
                onToggleExpand={() => setExpanded((e) => ({ ...e, [raw.id]: !e[raw.id] }))}
                onChange={(p) => patch(raw.id, p)}
                onSave={() => saveOne(raw.id)}
                onDelete={() => removeOne(raw.id)}
                onToggle={(enabled) => toggleEnabled(raw.id, enabled)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

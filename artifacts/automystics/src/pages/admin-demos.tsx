import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, PlayCircle, ChevronUp, Pencil, ExternalLink } from "lucide-react";
import { clearDemosCache } from "@/hooks/use-demos";

type Demo = {
  id: number;
  productKey: string | null;
  title: string;
  tagline: string | null;
  description: string | null;
  category: string | null;
  demoUrl: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  demoUsername: string | null;
  demoPassword: string | null;
  ctaLabel: string | null;
  badge: string | null;
  enabled: boolean;
  sortOrder: number;
};

const EMPTY: Omit<Demo, "id"> = {
  productKey: "", title: "", tagline: "", description: "", category: "",
  demoUrl: "", videoUrl: "", thumbnailUrl: "", demoUsername: "", demoPassword: "",
  ctaLabel: "", badge: "", enabled: true, sortOrder: 0,
};

function FormGrid({ data, onChange, idPrefix }: {
  data: Omit<Demo, "id">; onChange: (p: Partial<Demo>) => void; idPrefix: string;
}) {
  const f = (k: keyof Demo, label: string, opts: { type?: string; placeholder?: string; testId?: string; full?: boolean } = {}) => (
    <div className={`space-y-2 ${opts.full ? "md:col-span-2" : ""}`}>
      <Label className="font-semibold">{label}</Label>
      <Input
        type={opts.type || "text"}
        value={(data[k] as string) ?? ""}
        onChange={(e) => onChange({ [k]: e.target.value } as Partial<Demo>)}
        placeholder={opts.placeholder}
        className="bg-white border-card-border h-11 rounded-xl"
        data-testid={opts.testId ? `${idPrefix}-${opts.testId}` : undefined}
      />
    </div>
  );
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {f("title", "Title *", { placeholder: "e.g. KalviCore CMS", testId: "title" })}
      {f("tagline", "Tagline", { placeholder: "Short one-liner", testId: "tagline" })}
      {f("category", "Category", { placeholder: "Fintech / EdTech / AI…", testId: "category" })}
      {f("badge", "Badge (optional)", { placeholder: "Live / New / Popular", testId: "badge" })}
      <div className="space-y-2 md:col-span-2">
        <Label className="font-semibold">Description</Label>
        <Textarea
          value={data.description ?? ""}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="What does this demo show?"
          className="min-h-[90px] bg-white border-card-border rounded-xl"
          data-testid={`${idPrefix}-description`}
        />
      </div>
      {f("demoUrl", "Demo URL *", { placeholder: "https://demo.example.com", testId: "demo-url", full: true })}
      {f("videoUrl", "Video URL (optional)", { placeholder: "https://youtube.com/…", testId: "video-url" })}
      {f("thumbnailUrl", "Thumbnail Image URL", { placeholder: "https://…/preview.jpg", testId: "thumbnail-url" })}
      {f("demoUsername", "Demo Username (optional)", { placeholder: "demo", testId: "username" })}
      {f("demoPassword", "Demo Password (optional)", { placeholder: "demo123", testId: "password" })}
      {f("ctaLabel", "Button Label (optional)", { placeholder: "Launch demo", testId: "cta" })}
      {f("productKey", "Product Key (optional)", { placeholder: "kalvicore", testId: "product-key" })}
      <div className="space-y-2">
        <Label className="font-semibold">Display Order</Label>
        <Input
          type="number"
          min={0}
          value={data.sortOrder}
          onChange={(e) => onChange({ sortOrder: Number(e.target.value) || 0 })}
          className="bg-white border-card-border h-11 rounded-xl"
        />
      </div>
    </div>
  );
}

function DemoRow({
  demo, expanded, onToggleExpand, onChange, onSave, onDelete, onToggleEnabled,
}: {
  demo: Demo; expanded: boolean; onToggleExpand: () => void;
  onChange: (p: Partial<Demo>) => void; onSave: () => void;
  onDelete: () => void; onToggleEnabled: (v: boolean) => void;
}) {
  return (
    <div className="bg-white border border-card-border rounded-3xl shadow-sm overflow-hidden" data-testid={`demo-row-${demo.id}`}>
      <div className="p-5 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <PlayCircle className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-foreground truncate">{demo.title || "Untitled demo"}</h3>
            {demo.category && <Badge className="border bg-slate-100 text-slate-700 border-slate-200">{demo.category}</Badge>}
            {demo.badge && <Badge className="border bg-primary/10 text-primary border-primary/20">{demo.badge}</Badge>}
            {!demo.enabled && <Badge className="border bg-rose-50 text-rose-700 border-rose-200">Hidden</Badge>}
          </div>
          {demo.tagline && <p className="text-sm text-muted-foreground truncate">{demo.tagline}</p>}
          {demo.demoUrl && (
            <a href={demo.demoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1 mt-1">
              {demo.demoUrl} <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Switch checked={demo.enabled} onCheckedChange={onToggleEnabled} data-testid={`demo-toggle-${demo.id}`} />
          <Button variant="outline" size="icon" onClick={onToggleExpand} className="rounded-full border-card-border bg-white" data-testid={`demo-expand-${demo.id}`}>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-card-border bg-muted/30 p-6 space-y-5">
          <FormGrid data={demo} onChange={onChange} idPrefix={`demo-${demo.id}`} />
          <div className="flex justify-between gap-3 pt-2">
            <Button variant="outline" onClick={onDelete} className="rounded-full border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800" data-testid={`demo-delete-${demo.id}`}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
            <Button onClick={onSave} className="rounded-full bg-primary hover:bg-primary/90 text-white" data-testid={`demo-save-${demo.id}`}>
              <Save className="w-4 h-4 mr-2" /> Save changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminDemos() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Demo[]>([]);
  const [drafts, setDrafts] = useState<Record<number, Partial<Demo>>>({});
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ ...EMPTY });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings/demos", { credentials: "include" });
      if (res.status === 401) { window.location.href = "/admin/login"; return; }
      const json = await res.json();
      setItems(json.demos || []);
    } catch {
      toast({ title: "Could not load demos", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const merged = (d: Demo): Demo => ({ ...d, ...(drafts[d.id] || {}) });
  const patch = (id: number, p: Partial<Demo>) => setDrafts((d) => ({ ...d, [id]: { ...(d[id] || {}), ...p } }));

  const saveOne = async (id: number) => {
    const body = drafts[id];
    if (!body || Object.keys(body).length === 0) { toast({ title: "Nothing to save" }); return; }
    try {
      const res = await fetch(`/api/admin/settings/demos/${id}`, {
        method: "PUT", credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Save failed");
      setItems((arr) => arr.map((x) => (x.id === id ? json.demo : x)));
      setDrafts((d) => { const c = { ...d }; delete c[id]; return c; });
      clearDemosCache();
      toast({ title: "Demo saved" });
    } catch (err: any) {
      toast({ title: "Could not save", description: err?.message, variant: "destructive" });
    }
  };

  const toggleEnabled = async (id: number, enabled: boolean) => {
    setItems((arr) => arr.map((x) => (x.id === id ? { ...x, enabled } : x)));
    try {
      const res = await fetch(`/api/admin/settings/demos/${id}`, {
        method: "PUT", credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) throw new Error();
      clearDemosCache();
      toast({ title: enabled ? "Demo is now visible" : "Demo hidden from site" });
    } catch {
      setItems((arr) => arr.map((x) => (x.id === id ? { ...x, enabled: !enabled } : x)));
      toast({ title: "Could not update", variant: "destructive" });
    }
  };

  const removeOne = async (id: number) => {
    if (!confirm("Delete this demo? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/settings/demos/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error();
      setItems((arr) => arr.filter((x) => x.id !== id));
      clearDemosCache();
      toast({ title: "Demo deleted" });
    } catch {
      toast({ title: "Could not delete", variant: "destructive" });
    }
  };

  const createNew = async () => {
    if (!draft.title.trim()) { toast({ title: "Title is required", variant: "destructive" }); return; }
    try {
      const res = await fetch("/api/admin/settings/demos", {
        method: "POST", credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Create failed");
      setItems((arr) => [...arr, json.demo]);
      clearDemosCache();
      setCreating(false);
      setDraft({ ...EMPTY });
      toast({ title: "Demo added" });
    } catch (err: any) {
      toast({ title: "Could not add demo", description: err?.message, variant: "destructive" });
    }
  };

  if (loading) return <div className="text-center py-20 text-muted-foreground">Loading demos…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Product Demos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage live product demos shown on the public Demo page.
          </p>
        </div>
        {!creating && (
          <Button onClick={() => setCreating(true)} className="rounded-full bg-primary hover:bg-primary/90 text-white" data-testid="add-demo-btn">
            <Plus className="w-4 h-4 mr-2" /> Add demo
          </Button>
        )}
      </div>

      {creating && (
        <div className="bg-white border-2 border-primary/30 rounded-3xl p-6 shadow-md space-y-5" data-testid="new-demo-form">
          <h3 className="text-lg font-bold text-foreground">New demo</h3>
          <FormGrid data={draft} onChange={(p) => setDraft({ ...draft, ...p })} idPrefix="new-demo" />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setCreating(false); setDraft({ ...EMPTY }); }} className="rounded-full border-card-border bg-white">Cancel</Button>
            <Button onClick={createNew} className="rounded-full bg-primary hover:bg-primary/90 text-white" data-testid="save-new-demo">
              <Plus className="w-4 h-4 mr-2" /> Add demo
            </Button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="bg-white border border-card-border rounded-3xl p-16 text-center">
          <PlayCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">No demos yet</h3>
          <p className="text-muted-foreground">Add your first demo so visitors can try your products.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((raw) => (
            <DemoRow
              key={raw.id}
              demo={merged(raw)}
              expanded={!!expanded[raw.id]}
              onToggleExpand={() => setExpanded((e) => ({ ...e, [raw.id]: !e[raw.id] }))}
              onChange={(p) => patch(raw.id, p)}
              onSave={() => saveOne(raw.id)}
              onDelete={() => removeOne(raw.id)}
              onToggleEnabled={(v) => toggleEnabled(raw.id, v)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

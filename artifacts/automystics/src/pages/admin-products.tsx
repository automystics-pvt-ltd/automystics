import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Trash2,
  Save,
  Package,
  ChevronUp,
  Pencil,
} from "lucide-react";
import { clearProductsCache } from "@/hooks/use-products";

type Product = {
  id: number;
  key: string;
  title: string;
  category: string | null;
  description: string | null;
  icon: string | null;
  features: string[];
  enabled: boolean;
  sortOrder: number;
};

const ICON_OPTIONS = [
  "Building2",
  "GraduationCap",
  "Mic",
  "LineChart",
  "Sun",
  "Camera",
  "Code",
  "Dumbbell",
  "Zap",
  "Database",
  "Shield",
  "HeartPulse",
  "CalendarCheck",
  "Activity",
  "Users",
  "DollarSign",
];

const EMPTY: Omit<Product, "id"> = {
  key: "",
  title: "",
  category: "",
  description: "",
  icon: "Package",
  features: [],
  enabled: true,
  sortOrder: 0,
};

function FeatureEditor({
  features,
  onChange,
  idPrefix,
}: {
  features: string[];
  onChange: (next: string[]) => void;
  idPrefix: string;
}) {
  const update = (idx: number, value: string) => {
    const next = [...features];
    next[idx] = value;
    onChange(next);
  };
  const remove = (idx: number) => onChange(features.filter((_, i) => i !== idx));
  const add = () => onChange([...features, ""]);
  return (
    <div className="space-y-2">
      <Label className="font-semibold">Features</Label>
      <div className="space-y-2">
        {features.map((f, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={f}
              onChange={(e) => update(i, e.target.value)}
              placeholder={`Feature ${i + 1}`}
              className="bg-white border-card-border h-11 rounded-xl"
              data-testid={`${idPrefix}-feature-${i}`}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => remove(i)}
              className="rounded-xl border-card-border bg-white shrink-0"
              data-testid={`${idPrefix}-remove-feature-${i}`}
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={add}
        className="rounded-full border-card-border bg-white"
        data-testid={`${idPrefix}-add-feature`}
      >
        <Plus className="w-4 h-4 mr-2" /> Add feature
      </Button>
    </div>
  );
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function FormGrid({
  data,
  onChange,
  idPrefix,
  autoSlugFromTitle,
}: {
  data: Omit<Product, "id">;
  onChange: (p: Partial<Product>) => void;
  idPrefix: string;
  autoSlugFromTitle?: boolean;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="font-semibold">Slug / Key *</Label>
        <Input
          value={data.key}
          onChange={(e) => onChange({ key: slugify(e.target.value) })}
          placeholder="kalvicore"
          className="bg-white border-card-border h-11 rounded-xl"
          data-testid={`${idPrefix}-key`}
        />
        <p className="text-xs text-muted-foreground">
          Auto-formatted: lowercase letters, numbers, and dashes only. Used for routes.
        </p>
      </div>
      <div className="space-y-2">
        <Label className="font-semibold">Title *</Label>
        <Input
          value={data.title}
          onChange={(e) => {
            const title = e.target.value;
            const patch: Partial<Product> = { title };
            if (autoSlugFromTitle && (!data.key || data.key === slugify(data.title))) {
              patch.key = slugify(title);
            }
            onChange(patch);
          }}
          placeholder="KalviCore"
          className="bg-white border-card-border h-11 rounded-xl"
          data-testid={`${idPrefix}-title`}
        />
      </div>
      <div className="space-y-2">
        <Label className="font-semibold">Category</Label>
        <Input
          value={data.category ?? ""}
          onChange={(e) => onChange({ category: e.target.value })}
          placeholder="EdTech / Fintech / AI…"
          className="bg-white border-card-border h-11 rounded-xl"
          data-testid={`${idPrefix}-category`}
        />
      </div>
      <div className="space-y-2">
        <Label className="font-semibold">Icon</Label>
        <select
          value={data.icon ?? ""}
          onChange={(e) => onChange({ icon: e.target.value })}
          className="w-full bg-white border border-card-border h-11 rounded-xl px-3 text-sm"
          data-testid={`${idPrefix}-icon`}
        >
          <option value="">— Select icon —</option>
          {ICON_OPTIONS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label className="font-semibold">Description</Label>
        <Textarea
          value={data.description ?? ""}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="What does this product do?"
          className="min-h-[100px] bg-white border-card-border rounded-xl"
          data-testid={`${idPrefix}-description`}
        />
      </div>
      <div className="md:col-span-2">
        <FeatureEditor
          features={data.features}
          onChange={(next) => onChange({ features: next })}
          idPrefix={idPrefix}
        />
      </div>
      <div className="space-y-2">
        <Label className="font-semibold">Display Order</Label>
        <Input
          type="number"
          min={0}
          value={data.sortOrder}
          onChange={(e) => onChange({ sortOrder: Number(e.target.value) || 0 })}
          className="bg-white border-card-border h-11 rounded-xl"
          data-testid={`${idPrefix}-order`}
        />
        <p className="text-xs text-muted-foreground">
          Lower numbers appear first.
        </p>
      </div>
    </div>
  );
}

function ProductRow({
  product,
  expanded,
  onToggleExpand,
  onChange,
  onSave,
  onDelete,
  onToggleEnabled,
}: {
  product: Product;
  expanded: boolean;
  onToggleExpand: () => void;
  onChange: (p: Partial<Product>) => void;
  onSave: () => void;
  onDelete: () => void;
  onToggleEnabled: (v: boolean) => void;
}) {
  return (
    <div
      className="bg-white border border-card-border rounded-3xl shadow-sm overflow-hidden"
      data-testid={`product-row-${product.id}`}
    >
      <div className="p-5 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Package className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-foreground truncate">
              {product.title || "Untitled product"}
            </h3>
            {product.category && (
              <Badge className="border bg-slate-100 text-slate-700 border-slate-200">
                {product.category}
              </Badge>
            )}
            <Badge className="border bg-primary/10 text-primary border-primary/20">
              {product.key || "—"}
            </Badge>
            {!product.enabled && (
              <Badge className="border bg-rose-50 text-rose-700 border-rose-200">
                Hidden
              </Badge>
            )}
          </div>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}
          {product.features.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {product.features.length} feature
              {product.features.length === 1 ? "" : "s"}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Switch
            checked={product.enabled}
            onCheckedChange={onToggleEnabled}
            data-testid={`product-toggle-${product.id}`}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleExpand}
            className="rounded-full border-card-border bg-white"
            data-testid={`product-expand-${product.id}`}
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <Pencil className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-card-border bg-muted/30 p-6 space-y-5">
          <FormGrid
            data={product}
            onChange={onChange}
            idPrefix={`product-${product.id}`}
          />
          <div className="flex justify-between gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onDelete}
              className="rounded-full border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
              data-testid={`product-delete-${product.id}`}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
            <Button
              onClick={onSave}
              className="rounded-full bg-primary hover:bg-primary/90 text-white"
              data-testid={`product-save-${product.id}`}
            >
              <Save className="w-4 h-4 mr-2" /> Save changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminProducts() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Product[]>([]);
  const [drafts, setDrafts] = useState<Record<number, Partial<Product>>>({});
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Omit<Product, "id">>({ ...EMPTY });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings/products", {
        credentials: "include",
      });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const json = await res.json();
      setItems(json.products || []);
    } catch {
      toast({ title: "Could not load products", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const merged = (p: Product): Product => ({ ...p, ...(drafts[p.id] || {}) });
  const patch = (id: number, p: Partial<Product>) =>
    setDrafts((d) => ({ ...d, [id]: { ...(d[id] || {}), ...p } }));

  const saveOne = async (id: number) => {
    const body = drafts[id];
    if (!body || Object.keys(body).length === 0) {
      toast({ title: "Nothing to save" });
      return;
    }
    try {
      const res = await fetch(`/api/admin/settings/products/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(
          json?.error === "key_already_exists"
            ? "Slug already in use"
            : json?.error || "Save failed",
        );
      }
      setItems((arr) => arr.map((x) => (x.id === id ? json.product : x)));
      setDrafts((d) => {
        const c = { ...d };
        delete c[id];
        return c;
      });
      clearProductsCache();
      toast({ title: "Product saved" });
    } catch (err: any) {
      toast({
        title: "Could not save",
        description: err?.message,
        variant: "destructive",
      });
    }
  };

  const toggleEnabled = async (id: number, enabled: boolean) => {
    setItems((arr) => arr.map((x) => (x.id === id ? { ...x, enabled } : x)));
    try {
      const res = await fetch(`/api/admin/settings/products/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) throw new Error();
      clearProductsCache();
      toast({
        title: enabled ? "Product is now visible" : "Product hidden from site",
      });
    } catch {
      setItems((arr) =>
        arr.map((x) => (x.id === id ? { ...x, enabled: !enabled } : x)),
      );
      toast({ title: "Could not update", variant: "destructive" });
    }
  };

  const removeOne = async (id: number) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/settings/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      setItems((arr) => arr.filter((x) => x.id !== id));
      clearProductsCache();
      toast({ title: "Product deleted" });
    } catch {
      toast({ title: "Could not delete", variant: "destructive" });
    }
  };

  const createNew = async () => {
    if (!draft.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    if (!draft.key.trim()) {
      toast({ title: "Slug is required", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch("/api/admin/settings/products", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json?.error === "key_already_exists") {
          throw new Error("Slug already in use");
        }
        if (json?.error === "validation_failed" && json?.issues?.fieldErrors) {
          const fe = json.issues.fieldErrors as Record<string, string[]>;
          const msgs = Object.entries(fe)
            .map(([f, errs]) => `${f}: ${(errs || []).join(", ")}`)
            .join(" | ");
          throw new Error(msgs || "Validation failed");
        }
        throw new Error(json?.error || "Create failed");
      }
      setItems((arr) => [...arr, json.product]);
      clearProductsCache();
      setCreating(false);
      setDraft({ ...EMPTY });
      toast({ title: "Product added" });
    } catch (err: any) {
      toast({
        title: "Could not add product",
        description: err?.message,
        variant: "destructive",
      });
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-muted-foreground">
        Loading products…
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Products</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Add, edit, hide or remove products shown on the public Products
            page.
          </p>
        </div>
        {!creating && (
          <Button
            onClick={() => setCreating(true)}
            className="rounded-full bg-primary hover:bg-primary/90 text-white"
            data-testid="add-product-btn"
          >
            <Plus className="w-4 h-4 mr-2" /> Add product
          </Button>
        )}
      </div>

      {creating && (
        <div
          className="bg-white border-2 border-primary/30 rounded-3xl p-6 shadow-md space-y-5"
          data-testid="new-product-form"
        >
          <h3 className="text-lg font-bold text-foreground">New product</h3>
          <FormGrid
            data={draft}
            onChange={(p) => setDraft({ ...draft, ...p })}
            idPrefix="new-product"
            autoSlugFromTitle
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setCreating(false);
                setDraft({ ...EMPTY });
              }}
              className="rounded-full border-card-border bg-white"
            >
              Cancel
            </Button>
            <Button
              onClick={createNew}
              className="rounded-full bg-primary hover:bg-primary/90 text-white"
              data-testid="save-new-product"
            >
              <Plus className="w-4 h-4 mr-2" /> Add product
            </Button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="bg-white border border-card-border rounded-3xl p-16 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">
            No products yet
          </h3>
          <p className="text-muted-foreground">
            Add your first product so it shows on the public site.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((raw) => (
            <ProductRow
              key={raw.id}
              product={merged(raw)}
              expanded={!!expanded[raw.id]}
              onToggleExpand={() =>
                setExpanded((e) => ({ ...e, [raw.id]: !e[raw.id] }))
              }
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

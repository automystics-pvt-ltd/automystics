import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building2, Mail, MapPin, Phone, Save } from "lucide-react";
import { clearSiteSettingsCache } from "@/hooks/use-site-settings";

type Settings = {
  companyName: string | null;
  tagline: string | null;
  primaryEmail: string | null;
  supportEmail: string | null;
  legalEmail: string | null;
  privacyEmail: string | null;
  primaryPhone: string | null;
  secondaryPhone: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  mapUrl: string | null;
  updatedAt?: string | null;
};

const EMPTY: Settings = {
  companyName: "", tagline: "", primaryEmail: "", supportEmail: "", legalEmail: "",
  privacyEmail: "", primaryPhone: "", secondaryPhone: "", addressLine1: "",
  addressLine2: "", city: "", state: "", postalCode: "", country: "", mapUrl: "",
};

function Field({ label, id, value, onChange, type = "text", placeholder, testId }: {
  label: string; id: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; testId?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-foreground font-semibold">{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-white border-card-border h-11 rounded-xl"
        data-testid={testId}
      />
    </div>
  );
}

export function AdminSiteSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [s, setS] = useState<Settings>(EMPTY);

  const update = <K extends keyof Settings>(k: K, v: Settings[K]) => setS((prev) => ({ ...prev, [k]: v }));

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings/site", { credentials: "include" });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const json = await res.json();
      const data = json.settings || {};
      const merged: Settings = { ...EMPTY };
      for (const k of Object.keys(EMPTY) as (keyof Settings)[]) {
        merged[k] = (data[k] ?? "") as never;
      }
      setS(merged);
    } catch {
      toast({ title: "Could not load contact settings", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings/site", {
        method: "PUT",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(s),
      });
      const json = await res.json();
      if (!res.ok) {
        const msg = json?.issues
          ? Object.entries(json.issues.fieldErrors || {}).map(([k, v]: [string, any]) => `${k}: ${(v as string[]).join(", ")}`).join("; ")
          : json?.message || "Save failed";
        throw new Error(msg);
      }
      clearSiteSettingsCache();
      toast({ title: "Contact settings saved", description: "Visible across the site immediately." });
    } catch (err: any) {
      toast({ title: "Could not save", description: err?.message || "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground">Loading contact settings…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-card-border rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Company</h3>
            <p className="text-sm text-muted-foreground">Used in the footer copyright and metadata.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Company Name" id="companyName" value={s.companyName || ""} onChange={(v) => update("companyName", v)} placeholder="Automystics Technologies Private Limited" testId="site-company-name" />
          <Field label="Tagline" id="tagline" value={s.tagline || ""} onChange={(v) => update("tagline", v)} placeholder="An AI Automation Company" testId="site-tagline" />
        </div>
      </div>

      <div className="bg-white border border-card-border rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Email Addresses</h3>
            <p className="text-sm text-muted-foreground">Public contact addresses shown across the site.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Primary Email" id="primaryEmail" value={s.primaryEmail || ""} onChange={(v) => update("primaryEmail", v)} type="email" placeholder="hello@automystics.com" testId="site-primary-email" />
          <Field label="Support Email" id="supportEmail" value={s.supportEmail || ""} onChange={(v) => update("supportEmail", v)} type="email" placeholder="support@automystics.com" testId="site-support-email" />
          <Field label="Legal Email" id="legalEmail" value={s.legalEmail || ""} onChange={(v) => update("legalEmail", v)} type="email" placeholder="legal@automystics.com" testId="site-legal-email" />
          <Field label="Privacy Email" id="privacyEmail" value={s.privacyEmail || ""} onChange={(v) => update("privacyEmail", v)} type="email" placeholder="privacy@automystics.com" testId="site-privacy-email" />
        </div>
      </div>

      <div className="bg-white border border-card-border rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Phone Numbers</h3>
            <p className="text-sm text-muted-foreground">Optional secondary number can be used for support lines.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Primary Phone" id="primaryPhone" value={s.primaryPhone || ""} onChange={(v) => update("primaryPhone", v)} placeholder="+91 98765 43210" testId="site-primary-phone" />
          <Field label="Secondary Phone" id="secondaryPhone" value={s.secondaryPhone || ""} onChange={(v) => update("secondaryPhone", v)} placeholder="+1 (800) 555-0199" testId="site-secondary-phone" />
        </div>
      </div>

      <div className="bg-white border border-card-border rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Office Address</h3>
            <p className="text-sm text-muted-foreground">Shown on the contact page and site footer.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Address Line 1" id="addressLine1" value={s.addressLine1 || ""} onChange={(v) => update("addressLine1", v)} placeholder="123 Innovation Drive" testId="site-address-1" />
          <Field label="Address Line 2" id="addressLine2" value={s.addressLine2 || ""} onChange={(v) => update("addressLine2", v)} placeholder="Suite 400" testId="site-address-2" />
          <Field label="City" id="city" value={s.city || ""} onChange={(v) => update("city", v)} placeholder="Coimbatore" testId="site-city" />
          <Field label="State / Region" id="state" value={s.state || ""} onChange={(v) => update("state", v)} placeholder="Tamil Nadu" testId="site-state" />
          <Field label="Postal Code" id="postalCode" value={s.postalCode || ""} onChange={(v) => update("postalCode", v)} placeholder="641001" testId="site-postal-code" />
          <Field label="Country" id="country" value={s.country || ""} onChange={(v) => update("country", v)} placeholder="India" testId="site-country" />
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="mapUrl" className="text-foreground font-semibold">Map / Directions URL (optional)</Label>
            <Textarea
              id="mapUrl"
              value={s.mapUrl || ""}
              onChange={(e) => update("mapUrl", e.target.value)}
              placeholder="https://maps.google.com/?q=…"
              className="min-h-[80px] bg-white border-card-border rounded-xl"
              data-testid="site-map-url"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={save}
          disabled={saving}
          className="rounded-full bg-primary hover:bg-primary/90 text-white font-semibold h-12 px-8 shadow-lg shadow-primary/20"
          data-testid="save-site-settings"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving…" : "Save contact settings"}
        </Button>
      </div>
    </div>
  );
}

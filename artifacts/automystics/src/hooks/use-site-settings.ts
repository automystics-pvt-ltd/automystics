import { useEffect, useState } from "react";

export type PublicSiteSettings = {
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
};

export const SITE_DEFAULTS: PublicSiteSettings = {
  companyName: "Automystics Technologies Private Limited",
  tagline: "An AI Automation Company",
  primaryEmail: "hello@automystics.com",
  supportEmail: "support@automystics.com",
  legalEmail: "legal@automystics.com",
  privacyEmail: "privacy@automystics.com",
  primaryPhone: "+1 (800) 555-0199",
  secondaryPhone: null,
  addressLine1: "123 Innovation Drive",
  addressLine2: null,
  city: "Coimbatore",
  state: "Tamil Nadu",
  postalCode: null,
  country: "India",
  mapUrl: null,
};

let cache: PublicSiteSettings | null = null;
let inflight: Promise<PublicSiteSettings> | null = null;

async function fetchSettings(): Promise<PublicSiteSettings> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const res = await fetch("/api/public/site");
      if (!res.ok) throw new Error("failed");
      const json = await res.json();
      const merged: PublicSiteSettings = { ...SITE_DEFAULTS, ...(json.settings || {}) };
      for (const k of Object.keys(merged) as (keyof PublicSiteSettings)[]) {
        if (merged[k] == null || merged[k] === "") {
          merged[k] = SITE_DEFAULTS[k];
        }
      }
      cache = merged;
      return merged;
    } catch {
      cache = SITE_DEFAULTS;
      return SITE_DEFAULTS;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export function clearSiteSettingsCache() {
  cache = null;
}

export function useSiteSettings(): PublicSiteSettings {
  const [data, setData] = useState<PublicSiteSettings>(cache ?? SITE_DEFAULTS);
  useEffect(() => {
    let mounted = true;
    fetchSettings().then((s) => {
      if (mounted) setData(s);
    });
    return () => {
      mounted = false;
    };
  }, []);
  return data;
}

export function formatAddressLines(s: PublicSiteSettings): string[] {
  const lines: string[] = [];
  if (s.addressLine1) lines.push(s.addressLine1);
  if (s.addressLine2) lines.push(s.addressLine2);
  const cityLine = [s.city, s.state, s.postalCode].filter(Boolean).join(", ");
  if (cityLine) lines.push(cityLine);
  if (s.country) lines.push(s.country);
  return lines;
}

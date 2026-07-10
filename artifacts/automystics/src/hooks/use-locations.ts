import { useEffect, useState } from "react";

export type PublicLocation = {
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

let cache: PublicLocation[] | null = null;
let inflight: Promise<PublicLocation[]> | null = null;

async function fetchLocations(): Promise<PublicLocation[]> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const res = await fetch("/api/public/locations");
      if (!res.ok) throw new Error("failed");
      const json = await res.json();
      cache = (json.locations as PublicLocation[]) || [];
      return cache;
    } catch {
      cache = [];
      return cache;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export function clearLocationsCache() {
  cache = null;
}

export function useLocations(): PublicLocation[] {
  const [data, setData] = useState<PublicLocation[]>(cache ?? []);
  useEffect(() => {
    let mounted = true;
    fetchLocations().then((v) => {
      if (mounted) setData(v);
    });
    return () => {
      mounted = false;
    };
  }, []);
  return data;
}

export function formatLocationAddress(l: PublicLocation): string[] {
  const lines: string[] = [];
  if (l.addressLine1) lines.push(l.addressLine1);
  if (l.addressLine2) lines.push(l.addressLine2);
  const cityLine = [l.city, l.state, l.postalCode].filter(Boolean).join(", ");
  if (cityLine) lines.push(cityLine);
  if (l.country) lines.push(l.country);
  return lines;
}

export const LOCATION_TYPE_LABELS: Record<string, string> = {
  headquarters: "Headquarters",
  branch: "Branch Office",
  sales: "Sales Office",
  support: "Support Center",
  registered: "Registered Office",
  warehouse: "Warehouse",
  office: "Office",
};

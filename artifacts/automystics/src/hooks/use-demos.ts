import { useEffect, useState } from "react";

export type PublicDemo = {
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

let cache: PublicDemo[] | null = null;
let inflight: Promise<PublicDemo[]> | null = null;

async function fetchDemos(): Promise<PublicDemo[]> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const res = await fetch("/api/public/demos");
      if (!res.ok) throw new Error("failed");
      const json = await res.json();
      cache = (json.demos as PublicDemo[]) || [];
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

export function clearDemosCache() {
  cache = null;
}

export function useDemos(): { demos: PublicDemo[]; loading: boolean } {
  const [demos, setDemos] = useState<PublicDemo[]>(cache ?? []);
  const [loading, setLoading] = useState<boolean>(!cache);
  useEffect(() => {
    let mounted = true;
    fetchDemos().then((v) => {
      if (mounted) { setDemos(v); setLoading(false); }
    });
    return () => { mounted = false; };
  }, []);
  return { demos, loading };
}

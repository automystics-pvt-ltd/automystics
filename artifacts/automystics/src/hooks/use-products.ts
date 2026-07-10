import { useEffect, useState } from "react";

export type PublicProduct = {
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

let cache: PublicProduct[] | null = null;
let inflight: Promise<PublicProduct[]> | null = null;

async function fetchProducts(): Promise<PublicProduct[]> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const res = await fetch("/api/public/products");
      if (!res.ok) throw new Error("failed");
      const json = await res.json();
      cache = (json.products as PublicProduct[]) || [];
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

export function clearProductsCache() {
  cache = null;
}

export function useProducts(): { products: PublicProduct[]; loading: boolean } {
  const [products, setProducts] = useState<PublicProduct[]>(cache ?? []);
  const [loading, setLoading] = useState<boolean>(!cache);

  useEffect(() => {
    let alive = true;
    if (cache) {
      setProducts(cache);
      setLoading(false);
      return () => {
        alive = false;
      };
    }
    fetchProducts().then((list) => {
      if (!alive) return;
      setProducts(list);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  return { products, loading };
}

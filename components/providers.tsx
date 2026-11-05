'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { ProductSummary } from '@/lib/types';
import { translate, type TKey } from '@/lib/i18n';

/* ------------------------------------------------------------------ catalogue */
const ProductsContext = createContext<ProductSummary[]>([]);
/** Only the featured set from the page HTML; the whole catalogue comes from useAllProducts. */
export const useProducts = () => useContext(ProductsContext);

let catalogue: Promise<ProductSummary[]> | null = null;

function loadCatalogue() {
  catalogue ??= fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/products.json`)
    .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
    .catch((e) => { catalogue = null; throw e; });
  return catalogue;
}

/** Thousands of items: fetched once per visit, only by the pages that need them. */
export function useAllProducts(enabled = true) {
  const [list, setList] = useState<ProductSummary[] | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!enabled || list) return;
    let live = true;
    loadCatalogue().then((p) => { if (live) setList(p); }, () => { if (live) setFailed(true); });
    return () => { live = false; };
  }, [enabled, list]);
  return { list, failed };
}

/* ------------------------------------------------------------------ text (Russian only in «Старт») */
const lang = { t: (k: TKey) => translate(k) };
export const useLang = () => lang;

export function Providers({ products, children }: { products: ProductSummary[]; children: React.ReactNode }) {
  return <ProductsContext.Provider value={products}>{children}</ProductsContext.Provider>;
}

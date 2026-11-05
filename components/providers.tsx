'use client';

import { createContext, useContext } from 'react';
import type { Product } from '@/lib/types';
import { translate, type TKey } from '@/lib/i18n';

/* ------------------------------------------------------------------ catalogue */
const ProductsContext = createContext<Product[]>([]);
export const useProducts = () => useContext(ProductsContext);

/* ------------------------------------------------------------------ text (Russian only in «Старт») */
const lang = { t: (k: TKey) => translate(k) };
export const useLang = () => lang;

export function Providers({ products, children }: { products: Product[]; children: React.ReactNode }) {
  return <ProductsContext.Provider value={products}>{children}</ProductsContext.Provider>;
}

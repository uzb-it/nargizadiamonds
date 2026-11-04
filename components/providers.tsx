'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, Lang, Product } from '@/lib/types';
import { translate, type TKey } from '@/lib/i18n';

/* ------------------------------------------------------------------ catalogue */
const ProductsContext = createContext<Product[]>([]);
export const useProducts = () => useContext(ProductsContext);

/* ------------------------------------------------------------------ language */
interface LangCtx { lang: Lang; t: (k: TKey) => string; setLang: (l: Lang) => void }
const LangContext = createContext<LangCtx | null>(null);

export function useLang() {
  const c = useContext(LangContext);
  if (!c) throw new Error('useLang outside provider');
  return c;
}

/* ------------------------------------------------------------------ store */
interface StoreCtx {
  cart: CartItem[];
  favorites: number[];
  drawer: boolean;
  setDrawer: (v: boolean) => void;
  add: (p: Product, size: number | null) => void;
  remove: (id: number, size: number | null) => void;
  setQty: (id: number, size: number | null, qty: number) => void;
  clear: () => void;
  toggleFav: (id: number) => void;
  count: number;
  total: number;
}
const StoreContext = createContext<StoreCtx | null>(null);

export function useStore() {
  const c = useContext(StoreContext);
  if (!c) throw new Error('useStore outside provider');
  return c;
}

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, v: unknown) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage unavailable */ }
}

export function Providers({ lang: initialLang, products, children }: { lang: Lang; products: Product[]; children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  // all text is rendered on the client, so switching language needs no server round-trip
  const setLang = useCallback((l: Lang) => {
    document.cookie = `nd_lang=${l}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = l;
    setLangState(l);
  }, []);
  useEffect(() => {
    // static build has no server to read the cookie — pick the saved language up on the client
    const saved = document.cookie.match(/(?:^|; )nd_lang=(ru|uz)/)?.[1] as Lang | undefined;
    if (saved && saved !== initialLang) { setLangState(saved); document.documentElement.lang = saved; }
  }, [initialLang]);
  const t = useCallback((k: TKey) => translate(lang, k), [lang]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    setCart(load('nd-cart', []));
    setFavorites(load('nd-fav', []));
  }, []);

  const updateCart = (fn: (c: CartItem[]) => CartItem[]) => setCart((c) => { const n = fn(c); save('nd-cart', n); return n; });

  const store = useMemo<StoreCtx>(() => ({
    cart, favorites, drawer, setDrawer,
    add: (p, size) => {
      updateCart((c) => {
        const i = c.findIndex((x) => x.id === p.id && x.size === size);
        if (i >= 0) return c.map((x, k) => (k === i ? { ...x, qty: x.qty + 1 } : x));
        return [...c, { id: p.id, slug: p.slug, name_ru: p.name_ru, name_uz: p.name_uz, price: p.price, art: p.art,
          metal: p.metal, image: p.images[0] ?? null, size, qty: 1 }];
      });
      setDrawer(true);
    },
    remove: (id, size) => updateCart((c) => c.filter((x) => !(x.id === id && x.size === size))),
    setQty: (id, size, qty) => updateCart((c) => c.map((x) => (x.id === id && x.size === size ? { ...x, qty: Math.max(1, Math.min(9, qty)) } : x))),
    clear: () => updateCart(() => []),
    toggleFav: (id) => setFavorites((f) => { const n = f.includes(id) ? f.filter((x) => x !== id) : [...f, id]; save('nd-fav', n); return n; }),
    count: cart.reduce((s, x) => s + x.qty, 0),
    total: cart.reduce((s, x) => s + (x.price ?? 0) * x.qty, 0),
  }), [cart, favorites, drawer]);

  return (
    <ProductsContext.Provider value={products}>
      <LangContext.Provider value={{ lang, t, setLang }}>
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
      </LangContext.Provider>
    </ProductsContext.Provider>
  );
}

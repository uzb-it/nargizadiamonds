'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { useLang, useStore } from '@/components/providers';

export default function FavoritesPage() {
  const { favorites } = useStore();
  const { t } = useLang();
  const [all, setAll] = useState<Product[] | null>(null);
  useEffect(() => { fetch('/api/products').then((r) => r.json()).then(setAll).catch(() => setAll([])); }, []);
  const list = (all ?? []).filter((p) => favorites.includes(p.id));

  return (
    <div className="page">
      <div className="wrap">
        <div className="phead"><h1 className="h1">{t('fav.title')}</h1></div>
        {all && list.length === 0 && <div className="empty">{t('fav.empty')}</div>}
        <div className="grid" style={{ paddingBottom: 120 }}>{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </div>
    </div>
  );
}

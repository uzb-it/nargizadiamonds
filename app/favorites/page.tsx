'use client';

import { ProductCard } from '@/components/ProductCard';
import { useLang, useProducts, useStore } from '@/components/providers';

export default function FavoritesPage() {
  const { favorites } = useStore();
  const { t } = useLang();
  const list = useProducts().filter((p) => favorites.includes(p.id));

  return (
    <div className="page">
      <div className="wrap">
        <div className="phead"><h1 className="h1">{t('fav.title')}</h1></div>
        {list.length === 0 && <div className="empty">{t('fav.empty')}</div>}
        <div className="grid" style={{ paddingBottom: 120 }}>{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </div>
    </div>
  );
}

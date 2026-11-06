import Link from 'next/link';
import { listProducts } from '@/lib/db';
import { money } from '@/lib/format';
import { ProductArt } from '@/components/ProductArt';

const CAT: Record<string, string> = { rings: 'Кольца', earrings: 'Серьги', necklaces: 'Колье', bracelets: 'Браслеты', brooches: 'Броши' };
const PAGE = 50;

export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q ?? '').trim();
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const found = (await listProducts()).filter((p) => {
    const text = `${p.name_ru} ${p.slug} ${CAT[p.category]} nd-${String(p.id).padStart(4, '0')}`.toLowerCase();
    return words.every((w) => text.includes(w));
  });
  const pages = Math.max(1, Math.ceil(found.length / PAGE));
  const page = Math.min(pages, Math.max(1, Number(sp.page) || 1));
  const products = found.slice((page - 1) * PAGE, page * PAGE);
  const href = (n: number) => `/admin/products?${new URLSearchParams({ ...(q ? { q } : {}), page: String(n) })}`;

  return (
    <>
      <div className="row-between" style={{ marginBottom: 28 }}>
        <h1 className="adm__h" style={{ margin: 0 }}>Товары</h1>
        <Link href="/admin/products/new" className="btn btn--dark">+ Добавить</Link>
      </div>
      <form className="adm-search" action="/admin/products">
        <input name="q" defaultValue={q} placeholder="Название, категория или артикул" aria-label="Поиск товара" />
        <button className="btn btn--line">Найти</button>
      </form>
      <p className="muted" style={{ marginBottom: 12, fontSize: 13 }}>
        Найдено: {found.length}{q && <> · <Link href="/admin/products" className="link-btn">сбросить поиск</Link></>}
      </p>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead><tr><th></th><th>Название</th><th>Категория</th><th>Вес</th><th>Цена</th><th>Статус</th><th></th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td><div className="adm-thumb">{p.images[0] ? <img src={p.images[0]} alt="" loading="lazy" /> : <ProductArt art={p.art} metal={p.metal} stone={p.stone} />}</div></td>
                <td><b>{p.name_ru}</b><br /><span className="muted">ND-{String(p.id).padStart(4, '0')} · /{p.slug}</span></td>
                <td>{CAT[p.category]}</td>
                <td>{p.carat ? `${p.carat} ct` : '—'}</td>
                <td>{p.price === null ? 'по запросу' : money(p.price)}</td>
                <td>{p.featured && <span className="adm-tag">★ на главной</span>} {!p.in_stock && <span className="adm-tag">под заказ</span>} {!p.images.length && <span className="adm-tag adm-tag--warn">нет фото</span>}</td>
                <td><Link href={`/admin/products/${p.id}`} className="link-btn">Изменить</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <nav className="adm-pager">
          {page > 1 && <Link href={href(page - 1)} className="link-btn">← Назад</Link>}
          <span>Страница {page} из {pages}</span>
          {page < pages && <Link href={href(page + 1)} className="link-btn">Вперёд →</Link>}
        </nav>
      )}
    </>
  );
}

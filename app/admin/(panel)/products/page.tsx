import Link from 'next/link';
import { listProducts } from '@/lib/db';
import { money } from '@/lib/format';
import { ProductArt } from '@/components/ProductArt';

const CAT: Record<string, string> = { rings: 'Кольца', earrings: 'Серьги', necklaces: 'Колье', bracelets: 'Браслеты', brooches: 'Броши' };

export default function AdminProducts() {
  const products = listProducts();
  return (
    <>
      <div className="row-between" style={{ marginBottom: 28 }}>
        <h1 className="adm__h" style={{ margin: 0 }}>Товары</h1>
        <Link href="/admin/products/new" className="btn btn--dark">+ Добавить</Link>
      </div>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead><tr><th></th><th>Название</th><th>Категория</th><th>Вес</th><th>Цена</th><th>Статус</th><th></th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td><div className="adm-thumb">{p.images[0] ? <img src={p.images[0]} alt="" /> : <ProductArt art={p.art} metal={p.metal} stone={p.stone} />}</div></td>
                <td><b>{p.name_ru}</b><br /><span className="muted">/{p.slug}</span></td>
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
    </>
  );
}

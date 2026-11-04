import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { logout } from '../actions';

export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="adm">
      <aside className="adm__side">
        <Link href="/admin" className="brand"><span className="brand__main">NARGIZA</span><span className="brand__sub">ADMIN</span></Link>
        <nav>
          <Link href="/admin">Заказы</Link>
          <Link href="/admin/products">Товары</Link>
          <Link href="/admin/products/new">+ Новый товар</Link>
          <Link href="/" target="_blank">Открыть сайт ↗</Link>
        </nav>
        <form action={logout}><button className="link-btn">Выйти</button></form>
      </aside>
      <section className="adm__main">{children}</section>
    </div>
  );
}

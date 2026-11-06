import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/db';
import { deleteProductAction } from '../../../actions';
import { ProductForm } from '../ProductForm';
import { ConfirmButton } from '@/components/ConfirmButton';

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const p = await getProductById(Number((await params).id));
  if (!p) notFound();
  return (
    <>
      <div className="row-between" style={{ marginBottom: 28 }}>
        <h1 className="adm__h" style={{ margin: 0 }}>{p.name_ru}</h1>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link href={`/product/${p.slug}`} target="_blank" className="link-btn">Открыть на сайте ↗</Link>
          <form action={deleteProductAction}>
            <input type="hidden" name="id" value={p.id} />
            <ConfirmButton message="Удалить товар безвозвратно?" className="link-btn" style={{ color: '#a1342a' }}>Удалить товар</ConfirmButton>
          </form>
        </div>
      </div>
      <ProductForm p={p} />
    </>
  );
}

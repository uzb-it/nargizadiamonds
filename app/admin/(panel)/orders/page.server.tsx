import { listOrders, listProducts } from '@/lib/db';
import { money } from '@/lib/format';
import { updateOrderStatus } from '../../actions';

const STATUS: Record<string, string> = { new: 'Новый', confirmed: 'Подтверждён', done: 'Выполнен', cancelled: 'Отменён' };

export default async function AdminOrders() {
  const orders = await listOrders();
  const products = await listProducts();
  const open = orders.filter((o) => o.status === 'new').length;
  const revenue = orders.filter((o) => o.status === 'done').reduce((s, o) => s + o.total, 0);

  return (
    <>
      <h1 className="adm__h">Заказы и заявки</h1>
      <div className="adm-stats">
        <div><b>{orders.length}</b><span>всего заявок</span></div>
        <div><b>{open}</b><span>новых</span></div>
        <div><b>{money(revenue)}</b><span>выполнено на сумму</span></div>
        <div><b>{products.length}</b><span>товаров в каталоге</span></div>
      </div>
      {orders.length === 0 ? <p className="muted">Заказов пока нет. Они появятся здесь после оформления на сайте.</p> : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>№</th><th>Дата</th><th>Тип</th><th>Клиент</th><th>Состав</th><th>Сумма</th><th>Статус</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className={`st-${o.status}`}>
                  <td>{o.type === 'order' ? `ND-${String(o.id).padStart(5, '0')}` : `#${o.id}`}</td>
                  <td>{o.created_at.replace('T', ' ').slice(0, 16)}</td>
                  <td>{o.type === 'order' ? (o.delivery === 'courier' ? 'Доставка' : 'Самовывоз') : `Опт${o.delivery ? ' · ' + o.delivery : ''}`}</td>
                  <td><b>{o.name}</b><br /><a href={`tel:${o.phone.replace(/[^\d+]/g, '')}`}>{o.phone}</a>{o.address && <><br /><span className="muted">{o.address}</span></>}</td>
                  <td>
                    {o.items.map((i, k) => <div key={k}>{i.name}{i.size ? ` (р. ${i.size})` : ''} × {i.qty}</div>)}
                    {o.comment && <div className="muted" style={{ whiteSpace: 'pre-line', marginTop: 4 }}>{o.comment}</div>}
                  </td>
                  <td>{o.total ? money(o.total) : '—'}</td>
                  <td>
                    <form action={updateOrderStatus} className="adm-status">
                      <input type="hidden" name="id" value={o.id} />
                      <select name="status" defaultValue={o.status}>
                        {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                      <button className="link-btn">OK</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

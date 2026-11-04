import 'server-only';
import type { Order } from './types';

/** Sends an order notice to the shop's Telegram chat when a bot token is configured. */
export async function notifyTelegram(id: number, o: Omit<Order, 'id' | 'created_at' | 'status'>) {
  const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return;
  const head = o.type === 'wholesale' ? `🏷 Оптовая заявка #${id}` : `💎 Новый заказ ND-${String(id).padStart(5, '0')}`;
  const lines = [
    head, '',
    `👤 ${o.name}`, `📞 ${o.phone}`,
    o.delivery ? `🚚 ${o.delivery === 'courier' ? 'Доставка' : o.delivery === 'pickup' ? 'Самовывоз' : o.delivery}` : '',
    o.address ? `📍 ${o.address}` : '',
    o.comment ? `💬 ${o.comment}` : '',
    '',
    ...o.items.map((i) => `• ${i.name}${i.size ? ` (р. ${i.size})` : ''} × ${i.qty} — ${i.price === null ? 'по запросу' : '$' + i.price * i.qty}`),
    o.total ? `\nИтого: $${o.total}` : '',
  ].filter((l) => l !== '');
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text: lines.join('\n') }),
    });
  } catch { /* notification is best-effort */ }
}

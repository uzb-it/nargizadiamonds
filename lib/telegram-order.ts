import type { CartItem } from './types';
import { money } from './format';
import { TELEGRAM } from './i18n';

/** True in the GitHub Pages build, where there is no order API. */
export const IS_STATIC = !!process.env.NEXT_PUBLIC_STATIC;

/** Opens Telegram with a ready-made message to the shop (used when there is no server). */
export function openTelegram(lines: string[]) {
  const text = lines.filter(Boolean).join('\n');
  window.open(`${TELEGRAM}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
}

export function orderLines(num: string, f: { name: string; phone: string; delivery: string; address: string; comment: string }, cart: CartItem[], total: number) {
  return [
    `💎 Заказ ${num} — nargizadiamonds`,
    '',
    `👤 ${f.name}`,
    `📞 ${f.phone}`,
    `🚚 ${f.delivery === 'courier' ? 'Доставка по Ташкенту' : 'Самовывоз из бутика'}`,
    f.delivery === 'courier' && f.address ? `📍 ${f.address}` : '',
    f.comment ? `💬 ${f.comment}` : '',
    '',
    ...cart.map((i) => `• ${i.name_ru}${i.size ? ` (р. ${i.size})` : ''} × ${i.qty} — ${i.price === null ? 'цена по запросу' : money(i.price * i.qty)}`),
    '',
    `Итого: ${money(total)}`,
  ];
}

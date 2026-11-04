'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { money, pname } from '@/lib/format';
import { useLang, useStore } from '@/components/providers';
import { CartLineMedia } from '@/components/CartDrawer';
import { IS_STATIC, openTelegram, orderLines } from '@/lib/telegram-order';

export default function CheckoutPage() {
  const { cart, total, clear } = useStore();
  const { lang, t } = useLang();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '+998 ', delivery: 'pickup', address: '', comment: '' });
  const [err, setErr] = useState('');
  const [sending, setSending] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2 || form.phone.replace(/\D/g, '').length < 9) { setErr(t('checkout.error')); return; }
    setErr('');
    if (IS_STATIC) {
      // no server on GitHub Pages: hand the order to the manager in Telegram
      const id = Date.now() % 100000;
      openTelegram(orderLines(`ND-${String(id).padStart(5, '0')}`, form, cart, total));
      clear();
      router.push(`/checkout/success?id=${id}`);
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lang, items: cart.map((x) => ({ id: x.id, qty: x.qty, size: x.size })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'error');
      clear();
      router.push(`/checkout/success?id=${data.id}`);
    } catch {
      setErr(t('checkout.error'));
      setSending(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="page"><div className="wrap"><div className="empty" style={{ paddingTop: 120 }}>{t('cart.empty')}
        <div style={{ marginTop: 28 }}><Link href="/catalog" className="btn btn--dark">{t('cart.continue')}</Link></div></div></div></div>
    );
  }

  return (
    <div className="page">
      <div className="wrap">
        <div className="phead"><h1 className="h1">{t('checkout.title')}</h1></div>
        <div className="cartpage">
          <form className="form" onSubmit={submit} noValidate>
            <h2>{t('checkout.contact')}</h2>
            <div className="field"><label htmlFor="n">{t('checkout.name')}</label><input id="n" value={form.name} onChange={set('name')} autoComplete="name" /></div>
            <div className="field"><label htmlFor="p">{t('checkout.phone')}</label><input id="p" value={form.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" /></div>
            <h2>{t('checkout.delivery')}</h2>
            {(['pickup', 'courier'] as const).map((d) => (
              <label key={d} className={`radio ${form.delivery === d ? 'is-on' : ''}`}>
                <input type="radio" name="delivery" value={d} checked={form.delivery === d} onChange={() => setForm({ ...form, delivery: d })} hidden />
                <i />{t(d === 'pickup' ? 'checkout.pickup' : 'checkout.courier')}
              </label>
            ))}
            {form.delivery === 'courier' && <div className="field"><label htmlFor="a">{t('checkout.address')}</label><input id="a" value={form.address} onChange={set('address')} autoComplete="street-address" /></div>}
            <div className="field"><label htmlFor="c">{t('checkout.comment')}</label><textarea id="c" value={form.comment} onChange={set('comment')} /></div>
            {err && <p className="error">{err}</p>}
            <button className="btn btn--dark btn--block" disabled={sending}>{sending ? t('checkout.sending') : t(IS_STATIC ? 'checkout.submitTg' : 'checkout.submit')}</button>
            <p className="muted" style={{ fontSize: 12.5 }}>{t(IS_STATIC ? 'checkout.agreeTg' : 'checkout.agree')}</p>
          </form>
          <aside className="summary">
            <h2>{t('checkout.summary')}</h2>
            {cart.map((it) => (
              <div key={it.id + '-' + it.size} className="line" style={{ gridTemplateColumns: '64px 1fr' }}>
                <div className="line__img"><CartLineMedia item={it} /></div>
                <div>
                  <p style={{ fontFamily: 'var(--serif)', fontSize: 17 }}>{pname(it, lang)} × {it.qty}</p>
                  <p className="muted" style={{ fontSize: 12.5 }}>{it.size ? `${t('cart.size')} ${it.size} · ` : ''}{it.price === null ? t('price.request') : money(it.price * it.qty)}</p>
                </div>
              </div>
            ))}
            <div className="row-between total"><span>{t('cart.total')}</span><b>{money(total)}</b></div>
          </aside>
        </div>
      </div>
    </div>
  );
}

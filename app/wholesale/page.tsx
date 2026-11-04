'use client';

import { useState } from 'react';
import { useLang } from '@/components/providers';
import { Lines } from '@/components/Motion';
import { ProductArt } from '@/components/ProductArt';

export default function WholesalePage() {
  const { t, lang } = useLang();
  const [f, setF] = useState({ name: '', phone: '+998 ', company: '', volume: '', comment: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (f.name.trim().length < 2 || f.phone.replace(/\D/g, '').length < 9) { setState('error'); return; }
    setState('sending');
    const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, type: 'wholesale', lang }) });
    setState(res.ok ? 'done' : 'error');
  };

  return (
    <div className="page">
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap split">
          <div>
            <span className="kicker" data-reveal>{t('ws.kicker')}</span>
            <Lines as="h1" className="h1" lines={[t('ws.title')]} />
            <p className="lead" data-reveal style={{ margin: '24px 0 40px' }}>{t('ws.text')}</p>
            {state === 'done' ? (
              <p className="h3" data-reveal>{t('ws.done')}</p>
            ) : (
              <form className="form" onSubmit={submit} noValidate data-reveal>
                <div className="field"><label htmlFor="wn">{t('checkout.name')}</label><input id="wn" value={f.name} onChange={set('name')} /></div>
                <div className="field"><label htmlFor="wp">{t('checkout.phone')}</label><input id="wp" value={f.phone} onChange={set('phone')} inputMode="tel" /></div>
                <div className="field"><label htmlFor="wc">{t('ws.company')}</label><input id="wc" value={f.company} onChange={set('company')} /></div>
                <div className="field"><label htmlFor="wv">{t('ws.volume')}</label><input id="wv" value={f.volume} onChange={set('volume')} inputMode="numeric" /></div>
                <div className="field"><label htmlFor="wm">{t('checkout.comment')}</label><textarea id="wm" value={f.comment} onChange={set('comment')} /></div>
                {state === 'error' && <p className="error">{t('checkout.error')}</p>}
                <button className="btn btn--dark" disabled={state === 'sending'}>{state === 'sending' ? t('checkout.sending') : t('ws.submit')}</button>
              </form>
            )}
          </div>
          <div className="cat__media" data-curtain style={{ aspectRatio: '4 / 5', position: 'sticky', top: 140 }}>
            <ProductArt art="tennis" metal="white" stone="diamond" />
          </div>
        </div>
      </section>
    </div>
  );
}

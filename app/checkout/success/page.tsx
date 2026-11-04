'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLang } from '@/components/providers';
import { TELEGRAM } from '@/lib/i18n';

function Success() {
  const { t, lang } = useLang();
  const sp = useSearchParams();
  const num = `ND-${String(Number(sp.get('id')) || 0).padStart(5, '0')}`;
  const msg = encodeURIComponent(lang === 'uz' ? `Assalomu alaykum! Buyurtma ${num}` : `Здравствуйте! Мой заказ ${num}`);
  return (
    <div className="page">
      <div className="wrap success">
        <span className="kicker">Nargiza Diamonds</span>
        <h1 className="h1" style={{ marginTop: 18 }}>{t('success.title')}</h1>
        <p className="muted" style={{ marginTop: 30, marginBottom: 0, letterSpacing: '.2em', textTransform: 'uppercase', fontSize: 12 }}>{t('success.num')}</p>
        <div className="success__num">{num}</div>
        <p>{t('success.text')}</p>
        <div className="actions">
          <a className="btn btn--dark" href={`${TELEGRAM}?text=${msg}`} target="_blank" rel="noopener">{t('success.tg')}</a>
          <Link className="btn btn--line" href="/">{t('success.home')}</Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return <Suspense><Success /></Suspense>;
}

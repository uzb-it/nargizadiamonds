import Link from 'next/link';
import { getT } from '@/lib/server-i18n';
import { Diamond } from '@/components/Diamond';
import { Lines } from '@/components/Motion';
import { ProductArt } from '@/components/ProductArt';

export const metadata = { title: 'О нас' };

export default async function AboutPage() {
  const { t } = await getT();
  return (
    <>
      <section className="about-hero">
        <Diamond className="about-hero__canvas" />
        <div>
          <span className="kicker" data-reveal>{t('about.kicker')}</span>
          <Lines as="h1" className="h1" lines={[t('about.title')]} />
        </div>
      </section>

      <section className="section">
        <div className="wrap prose">
          <p data-reveal>{t('about.p1')}</p>
          <p data-reveal>{t('about.p2')}</p>
        </div>
      </section>

      <div className="wrap">
        <div className="numbers">
          <div data-reveal><b>19K+</b><span>{t('about.n1')}</span></div>
          <div data-reveal><b>750</b><span>{t('about.n2')}</span></div>
          <div data-reveal><b>500+</b><span>{t('about.n3')}</span></div>
        </div>
      </div>

      <section className="section">
        <div className="wrap split">
          <div className="cat__media" data-curtain style={{ aspectRatio: '4 / 5' }}>
            <ProductArt art="butterfly" metal="white" stone="sapphire" />
          </div>
          <div style={{ alignSelf: 'center' }}>
            <span className="kicker" data-reveal>BLACK DIAMOND</span>
            <Lines className="h2" lines={[t('home.boutique.title')]} />
            <p className="lead" data-reveal style={{ margin: '24px 0 36px' }}>{t('about.p3')}</p>
            <div data-reveal style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/catalog" className="btn btn--dark">{t('hero.cta')}</Link>
              <Link href="/boutique" className="btn btn--line">{t('nav.boutique')}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

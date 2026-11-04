import { getT } from '@/lib/server-i18n';
import { INSTAGRAM, MAPS, TELEGRAM } from '@/lib/i18n';
import { Lines } from '@/components/Motion';
import { MapEmbed } from '@/components/MapEmbed';

export const metadata = { title: 'Бутик' };

export default async function BoutiquePage() {
  const { t } = await getT();
  return (
    <div className="page">
      <div className="wrap phead">
        <span className="kicker">{t('home.boutique.kicker')}</span>
        <Lines as="h1" className="h1" lines={['BLACK DIAMOND']} />
      </div>
      <section className="boutique" style={{ marginBottom: 0 }}>
        <div className="boutique__map" data-curtain>
          <MapEmbed />
        </div>
        <div className="boutique__info">
          <Lines className="h2" lines={[t('home.boutique.title')]} />
          <p className="addr" data-reveal>{t('boutique.address')}</p>
          <div className="pdp__specs" data-reveal style={{ margin: 0 }}>
            <div><span>Telegram</span><a href={TELEGRAM} target="_blank" rel="noopener">@nargiza_goldd</a></div>
            <div><span>Instagram</span><a href={INSTAGRAM} target="_blank" rel="noopener">@nargizadiamons</a></div>
          </div>
          <div className="boutique__actions" data-reveal>
            <a href={MAPS} target="_blank" rel="noopener" className="btn btn--dark">{t('boutique.route')}</a>
            <a href={TELEGRAM} target="_blank" rel="noopener" className="btn btn--line">{t('boutique.write')}</a>
          </div>
        </div>
      </section>
    </div>
  );
}

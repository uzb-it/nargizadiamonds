import type { Metadata } from 'next';
// Self-hosted fonts: the build must not depend on Google Fonts being reachable.
import '@fontsource/cormorant-garamond/latin-300.css';
import '@fontsource/cormorant-garamond/cyrillic-300.css';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/cyrillic-400.css';
import '@fontsource/cormorant-garamond/latin-300-italic.css';
import '@fontsource/cormorant-garamond/cyrillic-300-italic.css';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/cyrillic-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/cyrillic-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/cyrillic-600.css';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { Motion } from '@/components/Motion';
import { ArtDefs } from '@/components/ProductArt';
import { getLang } from '@/lib/server-i18n';
import { listProducts } from '@/lib/db';

export const metadata: Metadata = {
  title: { default: 'Nargiza Diamonds — бриллианты Гонконг 750 · Ташкент', template: '%s · Nargiza Diamonds' },
  description: 'Ювелирный дом Nargiza Diamonds: бриллианты из Гонконга, золото 750 пробы. Бутик BLACK DIAMOND, ювелирный центр Алиева, метро Новза, Ташкент.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang}>
      <body suppressHydrationWarning>
        <ArtDefs />
        <Providers lang={lang} products={listProducts()}>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <Motion />
        </Providers>
      </body>
    </html>
  );
}

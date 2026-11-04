import { Suspense } from 'react';
import { CatalogEntry } from './CatalogClient';

export const metadata = { title: 'Каталог' };

export default function CatalogPage() {
  // filters are read from the URL on the client, so the page also works as a static file
  return <Suspense><CatalogEntry /></Suspense>;
}

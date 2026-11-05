import { Suspense } from 'react';
import { CheckoutClient } from './CheckoutClient';

export const metadata = { title: 'Ваш выбор', robots: { index: false } };

export default function CheckoutPage() {
  // Instagram opens this page with ?products=ID:qty,ID:qty, read on the client so it also works as a static file
  return <Suspense><CheckoutClient /></Suspense>;
}

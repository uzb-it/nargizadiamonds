import 'server-only';
import { cookies } from 'next/headers';
import type { Lang } from './types';
import { translate, type TKey } from './i18n';

export async function getLang(): Promise<Lang> {
  // static export has no request cookies; the client switches language after load
  if (process.env.STATIC_EXPORT) return 'ru';
  const v = (await cookies()).get('nd_lang')?.value;
  return v === 'uz' ? 'uz' : 'ru';
}

export async function getT() {
  const lang = await getLang();
  return { lang, t: (k: TKey) => translate(lang, k) };
}

import type { Lang, Product } from './types';

export function money(n: number): string {
  return '$' + n.toLocaleString('ru-RU').replace(/ /g, ' ');
}

export const pname = (p: { name_ru: string; name_uz: string }, lang: Lang) => (lang === 'uz' ? p.name_uz : p.name_ru);
export const pdesc = (p: Product, lang: Lang) => (lang === 'uz' ? p.desc_uz : p.desc_ru);

export function slugify(s: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n',
    о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ы: 'y', э: 'e', ю: 'yu', я: 'ya',
  };
  return s.toLowerCase().split('').map((c) => map[c] ?? c).join('')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'item';
}

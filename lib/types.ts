export type Lang = 'ru' | 'uz';
export type Category = 'rings' | 'earrings' | 'necklaces' | 'bracelets' | 'brooches';
export type Metal = 'white' | 'yellow' | 'rose';
export type Stone = 'diamond' | 'sapphire' | 'emerald' | 'ruby';

export const CATEGORIES: Category[] = ['rings', 'earrings', 'necklaces', 'bracelets', 'brooches'];
export const METALS: Metal[] = ['white', 'yellow', 'rose'];
export const STONES: Stone[] = ['diamond', 'sapphire', 'emerald', 'ruby'];

export interface Product {
  id: number;
  slug: string;
  name_ru: string;
  name_uz: string;
  desc_ru: string;
  desc_uz: string;
  category: Category;
  metal: Metal;
  stone: Stone;
  carat: number | null;
  /** USD; null = price on request */
  price: number | null;
  images: string[];
  /** key of the built-in illustration used when there are no photos */
  art: string;
  featured: boolean;
  in_stock: boolean;
  sizes: number[];
  created_at: string;
}

export interface CartItem {
  id: number;
  slug: string;
  name_ru: string;
  name_uz: string;
  price: number | null;
  art: string;
  metal: Metal;
  image: string | null;
  size: number | null;
  qty: number;
}

export type OrderStatus = 'new' | 'confirmed' | 'done' | 'cancelled';

export interface Order {
  id: number;
  type: 'order' | 'wholesale';
  created_at: string;
  name: string;
  phone: string;
  delivery: string;
  address: string;
  comment: string;
  items: { id: number; name: string; price: number | null; qty: number; size: number | null }[];
  total: number;
  status: OrderStatus;
  lang: Lang;
}

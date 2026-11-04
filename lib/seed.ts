import type { Category, Metal, Stone } from './types';

interface Seed {
  slug: string; name_ru: string; name_uz: string; desc_ru: string; desc_uz: string;
  category: Category; metal: Metal; stone: Stone; carat: number | null; price: number | null;
  art: string; featured: boolean; sizes: number[];
}

const RING_SIZES = [15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19];

/**
 * Starter catalogue. The first four prices come from the brand's Instagram posts;
 * the rest are placeholders to be edited in /admin.
 */
export const SEED_PRODUCTS: Seed[] = [
  {
    slug: 'cascade-earrings', name_ru: 'Серьги Cascade', name_uz: 'Cascade sirg‘alari',
    desc_ru: 'Каскад бриллиантов грушевидной огранки в жёлтом золоте 750. Камни отобраны вручную и ловят свет при каждом движении.',
    desc_uz: 'Sariq 750 oltindagi nok shaklidagi brilliantlar kaskadi. Toshlar qo‘lda tanlangan va har bir harakatda nur taratadi.',
    category: 'earrings', metal: 'yellow', stone: 'diamond', carat: 3.98, price: 3600, art: 'drops', featured: true, sizes: [],
  },
  {
    slug: 'inside-out-hoops', name_ru: 'Серьги-конго Inside-Out', name_uz: 'Inside-Out halqa sirg‘alar',
    desc_ru: 'Бриллианты по внешней и внутренней стороне кольца — сияние с любого ракурса. Белое золото 750.',
    desc_uz: 'Halqaning tashqi va ichki tomonidagi brilliantlar — har tomondan yarqiraydi. Oq oltin 750.',
    category: 'earrings', metal: 'white', stone: 'diamond', carat: 3.34, price: 3500, art: 'hoops', featured: true, sizes: [],
  },
  {
    slug: 'riviere-necklace', name_ru: 'Колье Rivière', name_uz: 'Rivière marjoni',
    desc_ru: 'Теннисное колье — непрерывная река бриллиантов, которая становится центром любого образа.',
    desc_uz: 'Tennis marjon — har qanday obrazning markaziga aylanadigan uzluksiz brilliantlar daryosi.',
    category: 'necklaces', metal: 'white', stone: 'diamond', carat: 5.2, price: 3800, art: 'tennis', featured: true, sizes: [],
  },
  {
    slug: 'eternity-band', name_ru: 'Кольцо Eternity', name_uz: 'Eternity uzugi',
    desc_ru: 'Дорожка бриллиантов по всему кругу — символ бесконечности. Идеально для помолвки и на каждый день.',
    desc_uz: 'Aylana bo‘ylab brilliantlar qatori — cheksizlik ramzi. Unashtiruv va har kun uchun ideal.',
    category: 'rings', metal: 'white', stone: 'diamond', carat: 2.1, price: 2000, art: 'band', featured: true, sizes: RING_SIZES,
  },
  {
    slug: 'papillon-ring', name_ru: 'Кольцо Papillon', name_uz: 'Papillon uzugi',
    desc_ru: 'Бабочка из пейва синих сапфиров в обрамлении бриллиантов. Изделие-характер.',
    desc_uz: 'Brilliantlar bilan o‘ralgan ko‘k safir pave kapalak. Xarakterli buyum.',
    category: 'rings', metal: 'white', stone: 'sapphire', carat: null, price: null, art: 'butterfly', featured: true, sizes: RING_SIZES,
  },
  {
    slug: 'classic-solitaire', name_ru: 'Солитер Classic', name_uz: 'Classic solitaire',
    desc_ru: 'Один бриллиант круглой огранки на шести крапанах. Вечная классика помолвочного кольца.',
    desc_uz: 'Olti tirgakdagi bitta dumaloq brilliant. Unashtiruv uzugining abadiy klassikasi.',
    category: 'rings', metal: 'yellow', stone: 'diamond', carat: 1.0, price: 1450, art: 'solitaire', featured: true, sizes: RING_SIZES,
  },
  {
    slug: 'halo-ring', name_ru: 'Кольцо Halo', name_uz: 'Halo uzugi',
    desc_ru: 'Центральный камень в ореоле из мелких бриллиантов — визуально крупнее и ярче.',
    desc_uz: 'Mayda brilliantlar halqasidagi markaziy tosh — vizual kattaroq va yorqinroq.',
    category: 'rings', metal: 'rose', stone: 'diamond', carat: 0.8, price: 1290, art: 'halo', featured: false, sizes: RING_SIZES,
  },
  {
    slug: 'trinity-ring', name_ru: 'Кольцо Trinity', name_uz: 'Trinity uzugi',
    desc_ru: 'Три бриллианта — прошлое, настоящее и будущее. Белое золото 750.',
    desc_uz: 'Uchta brilliant — o‘tmish, hozir va kelajak. Oq oltin 750.',
    category: 'rings', metal: 'white', stone: 'diamond', carat: 1.5, price: 2650, art: 'trinity', featured: false, sizes: RING_SIZES,
  },
  {
    slug: 'twist-ring', name_ru: 'Кольцо Twist', name_uz: 'Twist uzugi',
    desc_ru: 'Две переплетённые линии золота и бриллиантов. Лёгкое кольцо на каждый день.',
    desc_uz: 'Oltin va brilliantlarning ikki chirmashgan chizig‘i. Har kun uchun yengil uzuk.',
    category: 'rings', metal: 'yellow', stone: 'diamond', carat: 0.5, price: 980, art: 'twist', featured: false, sizes: RING_SIZES,
  },
  {
    slug: 'solo-studs', name_ru: 'Пусеты Solo', name_uz: 'Solo sirg‘alari',
    desc_ru: 'Классические пусеты с бриллиантами по 0,5 карата. Подходят ко всему.',
    desc_uz: '0,5 karatli brilliantli klassik sirg‘alar. Hamma narsaga mos.',
    category: 'earrings', metal: 'white', stone: 'diamond', carat: 1.0, price: 1350, art: 'studs', featured: false, sizes: [],
  },
  {
    slug: 'etoile-drops', name_ru: 'Серьги Étoile', name_uz: 'Étoile sirg‘alari',
    desc_ru: 'Подвески-звёзды в розовом золоте — нежное сияние для вечера.',
    desc_uz: 'Pushti oltindagi yulduz osma sirg‘alar — kechki nafis jilo.',
    category: 'earrings', metal: 'rose', stone: 'diamond', carat: 1.2, price: 1890, art: 'halodrop', featured: false, sizes: [],
  },
  {
    slug: 'larme-pendant', name_ru: 'Подвеска Larme', name_uz: 'Larme kulon',
    desc_ru: 'Бриллиант-капля на тонкой цепочке. Минимализм, который замечают.',
    desc_uz: 'Ingichka zanjirdagi tomchi brilliant. E‘tiborni tortadigan minimalizm.',
    category: 'necklaces', metal: 'yellow', stone: 'diamond', carat: 0.7, price: 1150, art: 'pendant', featured: false, sizes: [],
  },
  {
    slug: 'emerald-pendant', name_ru: 'Подвеска Émeraude', name_uz: 'Émeraude kulon',
    desc_ru: 'Изумруд в ореоле бриллиантов. Глубокий зелёный цвет и белое золото.',
    desc_uz: 'Brilliantlar halqasidagi zumrad. Chuqur yashil rang va oq oltin.',
    category: 'necklaces', metal: 'white', stone: 'emerald', carat: 1.1, price: null, art: 'pendant', featured: false, sizes: [],
  },
  {
    slug: 'ligne-bracelet', name_ru: 'Браслет Ligne', name_uz: 'Ligne bilaguzugi',
    desc_ru: 'Теннисный браслет — линия бриллиантов на запястье.',
    desc_uz: 'Tennis bilaguzuk — bilakdagi brilliantlar chizig‘i.',
    category: 'bracelets', metal: 'white', stone: 'diamond', carat: 4.0, price: 3200, art: 'bracelet', featured: false, sizes: [],
  },
  {
    slug: 'cercle-bangle', name_ru: 'Браслет Cercle', name_uz: 'Cercle bilaguzugi',
    desc_ru: 'Жёсткий браслет из жёлтого золота с дорожкой бриллиантов.',
    desc_uz: 'Brilliant yo‘lakchali sariq oltindan qattiq bilaguzuk.',
    category: 'bracelets', metal: 'yellow', stone: 'diamond', carat: 0.9, price: 1700, art: 'bangle', featured: false, sizes: [],
  },
  {
    slug: 'fleur-brooch', name_ru: 'Брошь Fleur', name_uz: 'Fleur broshi',
    desc_ru: 'Цветок с бриллиантовыми лепестками на золотом стебле.',
    desc_uz: 'Oltin poyadagi brilliant gulbargli gul.',
    category: 'brooches', metal: 'yellow', stone: 'diamond', carat: 2.4, price: null, art: 'brooch', featured: false, sizes: [],
  },
];

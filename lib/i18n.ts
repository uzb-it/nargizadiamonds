// Пакет «Старт»: сайт только на русском. Узбекский и английский добавляются в пакете «Продажи».
const ru = {
  'nav.jewelry': 'Украшения', 'nav.gifts': 'Подарки', 'nav.maison': 'О доме', 'nav.boutique': 'Бутик',
  'nav.search': 'Поиск', 'nav.contact': 'Связаться', 'nav.collections': 'Коллекции',
  'nav.all': 'Все украшения', 'nav.under1500': 'Подарки до $1 500', 'nav.newin': 'Новинки', 'nav.highlights': 'Бестселлеры',
  'cat.rings': 'Кольца', 'cat.earrings': 'Серьги', 'cat.necklaces': 'Колье и подвески', 'cat.bracelets': 'Браслеты', 'cat.brooches': 'Броши',
  'metal.white': 'Белое золото', 'metal.yellow': 'Жёлтое золото', 'metal.rose': 'Розовое золото',
  'stone.diamond': 'Бриллиант', 'stone.sapphire': 'Сапфир', 'stone.emerald': 'Изумруд', 'stone.ruby': 'Рубин',
  'price.request': 'Цена по запросу',
  'topbar': 'Бриллианты из Гонконга · Золото 750 пробы',
  'hero.cta': 'Открыть коллекцию', 'hero.story': 'История дома', 'hero.slide': 'Показать слайд',
  'hero.a.k': 'Бриллианты · Золото 750', 'hero.a.t': 'Свет, который остаётся навсегда', 'hero.a.d': 'Бриллианты из Гонконга в золоте 750 пробы.', 'hero.a.cta': 'Открыть коллекцию',
  'hero.a.st': 'Каждый камень выбран лично', 'hero.a.sd': 'Мы сами отбираем бриллианты в Гонконге, одном из мировых центров ювелирного искусства. Каждое изделие сделано из золота 750 пробы.',
  'hero.b.k': 'Сапфиры · Изумруды · Рубины', 'hero.b.t': 'Глубина цвета', 'hero.b.d': 'Драгоценные камни в оправе из золота 750 пробы.', 'hero.b.cta': 'Смотреть камни',
  'hero.b.st': 'Цвет, который не спутать', 'hero.b.sd': 'Синий сапфира, зелень изумруда и алый рубин лучше всего видно вживую. Приходите посмотреть их в бутик BLACK DIAMOND.',
  'home.cats': 'Мир украшений', 'home.catsSub': 'Золото 750 пробы и бриллианты, отобранные в Гонконге',
  'home.discover': 'Смотреть',
  'home.duo1.k': 'Помолвка', 'home.duo1.t': 'Кольца, которые говорят «да»', 'home.duo1.d': 'Солитеры и кольца с паве — классика, созданная на всю жизнь.',
  'home.duo2.k': 'Сапфиры и изумруды', 'home.duo2.t': 'Цвет драгоценных камней', 'home.duo2.d': 'Глубокий синий, зелёный и алый в оправе из золота 750.',
  'home.featured': 'Бестселлеры', 'home.featuredSub': 'Изделия, которые выбирают наши клиенты',
  'home.story.kicker': 'Ювелирный дом', 'home.story.title': 'Искусство выбирать камень',
  'home.story.text': 'Каждый бриллиант мы отбираем лично в Гонконге — одном из мировых центров ювелирного искусства. Золото 750 пробы, честная цена и внимание к каждой детали.',
  'home.story.cta': 'О ювелирном доме',
  'home.gifts.kicker': 'Идеи подарков', 'home.gifts.title': 'Бриллианты до $1 500', 'home.gifts.text': 'Пусеты, подвески и тонкие кольца — подарок, с которого начинается коллекция.',
  'home.services': 'Сервис Nargiza Diamonds',
  'svc.video.t': 'Видео изделия', 'svc.video.d': 'Покажем украшение при дневном свете и в движении.',
  'svc.boutique.t': 'Примерка в бутике', 'svc.boutique.d': 'Примерьте любое изделие в BLACK DIAMOND.',
  'svc.size.t': 'Подбор размера', 'svc.size.d': 'Поможем определить размер кольца и подобрать пару.',
  'svc.care.t': 'Уход и чистка', 'svc.care.d': 'Бесплатная чистка и проверка камней раз в год.',
  'home.boutique.kicker': 'Бутик', 'home.boutique.title': 'Ждём вас в BLACK DIAMOND',
  'boutique.address': 'Ювелирный центр Алиева, 2 этаж, метро Новза, Ташкент',
  'boutique.route': 'Построить маршрут', 'boutique.write': 'Написать нам',
  'boutique.text': 'Приходите увидеть украшения вживую: мы покажем изделия, поможем подобрать размер и расскажем о каждом камне.',
  'catalog.title': 'Все украшения', 'catalog.items': 'изделий', 'catalog.filters': 'Фильтры',
  'catalog.metal': 'Металл', 'catalog.stone': 'Камень', 'catalog.price': 'Цена', 'catalog.sort': 'Сортировка',
  'sort.featured': 'Рекомендуемые', 'sort.priceAsc': 'Цена по возрастанию', 'sort.priceDesc': 'Цена по убыванию', 'sort.new': 'Новинки',
  'catalog.loading': 'Загружаем украшения…', 'catalog.failed': 'Не удалось загрузить каталог. Обновите страницу.',
  'catalog.reset': 'Сбросить', 'catalog.empty': 'Нет изделий по выбранным фильтрам', 'catalog.show': 'Показать',
  'catalog.more': 'Показать ещё', 'catalog.shown': 'Показано',  'catalog.of': 'из',
  'price.any': 'Любая', 'price.u1500': 'До $1 500', 'price.1500-3000': '$1 500 – $3 000', 'price.o3000': 'От $3 000',
  'product.carat': 'Вес бриллиантов', 'product.metal': 'Металл', 'product.stone': 'Камень', 'product.sizes': 'Размеры в наличии',
  'product.visit': 'Посмотреть в бутике', 'product.ask': 'Задать вопрос',
  'product.inStock': 'В наличии в бутике', 'product.outStock': 'Под заказ',
  'product.details': 'Описание', 'product.care': 'Уход и сервис', 'product.boutique': 'Где посмотреть',
  'product.careText': 'Храните изделие отдельно в футляре. Раз в год рекомендуем бесплатную чистку и проверку крапанов в бутике.',
  'product.boutiqueText': 'Изделие можно увидеть и примерить в бутике BLACK DIAMOND: ювелирный центр Алиева, 2 этаж, метро Новза.',
  'product.related': 'Вам может понравиться', 'product.origin': 'Происхождение', 'product.hk': 'Гонконг',
  'about.kicker': 'О доме', 'about.title': 'Только самые лучшие бриллианты',
  'about.p1': 'Nargiza Diamonds — ювелирный дом в Ташкенте. Мы привозим изделия из Гонконга, одного из мировых центров ювелирного искусства, и работаем только с золотом 750 пробы.',
  'about.p2': 'Каждый камень мы отбираем лично. Показываем видео изделия, отвечаем на вопросы и помогаем выбрать — как для себя.',
  'about.p3': 'Наш бутик BLACK DIAMOND находится в ювелирном центре Алиева у метро Новза.',
  'about.n1': 'подписчиков', 'about.n2': 'проба золота', 'about.n3': 'изделий показано',
  'footer.about': 'Бриллианты из Гонконга и золото 750 пробы. Бутик BLACK DIAMOND, Ташкент.',
  'footer.shop': 'Украшения', 'footer.maison': 'Ювелирный дом', 'footer.contacts': 'Контакты', 'footer.rights': 'Все права защищены.',
  'search.placeholder': 'Кольцо, серьги, сапфир…', 'search.none': 'Ничего не найдено', 'search.popular': 'Популярное',
  'misc.close': 'Закрыть',
};

export type TKey = keyof typeof ru;

export function translate(key: TKey): string {
  return ru[key] ?? key;
}

export const TELEGRAM = 'https://t.me/nargiza_goldd';
export const INSTAGRAM = 'https://www.instagram.com/nargizadiamons/';
export const MAPS = 'https://www.google.com/maps/search/?api=1&query=%D1%8E%D0%B2%D0%B5%D0%BB%D0%B8%D1%80%D0%BD%D1%8B%D0%B9+%D1%86%D0%B5%D0%BD%D1%82%D1%80+%D0%90%D0%BB%D0%B8%D0%B5%D0%B2%D0%B0+%D0%9D%D0%BE%D0%B2%D0%B7%D0%B0+%D0%A2%D0%B0%D1%88%D0%BA%D0%B5%D0%BD%D1%82';

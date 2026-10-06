/**
 * Author-approved copy that GAME_COPY_V2.json does not contain.
 * Kept out of the canonical JSON on purpose (see CLAUDE.md: do not modify canonical data).
 */

/** L14 — Wikipedia rabbit hole: start page, then one article per canonical link (history → geography → physics → mythology). */
export const WIKI_PAGES = ['Короткая дорога', 'Римские дороги', 'Великий шёлковый путь', 'Магнитный полюс', 'Северное сияние'];

/** L25 — route choices per segment, in the order of the two options (a, b). */
export const ROUTE_LABELS: Record<string, [string, string]> = {
  slope: ['Напрямик через горку', 'Обходная тропа'],
  obstacle: ['Длинный обход', 'Через завал'],
  final: ['Прямо через овраг', 'Вдоль реки'],
};

/**
 * Gift certificate text, carried over from the legacy certificate. The certificate CODE (the booking key)
 * is deliberately NOT included: the repository is public, the physical certificate is handed over separately.
 */
export const CERTIFICATE = {
  heading: 'ПОДАРОЧНЫЙ СЕРТИФИКАТ',
  service: 'Полёт на авиатренажёре Boeing 737 в любой день',
  terms: '90 мин; до 4 чел.',
  recipient: 'Антон',
  wish: 'Точно знаю, что ты можешь абсолютно всё! И любая высота тебе по плечу',
  expiresLabel: 'Срок получения услуги до',
  expires: '2 апреля 2028 г.',
  howTitle: 'Как воспользоваться сертификатом',
  how: 'Запишитесь на полёт на сайте liner737.com/ekaterinburg через кнопку предварительной записи или по телефону +7 (343) 293-49-63. При получении услуги обязательно предъявите бланк сертификата. При отмене или переносе визита позднее, чем за 48 часов до назначенной даты, сертификат аннулируется. Сертификат нужно использовать до окончания срока действия.',
  address: 'Ждём Вас по адресу: г. Екатеринбург, ул. Онежская, д. 4.',
};

/**
 * UI copy — single source for product strings (not Privacy/About pages).
 * Import { copy } from '../config/copy'
 */

export const copy = {
  nav: {
    back: 'назад',
    fullSchedule: 'Полное расписание',
    routeMap: 'Карта маршрута',
    about: 'О проекте',
    privacy: 'Политика конфиденциальности',
  },

  home: {
    title: 'Маршрутки Янино-1',
    tabFromLadozhskaya: 'С Ладожской',
    promoTitle: 'Расписание всегда под рукой',
    promoSubtitle: 'Добавьте его на главный экран',
  },

  homescreen: {
    title: 'Добавляем ярлык сайта на\u00a0домашний экран телефона',
    subtitle: 'Расписание всегда будет под рукой',
    iphone: 'У меня iPhone',
    android: 'У меня Android',
  },

  widget: {
    now: 'сейчас',
    inPrefix: 'через',
    tomorrowSuffix: ' (завтра)',
    followingPrefix: 'Следующие в',
    previousLeft: (until) => `Предыдущая ушла ${until} назад`,
    emptyDirection: 'Нет данных по этому направлению.',
    stopMoved: 'Остановка переехала',
    viewOnMap: 'Посмотреть на карте',
    stopLadozhskayaTitle: 'Остановка на Ладожской',
  },

  fromLadozhskaya: {
    empty: 'Нет данных о расписании с Ладожской',
    showMore: 'Показать ещё',
    noMoreToday: 'Больше рейсов сегодня нет',
  },

  fullSchedule: {
    loading: 'загружаем расписание…',
    empty: 'Нет данных расписания',
    title: (routeNumber) => `Маршрутка ${routeNumber}`,
    sourceLabel: 'Источник расписания',
    sourceUrlLabel: 'https://vk.com/doc546677069_685452050',
  },

  map: {
    title: (name) => `Карта маршрута ${name}`,
    missing: (routeId) => `Карта для маршрута ${routeId} пока не добавлена.`,
    stopsMeta: (count) => `${count} остановок · маршрут по дорогам`,
  },

  period: {
    weekday: 'Будние дни',
    weekend: 'Выходные дни',
  },

  day: {
    weekday: 'Будний',
    weekend: 'Выходной',
  },

  direction: {
    fromYanino: 'Из Янино',
    fromLadozhskaya: 'С Ладожской',
    fromRazmetelevo: 'Из Разметелево',
    fromEksolovo: 'Из Ёксолово',
    fromDubrovka: 'Из Дубровки',
    fromMega: 'От "МЕГА Дыбенко"',
    fallback1: 'Направление 1',
    fallback2: 'Направление 2',
  },

  time: {
    minutes: (n) => `${n} мин`,
    hours: (h) => `${h} ч.`,
    hoursMinutes: (h, m) => `${h} ч. ${m} мин`,
  },

  monthsGenitive: [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ],

  a11y: {
    loadingSchedule: 'Загрузка расписания',
    close: 'Закрыть',
  },

  errors: {
    scheduleLoad: (routeNumber) =>
      `Не удалось загрузить расписание для маршрута ${routeNumber}.`,
    scheduleProcess: (routeNumber) =>
      `Не удалось обработать данные расписания для маршрута ${routeNumber}.`,
    scheduleProcessGeneric: 'Не удалось обработать данные расписания',
    scheduleFile: 'Не удалось загрузить файл расписания.',
    schedulesLoad: 'Не удалось загрузить расписания',
    scheduleFileNotFound: (status) => `Файл расписания не найден (${status})`,
    ymapsKeyMissing: 'Не задан ключ Яндекс.Карт (VITE_YANDEX_MAPS_KEY)',
    ymapsLoad: 'Не удалось загрузить Яндекс.Карты',
    stopNoCoords: 'Нет координат остановки',
  },
}

/** Groups for /ds — keep in sync with `copy` keys. */
export const COPY_GROUPS = [
  { id: 'nav', label: 'Nav', description: 'Навигация и футер' },
  { id: 'home', label: 'Home', description: 'Главная' },
  { id: 'homescreen', label: 'Homescreen', description: 'Добавление на домашний экран' },
  { id: 'widget', label: 'Widget', description: 'Карточки направлений' },
  { id: 'fromLadozhskaya', label: 'From Ladozhskaya', description: 'Таб «С Ладожской»' },
  { id: 'fullSchedule', label: 'Full schedule', description: 'Полное расписание' },
  { id: 'map', label: 'Map', description: 'Карта маршрута' },
  { id: 'period', label: 'Period', description: 'Будние / выходные (UI + parser)' },
  { id: 'day', label: 'Day type', description: 'Подпись даты на главной' },
  { id: 'direction', label: 'Directions', description: 'formatDirectionName + fallbacks' },
  { id: 'time', label: 'Time', description: 'formatTimeUntil' },
  { id: 'monthsGenitive', label: 'Months', description: 'Родительный падеж для даты' },
  { id: 'a11y', label: 'A11y', description: 'aria-label' },
  { id: 'errors', label: 'Errors', description: 'Ошибки загрузки' },
]

const SAMPLE = {
  until: '12 мин',
  routeNumber: '533',
  routeId: '533',
  name: '533',
  count: 12,
  n: 12,
  h: 1,
  m: 5,
  status: 404,
}

const FN_SAMPLES = {
  'widget.previousLeft': [SAMPLE.until],
  'fullSchedule.title': [SAMPLE.routeNumber],
  'map.title': [SAMPLE.name],
  'map.missing': [SAMPLE.routeId],
  'map.stopsMeta': [SAMPLE.count],
  'time.minutes': [SAMPLE.n],
  'time.hours': [SAMPLE.h],
  'time.hoursMinutes': [SAMPLE.h, SAMPLE.m],
  'errors.scheduleLoad': [SAMPLE.routeNumber],
  'errors.scheduleProcess': [SAMPLE.routeNumber],
  'errors.scheduleFileNotFound': [SAMPLE.status],
}

/** Flatten one copy branch for /ds preview. */
export function flattenCopyBranch(value, prefix = '') {
  if (typeof value === 'function') {
    const args = FN_SAMPLES[prefix] ?? []
    return [{ key: prefix, value: value(...args), kind: 'fn' }]
  }

  if (Array.isArray(value)) {
    return value.map((item, i) => ({
      key: `${prefix}[${i}]`,
      value: String(item),
      kind: 'str',
    }))
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) =>
      flattenCopyBranch(v, prefix ? `${prefix}.${k}` : k),
    )
  }

  return [{ key: prefix, value: String(value), kind: 'str' }]
}

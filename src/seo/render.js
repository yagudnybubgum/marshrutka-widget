import { copy } from '../config/copy.js'
import { formatTime } from '../utils/schedule/formatTime.js'

export const SITE_ORIGIN = 'https://yanino.online'
export const OG_IMAGE = `${SITE_ORIGIN}/og.png`

export const routeCatalog = [
  {
    id: '533',
    slug: '533',
    name: '533',
    destination: 'Янино-1',
    kind: 'route',
    title: 'Расписание маршрутки 533 Янино-1 — Ладожская',
    description:
      'Маршрутка 533: отправления из Янино-1 и со станции Ладожская. Полное расписание на будни и выходные.',
    h1: 'Расписание маршрутки 533',
    lead:
      'Маршрутка 533 ходит между Янино-1 и станцией Ладожская. Ниже все отправления из Янино и с Ладожской: отдельно будни и выходные.',
    tripName: '533 Янино-1 — Ладожская',
  },
  {
    id: '429',
    slug: '429',
    name: '429',
    destination: 'Разметелево',
    kind: 'route',
    title: 'Расписание маршрутки 429 Разметелево — Янино — Ладожская',
    description:
      'Маршрутка 429: отправления из Разметелево, Янино-1 и со станции Ладожская. Будни и выходные.',
    h1: 'Расписание маршрутки 429',
    lead:
      'Маршрутка 429 едет из Разметелево через Янино-1 к станции Ладожская. В таблице отправления по будням и выходным.',
    tripName: '429 Разметелево — Ладожская',
  },
  {
    id: '664',
    slug: '664',
    name: '664',
    destination: 'МЕГА Дыбенко',
    kind: 'route',
    title: 'Расписание маршрутки 664 Янино-1 — МЕГА Дыбенко',
    description:
      'Маршрутка 664: отправления из Янино-1 до МЕГА Дыбенко и обратно. Будни и выходные.',
    h1: 'Расписание маршрутки 664',
    lead:
      'Маршрутка 664 связывает Янино-1 с МЕГА Дыбенко. С Ладожской этот маршрут не отправляется.',
    tripName: '664 Янино-1 — МЕГА Дыбенко',
  },
  {
    id: '430A',
    slug: '430A',
    name: '430А',
    destination: 'Ёксолово',
    kind: 'route',
    title: 'Расписание маршрутки 430А Ёксолово — Янино — Ладожская',
    description:
      'Маршрутка 430А: отправления из Ёксолово, Янино-1 и со станции Ладожская. Будни и выходные.',
    h1: 'Расписание маршрутки 430А',
    lead:
      'Маршрутка 430А ходит из Ёксолово через Янино-1 к станции Ладожская. Ниже полное расписание на будни и выходные.',
    tripName: '430А Ёксолово — Ладожская',
  },
  {
    id: '453',
    slug: '453',
    name: '453',
    destination: 'Дубровка',
    kind: 'route',
    title: 'Расписание маршрутки 453 Дубровка — Янино — Ладожская',
    description:
      'Маршрутка 453: отправления из Дубровки, Янино-1 и со станции Ладожская. Будни и выходные.',
    h1: 'Расписание маршрутки 453',
    lead:
      'Маршрутка 453 едет из Дубровки через Янино-1 к станции Ладожская. В таблице отправления по будням и выходным.',
    tripName: '453 Дубровка — Ладожская',
  },
  {
    id: '605',
    slug: '605',
    name: '605',
    destination: 'ул. Быкова (Павлово)',
    kind: 'route',
    title: 'Расписание маршрутки 605 Янино-1 — Павлово, ул. Быкова',
    description:
      'Маршрутка 605: отправления из Янино-1 и из Павлово, улица Быкова. Будни и выходные.',
    h1: 'Расписание маршрутки 605',
    lead:
      'Маршрутка 605 ходит между Янино-1 и улицей Быкова в Павлово. Ниже отправления в обе стороны.',
    tripName: '605 Янино-1 — Павлово',
  },
  {
    id: 'ladozhskaya',
    slug: 's-ladozhskoy',
    name: 'С Ладожской',
    destination: 'Янино-1',
    kind: 'hub',
    title: 'Расписание маршруток с Ладожской в Янино-1',
    description:
      'Отправления маршруток 533, 429, 430А и 453 от станции Ладожская в Янино-1. Будни и выходные.',
    h1: 'Маршрутки с Ладожской',
    lead:
      'Отправления от станции Ладожская в сторону Янино-1: маршруты 533, 429, 430А и 453. Маршруты 664 и 605 с Ладожской не ходят.',
    tripName: 'Маршрутки с Ладожской в Янино-1',
  },
]

const PAGE_CSS = `
  @font-face {
    font-family: "Google Sans";
    src: url("/fonts/google-sans/GoogleSans-Regular.ttf") format("truetype");
    font-weight: 400;
    font-display: swap;
  }
  @font-face {
    font-family: "Google Sans";
    src: url("/fonts/google-sans/GoogleSans-Medium.ttf") format("truetype");
    font-weight: 500;
    font-display: swap;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; background: #f8fafd; color: #15202c; }
  body {
    font-family: "Google Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-weight: 400;
    line-height: 1.45;
  }
  a { color: #21459d; text-decoration-thickness: 1px; text-underline-offset: 2px; }
  .wrap { max-width: 40rem; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
  header { margin-bottom: 1.5rem; font-size: 0.875rem; }
  h1 { font-size: 1.75rem; font-weight: 400; line-height: 1.25; margin: 0 0 0.75rem; }
  h2 { font-size: 1.125rem; font-weight: 500; margin: 1.75rem 0 0.75rem; }
  h3 { font-size: 0.95rem; font-weight: 500; margin: 1rem 0 0.4rem; }
  .lead { margin: 0 0 1rem; }
  .widget { margin: 0 0 0.5rem; }
  .times { list-style: none; display: flex; flex-wrap: wrap; gap: 0.35rem; padding: 0; margin: 0; }
  .times li {
    background: #fff;
    border: 1px solid #d3d8e0;
    border-radius: 999px;
    padding: 0.15rem 0.55rem;
    font-variant-numeric: tabular-nums;
  }
  nav { display: flex; flex-wrap: wrap; gap: 0.5rem 0.9rem; margin-top: 2.5rem; padding-top: 1rem; border-top: 1px solid #d3d8e0; }
  nav a { font-size: 0.875rem; }
`

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function ladozhskayaColumns(schedule) {
  return (schedule?.columns || []).filter(
    (col) => col.name === copy.direction.fromLadozhskaya && col.times?.length,
  )
}

export function pageIsIndexable(page, input) {
  if (page.kind === 'hub') {
    return (input.routes || []).some((route) => ladozhskayaColumns(route.schedule).length > 0)
  }
  return (input.schedule?.columns || []).some((col) => col.times?.length)
}

function rangeLabel(times) {
  const sorted = [...times].sort((a, b) => a - b)
  if (!sorted.length) return ''
  if (sorted.length === 1) return formatTime(sorted[0])
  return `${formatTime(sorted[0])}–${formatTime(sorted[sorted.length - 1])}`
}

export function summarizeSchedule(schedule) {
  const columns = schedule?.columns || []
  const weekday = columns.filter((col) => col.period === copy.period.weekday && col.times?.length)
  const source = weekday.length ? weekday : columns.filter((col) => col.times?.length)
  return source
    .map((col) => `${col.name}: ${rangeLabel(col.times)}`)
    .join(', ')
}

export function summarizeLadozhskaya(routes) {
  return (routes || [])
    .map((route) => {
      const columns = ladozhskayaColumns(route.schedule)
      const weekday = columns.filter((col) => col.period === copy.period.weekday)
      const source = weekday.length ? weekday : columns
      const times = source.flatMap((col) => col.times)
      if (!times.length) return ''
      return `${route.name}: ${rangeLabel(times)}`
    })
    .filter(Boolean)
    .join(', ')
}

function renderTimeList(times) {
  return `<ul class="times">${times
    .map((time) => `<li>${escapeHtml(formatTime(time))}</li>`)
    .join('')}</ul>`
}

function renderGroupedColumns(groups) {
  return groups
    .map(
      ([period, columns]) => `<section>
      <h2>${escapeHtml(period)}</h2>
      ${columns
        .map(
          (col) => `<h3>${escapeHtml(col.name)}</h3>
      ${renderTimeList(col.times)}`,
        )
        .join('')}
    </section>`,
    )
    .join('')
}

function groupByPeriod(columns) {
  const groups = new Map()
  for (const col of columns) {
    if (!groups.has(col.period)) groups.set(col.period, [])
    groups.get(col.period).push(col)
  }
  return [...groups.entries()]
}

function renderRouteBody(schedule) {
  const columns = schedule?.columns || []
  if (!columns.length) return '<p>Расписание пока не опубликовано</p>'
  return renderGroupedColumns(groupByPeriod(columns))
}

function renderHubBody(routes) {
  const byPeriod = new Map()
  for (const route of routes || []) {
    for (const col of ladozhskayaColumns(route.schedule)) {
      if (!byPeriod.has(col.period)) byPeriod.set(col.period, [])
      byPeriod.get(col.period).push({
        name: `Маршрутка ${route.name}`,
        times: col.times,
      })
    }
  }
  if (!byPeriod.size) return '<p>Расписание пока не опубликовано</p>'
  return renderGroupedColumns([...byPeriod.entries()])
}

function renderNav(page) {
  return routeCatalog
    .filter((item) => item.slug !== page.slug)
    .map((item) => {
      const label = item.kind === 'hub' ? item.name : `${item.name} — ${item.destination}`
      return `<a href="/${item.slug}/">${escapeHtml(label)}</a>`
    })
    .join('')
}

function jsonLdScript(page) {
  const url = `${SITE_ORIGIN}/${page.slug}/`
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url,
    inLanguage: 'ru',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Маршрутки Янино-1',
      url: `${SITE_ORIGIN}/`,
    },
    about: {
      '@type': 'BusTrip',
      name: page.tripName,
      url,
    },
  }
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function renderRouteDocument({ page, schedule, routes }) {
  const indexable = pageIsIndexable(page, { schedule, routes })
  const robots = indexable ? 'index,follow' : 'noindex,follow'
  const canonical = `${SITE_ORIGIN}/${page.slug}/`
  const body = page.kind === 'hub' ? renderHubBody(routes) : renderRouteBody(schedule)
  const widgetHref = page.kind === 'hub' ? '/?tab=ladozhskaya' : `/?tab=${page.id}`

  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}" />
  <meta name="robots" content="${robots}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:title" content="${escapeHtml(page.title)}" />
  <meta property="og:description" content="${escapeHtml(page.description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Маршрутки Янино-1 — расписание 533, 429, 664, 430А, 453, 605" />
  <meta property="og:locale" content="ru_RU" />
  <link rel="icon" type="image/svg+xml" href="/fav.svg" />
  <script type="application/ld+json">${jsonLdScript(page)}</script>
  <style>${PAGE_CSS}</style>
</head>
<body>
  <div class="wrap">
    <header><a href="/">Маршрутки Янино-1</a></header>
    <main>
      <h1>${escapeHtml(page.h1)}</h1>
      <p class="lead">${escapeHtml(page.lead)}</p>
      <p class="widget"><a href="${widgetHref}">Ближайшие рейсы</a></p>
      ${body}
    </main>
    <nav>${renderNav(page)}</nav>
  </div>
</body>
</html>
`
}

export function renderHomeIndex(entries) {
  const items = (entries || [])
    .map((entry) => {
      const detail = entry.detail ? ` <span>${escapeHtml(entry.detail)}</span>` : ''
      return `<li><a href="${escapeHtml(entry.href)}">${escapeHtml(entry.label)}</a>${detail}</li>`
    })
    .join('')

  return `<section id="schedules" class="seo-index"><h2>Полное расписание</h2><p>На главной — ближайший рейс. Полные таблицы отправлений по маршрутам:</p><ul>${items}</ul></section>`
}

export function injectHomeIndex(html, section) {
  if (html.includes('id="schedules"')) return html
  return html.replace('</body>', `${section}</body>`)
}

export function buildSitemap(entries) {
  const urls = entries
    .filter((entry) => entry.index)
    .map(
      (entry) => `  <url>
    <loc>${escapeHtml(entry.loc)}</loc>
    <lastmod>${escapeHtml(entry.lastmod)}</lastmod>
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

export function buildRobotsTxt() {
  return `User-agent: *
Allow: /

Disallow: /ds
Disallow: /anatomy
Disallow: /full/

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`
}

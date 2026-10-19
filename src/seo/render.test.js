import { describe, expect, it } from 'vitest'
import { processScheduleForFull } from '../utils/schedule/processSchedule.js'
import {
  SITE_ORIGIN,
  buildRobotsTxt,
  buildSitemap,
  injectHomeIndex,
  renderHomeIndex,
  renderRouteDocument,
  routeCatalog,
  summarizeSchedule,
} from './render.js'

const FIXTURE = [
  ['будни', 'будни', 'выходные', 'выходные'],
  ['Янино => Ладожская', 'Ладожская => Янино', 'Янино => Ладожская', 'Ладожская => Янино'],
  ['5:46', '6:16', '7:00', '7:40'],
  ['8:10', '8:40', '9:10', '9:50'],
]

const cancellationDay = new Date('2026-08-11T12:00:00')

function scheduleFor(routeId) {
  return processScheduleForFull(FIXTURE, {
    routeId,
    date: cancellationDay,
    applyCancellations: false,
  })
}

describe('renderRouteDocument', () => {
  const page = routeCatalog.find((item) => item.slug === '533')
  const html = renderRouteDocument({
    page,
    schedule: scheduleFor('533'),
  })

  it('publishes a unique title, description, canonical and og:image', () => {
    expect(html).toContain('<title>Расписание маршрутки 533 Янино-1 — Ладожская</title>')
    expect(html).toContain('name="description"')
    expect(html).toContain('rel="canonical" href="https://yanino.online/533/"')
    expect(html).toContain('property="og:image" content="https://yanino.online/og.png"')
    expect(html).toContain('name="robots" content="index,follow"')
    expect(html).toContain('application/ld+json')
    expect(html).toContain('"@type":"BusTrip"')
  })

  it('keeps weekday and weekend departures in the html, including same-day cancellations', () => {
    expect(html).toContain('Будние дни')
    expect(html).toContain('Выходные дни')
    expect(html).toContain('Из Янино')
    expect(html).toContain('С Ладожской')
    expect(html).toContain('>5:46<')
    expect(html).toContain('>7:00<')
  })

  it('links to the live widget and the other route pages', () => {
    expect(html).toContain('href="/?tab=533"')
    expect(html).toContain('href="/429/"')
    expect(html).toContain('href="/s-ladozhskoy/"')
    expect(html).not.toContain('href="/533/"')
  })

  it('noindexes a route that has no published times', () => {
    const empty = renderRouteDocument({
      page,
      schedule: { columns: [], hasPeriodInfo: true },
    })
    expect(empty).toContain('name="robots" content="noindex,follow"')
    expect(empty).toContain('Расписание пока не опубликовано')
  })
})

describe('ladozhskaya page', () => {
  it('lists only departures from Ladozhskaya, per route', () => {
    const page = routeCatalog.find((item) => item.slug === 's-ladozhskoy')
    const html = renderRouteDocument({
      page,
      routes: [
        {
          id: '533',
          name: '533',
          schedule: scheduleFor('533'),
        },
        {
          id: '664',
          name: '664',
          schedule: {
            columns: [
              { period: 'Будние дни', name: 'От "МЕГА Дыбенко"', times: [400] },
            ],
            hasPeriodInfo: false,
          },
        },
      ],
    })

    expect(html).toContain('https://yanino.online/s-ladozhskoy/')
    expect(html).toContain('>6:16<')
    expect(html).toContain('533')
    expect(html).not.toContain('>5:46<')
    expect(html).not.toContain('От &quot;МЕГА Дыбенко&quot;')
    expect(html).not.toContain('>6:40<')
  })
})

describe('home index', () => {
  it('renders crawlable links with the first and last weekday departure', () => {
    const html = renderHomeIndex([
      {
        href: '/533/',
        label: '533 — Янино-1',
        detail: summarizeSchedule(scheduleFor('533')),
      },
    ])
    expect(html).toContain('id="schedules"')
    expect(html).toContain('href="/533/"')
    expect(html).toContain('5:46')
    expect(html).toContain('8:10')
  })

  it('inserts the block once, before </body>', () => {
    const source = '<html><body><div id="root"></div></body></html>'
    const section = '<section id="schedules">routes</section>'
    const once = injectHomeIndex(source, section)
    expect(once).toBe(
      '<html><body><div id="root"></div><section id="schedules">routes</section></body></html>',
    )
    expect(injectHomeIndex(once, section)).toBe(once)
  })
})

describe('sitemap and robots', () => {
  it('lists only indexable urls', () => {
    const xml = buildSitemap([
      { loc: `${SITE_ORIGIN}/`, index: true, lastmod: '2026-10-19' },
      { loc: `${SITE_ORIGIN}/533/`, index: true, lastmod: '2026-10-19' },
      { loc: `${SITE_ORIGIN}/664/`, index: false, lastmod: '2026-10-19' },
    ])
    expect(xml).toContain('<loc>https://yanino.online/</loc>')
    expect(xml).toContain('<loc>https://yanino.online/533/</loc>')
    expect(xml).toContain('<lastmod>2026-10-19</lastmod>')
    expect(xml).not.toContain('/664/')
  })

  it('points crawlers at the sitemap and closes junk routes', () => {
    const robots = buildRobotsTxt()
    expect(robots).toContain('Sitemap: https://yanino.online/sitemap.xml')
    expect(robots).toContain('Disallow: /ds')
    expect(robots).toContain('Disallow: /anatomy')
    expect(robots).toContain('Disallow: /full/')
  })
})

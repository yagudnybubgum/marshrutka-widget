import fs from 'fs'
import path from 'path'
import { processScheduleForFull } from '../src/utils/schedule/processSchedule.js'
import {
  SITE_ORIGIN,
  buildRobotsTxt,
  buildSitemap,
  pageIsIndexable,
  renderRouteDocument,
  routeCatalog,
  summarizeLadozhskaya,
  summarizeSchedule,
} from '../src/seo/render.js'

function emptySchedule() {
  return { columns: [], hasPeriodInfo: false }
}

export function loadSchedulesById(publicDir) {
  const dir = path.join(publicDir, 'schedules')
  const byId = {}

  for (const page of routeCatalog) {
    if (page.kind !== 'route') continue
    const file = path.join(dir, `${page.id}.json`)
    if (!fs.existsSync(file)) {
      byId[page.id] = { schedule: emptySchedule(), mtime: null }
      continue
    }

    const raw = JSON.parse(fs.readFileSync(file, 'utf8'))
    const schedule = processScheduleForFull(raw, {
      routeId: page.id,
      applyCancellations: false,
    }) || emptySchedule()
    byId[page.id] = {
      schedule,
      mtime: fs.statSync(file).mtime,
    }
  }

  return byId
}

export function toDateStamp(date) {
  const value = date instanceof Date ? date : new Date()
  const y = value.getFullYear()
  const m = String(value.getMonth() + 1).padStart(2, '0')
  const d = String(value.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function routeInput(page, byId) {
  if (page.kind === 'hub') {
    return {
      routes: routeCatalog
        .filter((item) => item.kind === 'route')
        .map((item) => ({
          id: item.id,
          name: item.name,
          schedule: byId[item.id]?.schedule || emptySchedule(),
        })),
    }
  }
  return { schedule: byId[page.id]?.schedule || emptySchedule() }
}

export function buildDocuments(publicDir) {
  const byId = loadSchedulesById(publicDir)
  const mtimes = Object.values(byId)
    .map((item) => item.mtime)
    .filter(Boolean)
  const latest = mtimes.sort((a, b) => b - a)[0] || new Date()

  const pages = routeCatalog.map((page) => {
    const input = routeInput(page, byId)
    const ownMtime = page.kind === 'hub' ? latest : byId[page.id]?.mtime || latest
    return {
      page,
      ...input,
      index: pageIsIndexable(page, input),
      lastmod: toDateStamp(ownMtime),
    }
  })

  const homeEntries = pages
    .filter((item) => item.index)
    .map((item) => ({
      href: `/${item.page.slug}/`,
      label: item.page.kind === 'hub'
        ? item.page.name
        : `${item.page.name} — ${item.page.destination}`,
      detail: item.page.kind === 'hub'
        ? summarizeLadozhskaya(item.routes)
        : summarizeSchedule(item.schedule),
    }))

  const sitemapEntries = [
    { loc: `${SITE_ORIGIN}/`, index: true, lastmod: toDateStamp(latest) },
    ...pages.map((item) => ({
      loc: `${SITE_ORIGIN}/${item.page.slug}/`,
      index: item.index,
      lastmod: item.lastmod,
    })),
  ]

  return { pages, homeEntries, sitemapEntries }
}

export function writeSeoFiles(publicDir) {
  const { pages, sitemapEntries } = buildDocuments(publicDir)

  fs.writeFileSync(path.join(publicDir, 'robots.txt'), buildRobotsTxt())
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), buildSitemap(sitemapEntries))

  for (const item of pages) {
    const dir = path.join(publicDir, item.page.slug)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(
      path.join(dir, 'index.html'),
      renderRouteDocument({
        page: item.page,
        schedule: item.schedule,
        routes: item.routes,
      }),
    )
  }

  const indexed = pages.filter((item) => item.index).map((item) => item.page.slug)
  console.log(`[seo] ${pages.length} pages, indexed: ${indexed.join(', ') || 'none'}`)
}

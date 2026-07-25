/**
 * Color system map for /ds.
 *
 * 1. CSS vars in src/index.css (:root)  ← values
 * 2. tailwind.config.js                 ← var → utilities (+ opacity on ink)
 * 3. Components use TW classes
 * 4. routes.js color key → ROUTE_COLORS
 */

/** Raw CSS vars from index.css. Keep in sync with :root. */
export const CSS_PALETTE = [
  {
    id: 'surface',
    label: 'Surface',
    note: 'Фоны. Два почти-белых уровня.',
    vars: ['--surface', '--surface-muted'],
  },
  {
    id: 'ink',
    label: 'Ink',
    note: 'Один токен (channels). Прозрачность — через TW: text-ink/70, bg-ink/40, …',
    vars: ['--ink'],
    examples: [
      { tw: 'text-ink', label: '100%' },
      { tw: 'text-ink/80', label: '80%' },
      { tw: 'text-ink/70', label: '70%' },
      { tw: 'text-ink/60', label: '60%' },
      { tw: 'text-ink/50', label: '50%' },
      { tw: 'bg-ink/40', label: 'overlay 40%' },
      { tw: 'border-ink/20', label: 'line 20%' },
      { tw: 'border-ink/10', label: 'hairline 10%' },
      { tw: 'bg-ink/5', label: 'ghost 5%' },
      { tw: 'bg-ink/[0.03]', label: 'press 3%' },
    ],
  },
  {
    id: 'chip',
    label: 'Chip / accent',
    note: '3 токена. soft ink → text-chip-active-ink/70; hover → bg-chip-active-hover (#bfdbfe в TW).',
    vars: ['--chip', '--chip-active', '--chip-active-ink'],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    note: 'Реально разные hue.',
    vars: ['--alert', '--alert-hover', '--highlight', '--stroke', '--map-line'],
  },
  {
    id: 'routes',
    label: 'Routes',
    note: 'Пары bg+ink. --route-blue → --chip-active, --route-gray → --chip.',
    vars: [
      '--route-blue',
      '--route-blue-ink',
      '--route-green',
      '--route-green-ink',
      '--route-gray',
      '--route-gray-ink',
      '--route-purple',
      '--route-purple-ink',
      '--route-orange',
      '--route-orange-ink',
    ],
    aliases: [
      { css: '--route-blue', pointsTo: '--chip-active' },
      { css: '--route-gray', pointsTo: '--chip' },
    ],
  },
]

export const TOKEN_GROUPS = [
  {
    id: 'surface',
    label: 'Surface',
    description: 'Фоны страниц и карточек',
    tokens: [
      { name: 'surface', css: '--surface', tw: 'bg-surface', role: 'bg' },
      { name: 'surface-muted', css: '--surface-muted', tw: 'bg-surface-muted', role: 'bg' },
    ],
  },
  {
    id: 'ink',
    label: 'Ink',
    description: 'text-ink + opacity modifiers',
    tokens: [
      { name: 'ink', css: '--ink', tw: 'text-ink', role: 'fg' },
      { name: 'ink/70', css: '--ink', tw: 'text-ink/70', role: 'fg' },
      { name: 'ink/40', css: '--ink', tw: 'bg-ink/40', role: 'bg' },
      { name: 'ink/10', css: '--ink', tw: 'border-ink/10', role: 'border' },
    ],
  },
  {
    id: 'chip',
    label: 'Chip / accent',
    description: 'Табы и CTA',
    tokens: [
      { name: 'chip', css: '--chip', tw: 'bg-chip', role: 'bg' },
      { name: 'chip-active', css: '--chip-active', tw: 'bg-chip-active', role: 'bg' },
      { name: 'chip-active-ink', css: '--chip-active-ink', tw: 'text-chip-active-ink', role: 'fg' },
      { name: 'chip-active-hover', css: '#bfdbfe', tw: 'bg-chip-active-hover', role: 'bg' },
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    description: 'Алерты, хайлайт, бордер, линия карты',
    tokens: [
      { name: 'alert', css: '--alert', tw: 'bg-alert', role: 'bg' },
      { name: 'alert-hover', css: '--alert-hover', tw: 'bg-alert-hover', role: 'bg' },
      { name: 'highlight', css: '--highlight', tw: 'bg-highlight', role: 'bg' },
      { name: 'stroke', css: '--stroke', tw: 'border-stroke', role: 'border' },
      { name: 'map-line', css: '--map-line', tw: 'bg-map-line', role: 'bg' },
    ],
  },
]

export const ROUTE_COLORS = {
  blue: { key: 'blue', bg: 'bg-route-blue', ink: 'text-route-blue-ink', cssBg: '--route-blue', cssInk: '--route-blue-ink' },
  green: { key: 'green', bg: 'bg-route-green', ink: 'text-route-green-ink', cssBg: '--route-green', cssInk: '--route-green-ink' },
  gray: { key: 'gray', bg: 'bg-route-gray', ink: 'text-route-gray-ink', cssBg: '--route-gray', cssInk: '--route-gray-ink' },
  purple: { key: 'purple', bg: 'bg-route-purple', ink: 'text-route-purple-ink', cssBg: '--route-purple', cssInk: '--route-purple-ink' },
  orange: { key: 'orange', bg: 'bg-route-orange', ink: 'text-route-orange-ink', cssBg: '--route-orange', cssInk: '--route-orange-ink' },
}

export const ROUTE_COLOR_KEYS = Object.keys(ROUTE_COLORS)

export const getRouteColorClasses = (key) => {
  const c = ROUTE_COLORS[key] ?? ROUTE_COLORS.gray
  return `${c.bg} ${c.ink}`
}

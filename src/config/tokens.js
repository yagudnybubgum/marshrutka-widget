/**
 * Color system map for /ds.
 *
 * 1. CSS vars in src/index.css (:root)  ← values
 * 2. tailwind.config.js                 ← var → utilities (+ opacity on ink/accent-ink)
 * 3. Components use TW classes
 * 4. routes.js color key → ROUTE_COLORS
 * 5. .hover-darken — затемнение фона на --hover-darken (10%)
 */

/** Raw CSS vars from index.css. Keep in sync with :root. */
export const CSS_PALETTE = [
  {
    id: 'surface',
    label: 'Surface',
    note: 'Три уровня одного холодного ряда (OKLCH H=258).',
    vars: ['--surface', '--surface-muted', '--surface-sunken'],
  },
  {
    id: 'ink',
    label: 'Ink',
    note: 'Один токен (channels), холодный near-black. Прозрачность — через TW: text-ink/70, bg-ink/40, …',
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
    ],
  },
  {
    id: 'accent',
    label: 'Accent',
    note: 'Один hue (OKLCH H=264): solid для линий и иконок, soft для чипов и CTA. Hover → .hover-darken.',
    vars: ['--accent', '--accent-soft', '--accent-ink'],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    note: 'alert — soft coral (не жёлтый). Hover → .hover-darken.',
    vars: ['--alert', '--alert-ink', '--danger', '--danger-ink', '--highlight', '--stroke', '--map-line', '--hover-darken'],
    aliases: [{ css: '--map-line', pointsTo: '--accent' }],
  },
  {
    id: 'routes',
    label: 'Routes',
    note: 'Пары bg+ink на общей сетке: bg L=95% C=0.045, ink L=42%, контраст 7.0–7.9.',
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
      { css: '--route-blue', pointsTo: '--accent-soft' },
      { css: '--route-blue-ink', pointsTo: '--accent-ink' },
      { css: '--route-gray', pointsTo: '--surface-sunken' },
    ],
  },
]

export const TOKEN_GROUPS = [
  {
    id: 'surface',
    label: 'Surface',
    description: 'Фоны страниц, карточек и нейтральных чипов',
    tokens: [
      { name: 'surface', css: '--surface', tw: 'bg-surface', role: 'bg' },
      { name: 'surface-muted', css: '--surface-muted', tw: 'bg-surface-muted', role: 'bg' },
      { name: 'surface-sunken', css: '--surface-sunken', tw: 'bg-surface-sunken', role: 'bg' },
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
    id: 'accent',
    label: 'Accent',
    description: 'Табы, CTA, линия маршрута',
    tokens: [
      { name: 'accent', css: '--accent', tw: 'bg-accent', role: 'bg' },
      { name: 'accent-soft', css: '--accent-soft', tw: 'bg-accent-soft', role: 'bg' },
      { name: 'accent-ink', css: '--accent-ink', tw: 'text-accent-ink', role: 'fg' },
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    description: 'Алерты, ошибки, выделение строки, бордер',
    tokens: [
      { name: 'alert', css: '--alert', tw: 'bg-alert', role: 'bg' },
      { name: 'alert-ink', css: '--alert-ink', tw: 'text-alert-ink', role: 'fg' },
      { name: 'danger', css: '--danger', tw: 'bg-danger', role: 'bg' },
      { name: 'danger-ink', css: '--danger-ink', tw: 'text-danger-ink', role: 'fg' },
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

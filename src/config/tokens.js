/**
 * Design system map for /ds.
 *
 * 1. CSS vars in src/index.css (:root)  ← values
 * 2. tailwind.config.js                 ← var → utilities (+ opacity on ink/accent-ink)
 * 3. Components use TW classes
 * 4. routes.js color key → ROUTE_COLORS
 * 5. .hover-darken — затемнение фона на --hover-darken
 * 6. Radius: --radius-* → rounded-{sm|md|lg|xl|2xl|3xl|full}
 */

/** Raw CSS vars from index.css. Keep in sync with :root. */
export const CSS_PALETTE = [
  {
    id: 'surface',
    label: 'Surface',
    note: 'Холодный ряд H≈258. chip — между muted и sunken (idle чипы).',
    vars: ['--surface', '--surface-muted', '--surface-chip', '--surface-sunken'],
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

/** Radius scale for /ds previews. Roles guide which utility to pick. */
export const RADIUS_SCALE = [
  { name: 'sm', css: '--radius-sm', tw: 'rounded-sm', rem: '0.25rem', px: '4', role: 'micro' },
  { name: 'md', css: '--radius-md', tw: 'rounded-md', rem: '0.5rem', px: '8', role: 'control' },
  { name: 'lg', css: '--radius-lg', tw: 'rounded-lg', rem: '0.75rem', px: '12', role: 'panel' },
  { name: 'xl', css: '--radius-xl', tw: 'rounded-xl', rem: '1rem', px: '16', role: 'reserved' },
  { name: '2xl', css: '--radius-2xl', tw: 'rounded-2xl', rem: '1.25rem', px: '20', role: 'reserved' },
  { name: '3xl', css: '--radius-3xl', tw: 'rounded-3xl', rem: '1.5rem', px: '24', role: 'card' },
  { name: 'full', css: '--radius-full', tw: 'rounded-full', rem: '9999px', px: '∞', role: 'pill' },
]

/**
 * Current production usage. Keep in sync when migrating components.
 * `variants` = directional / aliases that resolve to the same token.
 */
export const RADIUS_USAGE = [
  {
    name: 'sm',
    tw: ['rounded-sm', 'rounded'],
    used: false,
    notes: 'DEFAULT `rounded` = sm. Сейчас только на /ds (color picker, micro swatch).',
    places: ['DesignSystem (color input, ink example chip)'],
  },
  {
    name: 'md',
    tw: ['rounded-md'],
    used: true,
    notes: 'Контролы и «квадратные» поверхности поменьше.',
    places: [
      'RouteMapPage — контейнер карты',
      'StopLocationOverlay — кнопка закрыть',
      'index.css .skeleton — border-radius: var(--radius-md)',
      'DesignSystem — мелкие превью',
    ],
  },
  {
    name: 'lg',
    tw: ['rounded-lg'],
    used: true,
    notes: 'Alert / EmptyState / DS-панели.',
    places: [
      'ui/Alert, EmptyState',
      'DesignSystem — панели секций',
    ],
  },
  {
    name: 'xl',
    tw: ['rounded-xl'],
    used: false,
    notes: 'Запас. В продукте пока не используется.',
    places: [],
  },
  {
    name: '2xl',
    tw: ['rounded-2xl'],
    used: false,
    notes: 'Запас. В продукте пока не используется.',
    places: [],
  },
  {
    name: '3xl',
    tw: ['rounded-3xl', 'rounded-t-3xl', 'md:rounded-3xl'],
    used: true,
    notes: 'DirectionCard + PromoCard + sheet/modal.',
    places: [
      'MarshrutkaWidget DirectionCard (+ skeleton, stop notice rounded-t-3xl)',
      'ui/PromoCard — home CTA + homescreen platform cards',
      'StopLocationOverlay — bottom sheet (rounded-t-3xl) + desktop modal (md:rounded-3xl)',
    ],
  },
  {
    name: 'full',
    tw: ['rounded-full'],
    used: true,
    notes: 'Pills / badges.',
    places: [
      'ui/Chip, ui/RouteBadge',
      'FromLadozhskaya — skeleton badge',
      'StopLocationOverlay — drag handle',
      'DesignSystem — chip / route previews',
    ],
  },
]

export const TOKEN_GROUPS = [
  {
    id: 'surface',
    label: 'Surface',
    description: 'Фоны страниц, чипов и нейтральных панелей',
    tokens: [
      { name: 'surface', css: '--surface', tw: 'bg-surface', role: 'bg' },
      { name: 'surface-muted', css: '--surface-muted', tw: 'bg-surface-muted', role: 'bg' },
      { name: 'surface-chip', css: '--surface-chip', tw: 'bg-surface-chip', role: 'bg' },
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

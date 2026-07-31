/**
 * Design system map for /ds.
 *
 * 1. CSS vars in src/index.css (:root)  ← values
 * 2. tailwind.config.js                 ← var → utilities (+ opacity on ink/accent-ink)
 * 3. Components use TW classes
 * 4. routes.js color key → ROUTE_COLORS
 * 5. .hover-darken — darkens background by --hover-darken
 * 6. Radius: --radius-* → rounded-{sm|md|lg|xl|2xl|3xl|full}
 * 7. Type: Google Sans + TW text-* / font-* (see TYPE_SCALE / TYPE_USAGE)
 */

/** Raw CSS vars from index.css. Keep in sync with :root. */
export const CSS_PALETTE = [
  {
    id: 'surface',
    label: 'Surface',
    note: 'Cool neutrals (H≈258). Chip sits between muted and sunken for idle chips.',
    vars: ['--surface', '--surface-muted', '--surface-chip', '--surface-sunken'],
  },
  {
    id: 'ink',
    label: 'Ink',
    note: 'One near-black token. Soften it with Tailwind opacity: text-ink/70, bg-ink/40, …',
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
    note: 'One hue (OKLCH H=264): solid for lines/icons, soft for chips and CTAs. Hover uses .hover-darken.',
    vars: ['--accent', '--accent-soft', '--accent-ink'],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    note: 'Alert is soft coral (not yellow). Hover uses .hover-darken.',
    vars: ['--alert', '--alert-ink', '--danger', '--danger-ink', '--highlight', '--stroke', '--map-line', '--hover-darken'],
    aliases: [{ css: '--map-line', pointsTo: '--accent' }],
  },
  {
    id: 'routes',
    label: 'Routes',
    note: 'bg + ink pairs on a shared grid: bg L=95% C=0.045, ink L=42%, contrast 7.0–7.9.',
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
    notes: 'DEFAULT `rounded` = sm. Only on /ds for now (color picker, micro swatch).',
    places: ['DesignSystem (color input, ink example chip)'],
  },
  {
    name: 'md',
    tw: ['rounded-md'],
    used: true,
    notes: 'Controls and smaller square surfaces.',
    places: [
      'RouteMapPage — map container',
      'StopLocationOverlay — close button',
      'index.css .skeleton — border-radius: var(--radius-md)',
      'DesignSystem — small previews',
    ],
  },
  {
    name: 'lg',
    tw: ['rounded-lg'],
    used: true,
    notes: 'Alert / EmptyState / DS panels.',
    places: [
      'ui/Alert, EmptyState',
      'DesignSystem — section panels',
    ],
  },
  {
    name: 'xl',
    tw: ['rounded-xl'],
    used: false,
    notes: 'Reserved. Not used in product yet.',
    places: [],
  },
  {
    name: '2xl',
    tw: ['rounded-2xl'],
    used: false,
    notes: 'Reserved. Not used in product yet.',
    places: [],
  },
  {
    name: '3xl',
    tw: ['rounded-3xl', 'rounded-t-3xl'],
    used: true,
    notes: 'DirectionCard + PromoCard + sheet/modal.',
    places: [
      'MarshrutkaWidget DirectionCard (+ skeleton, stop notice rounded-t-3xl)',
      'ui/PromoCard — accent (AddToHomescreenPromo) + muted (HomescreenPlatformCards)',
      'StopLocationOverlay — mobile vaul sheet (rounded-t-3xl, snaps 0.55/0.92) + desktop modal (rounded-3xl)',
      'HomeScreen — mobile vaul sheet (rounded-t-3xl, snaps 0.55/0.92) over Home; desktop full-page portal',
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

/**
 * Typography scale used in product UI (not legal pages).
 * Values = Tailwind defaults; countdown is the only custom size.
 * Face: Google Sans 400/500 from index.css @font-face.
 */
export const TYPE_SCALE = [
  {
    name: 'caption',
    tw: 'text-xs text-ink/70',
    size: '12 / 16',
    rem: '0.75rem',
    weight: '400',
    role: 'meta',
    sample: 'Source: carrier schedule',
  },
  {
    name: 'body-sm',
    tw: 'text-sm font-normal text-ink/70',
    size: '14 / 20',
    rem: '0.875rem',
    weight: '400',
    role: 'secondary',
    sample: 'Next departure · in 12 min',
  },
  {
    name: 'body',
    tw: 'text-base font-normal text-ink',
    size: '16 / 24',
    rem: '1rem',
    weight: '400',
    role: 'primary',
    sample: 'Stop has moved',
  },
  {
    name: 'label',
    tw: 'text-sm font-medium text-ink',
    size: '14 / 20',
    rem: '0.875rem',
    weight: '500',
    role: 'chip',
    sample: '533 · Vsevolozhsk',
  },
  {
    name: 'title-sm',
    tw: 'text-lg font-normal text-ink',
    size: '18 / 28',
    rem: '1.125rem',
    weight: '400',
    role: 'sheet',
    sample: 'Where is the stop',
  },
  {
    name: 'title',
    tw: 'text-xl font-normal text-ink',
    size: '20 / 28',
    rem: '1.25rem',
    weight: '400',
    role: 'page',
    sample: 'Towards Ladozhskaya',
  },
  {
    name: 'display',
    tw: 'text-2xl font-normal text-ink',
    size: '24 / 32',
    rem: '1.5rem',
    weight: '400',
    role: 'hero',
    sample: 'Minibuses from the metro',
  },
  {
    name: 'countdown',
    tw: 'font-normal text-ink',
    style: { fontSize: '40px', lineHeight: 1 },
    recipe: "font-normal text-ink · style={{ fontSize: '40px', lineHeight: 1 }}",
    size: '40 / 40',
    rem: '2.5rem',
    weight: '400',
    role: 'hero-num',
    sample: '20:57',
  },
]

/** Ink opacity roles for type. Keep in sync with product classes. */
export const TYPE_INK = [
  { name: 'ink', tw: 'text-ink', opacity: '100%', role: 'primary' },
  { name: 'ink/80', tw: 'text-ink/80', opacity: '80%', role: 'soft primary (times, labels)' },
  { name: 'ink/70', tw: 'text-ink/70', opacity: '70%', role: 'secondary / meta' },
]

/**
 * Current production type usage. Keep in sync when migrating components.
 */
export const TYPE_USAGE = [
  {
    name: 'caption',
    tw: ['text-xs', 'text-xs text-ink/70'],
    used: true,
    notes: 'Footnotes, sources, small links.',
    places: [
      'FullSchedule — sourceLabel + privacy link',
      'RouteMapPage — caption under the map',
      'ui/TextLink size=xs',
    ],
  },
  {
    name: 'body-sm',
    tw: ['text-sm font-normal', 'text-sm text-ink/70', 'text-sm text-ink/80'],
    used: true,
    notes: 'Main secondary UI text.',
    places: [
      'Home, HomeScreen, DepartureRow, BackLink',
      'MarshrutkaWidget — countdown labels',
      'FullSchedule — table cells',
      'ui/TextLink size=sm, RouteBadge (with font-medium → label)',
    ],
  },
  {
    name: 'body',
    tw: ['text-base font-normal', 'text-base text-ink/70'],
    used: true,
    notes: 'Chips, notices, body on larger screens.',
    places: [
      'ui/Chip',
      'MarshrutkaWidget — stopMoved notice',
      'HomeScreen — subtitle (non-compact)',
      'FromLadozhskaya — tab labels',
      'ui/TextLink size=base, PromoCard compact title',
    ],
  },
  {
    name: 'label',
    tw: ['text-sm font-medium'],
    used: true,
    notes: 'Only medium weight on compact controls.',
    places: ['ui/RouteBadge'],
  },
  {
    name: 'title-sm',
    tw: ['text-lg font-normal'],
    used: true,
    notes: 'Sheet / modal titles.',
    places: ['StopLocationOverlay — Drawer.Title + desktop h2'],
  },
  {
    name: 'title',
    tw: ['text-xl font-normal', 'text-xl font-normal leading-7'],
    used: true,
    notes: 'Screen and card titles.',
    places: [
      'Home — h1',
      'FullSchedule, RouteMapPage — h1',
      'MarshrutkaWidget — directionName',
      'DepartureRow — timeLabel',
      'PromoCard — title (default)',
      'HomeScreen compact title',
    ],
  },
  {
    name: 'display',
    tw: ['text-2xl font-normal', 'text-2xl sm:text-3xl font-normal'],
    used: true,
    notes: 'Large hero. sm:text-3xl only on HomeScreen non-compact.',
    places: ['About — h1', 'HomeScreen — title (non-compact)'],
  },
  {
    name: 'countdown',
    tw: ["font-normal text-ink", "style={{ fontSize: '40px', lineHeight: 1 }}"],
    used: true,
    notes: 'Only custom size. 40px font + lh:1 → 40px box.',
    places: ['MarshrutkaWidget DirectionCard — next departure time'],
  },
  {
    name: 'emphasis',
    tw: ['font-semibold'],
    used: true,
    notes: 'Not a separate size — weight only on body-sm.',
    places: ['FullSchedule — highlighted next departure'],
  },
]

export const TOKEN_GROUPS = [
  {
    id: 'surface',
    label: 'Surface',
    description: 'Page, chip, and neutral panel backgrounds',
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
    description: 'text-ink plus opacity modifiers',
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
    description: 'Tabs, CTAs, and the route line',
    tokens: [
      { name: 'accent', css: '--accent', tw: 'bg-accent', role: 'bg' },
      { name: 'accent-soft', css: '--accent-soft', tw: 'bg-accent-soft', role: 'bg' },
      { name: 'accent-ink', css: '--accent-ink', tw: 'text-accent-ink', role: 'fg' },
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    description: 'Alerts, errors, row highlight, borders',
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

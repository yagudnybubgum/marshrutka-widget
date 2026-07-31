import { useCallback, useEffect, useState } from 'react'
import { ROUTES } from '../config/routes'
import {
  CSS_PALETTE,
  TOKEN_GROUPS,
  ROUTE_COLORS,
  RADIUS_SCALE,
  RADIUS_USAGE,
  TYPE_SCALE,
  TYPE_INK,
  TYPE_USAGE,
  getRouteColorClasses,
} from '../config/tokens'
import { copy } from '../config/copy'
import { AddToHomescreenPromo } from './AddToHomescreenPromo'
import { HomescreenPlatformCards } from './HomescreenPlatformCards'
import {
  Alert,
  BackLink,
  Chip,
  ChipGroup,
  DepartureRow,
  EmptyState,
  RouteBadge,
  TextLink,
} from './ui'

const DS_NAV = [
  { id: 'how', label: 'How it works' },
  { id: 'palette', label: '1 · Palette' },
  { id: 'radius', label: '1b · Radius' },
  { id: 'live', label: 'Live sync' },
  { id: 'tailwind', label: '2 · Tailwind' },
  { id: 'routes', label: '3 · Routes' },
  { id: 'components', label: '4 · Components' },
  { id: 'type', label: '5 · Type' },
  { id: 'cheatsheet', label: 'Cheatsheet' },
]

const SECTION_SCROLL = 'scroll-mt-6'

function DsSideNav() {
  const [active, setActive] = useState(DS_NAV[0].id)

  useEffect(() => {
    const nodes = DS_NAV.map(({ id }) => document.getElementById(id)).filter(Boolean)
    if (nodes.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) setActive(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      aria-label="Sections"
      className="pointer-events-none fixed inset-y-0 left-0 z-20 hidden xl:flex items-center pl-4"
    >
      <ul className="pointer-events-auto flex flex-col gap-1.5 px-3">
        {DS_NAV.map((item) => {
          const isActive = active === item.id
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block text-sm whitespace-nowrap transition-colors ${
                  isActive ? 'text-ink font-medium' : 'text-ink/40 hover:text-ink/70'
                }`}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function readCssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/** Channels ("0 0 0") → usable CSS color; hex/rgb pass through. */
function asCssColor(raw) {
  if (!raw) return 'transparent'
  if (raw.startsWith('#') || raw.startsWith('rgb') || raw.startsWith('hsl') || raw.startsWith('oklch')) {
    return raw
  }
  if (/^[\d.]+\s+[\d.]+\s+[\d.]+/.test(raw)) {
    return `rgb(${raw})`
  }
  return raw
}

function Swatch({ token, revision = 0 }) {
  const [value, setValue] = useState('')

  useEffect(() => {
    if (token.css.startsWith('#')) {
      setValue(token.css)
      return
    }
    setValue(readCssVar(token.css))
  }, [token.css, revision])

  const previewClass =
    token.role === 'fg'
      ? `bg-surface ${token.tw}`
      : token.role === 'border'
        ? `bg-surface border-4 ${token.tw}`
        : token.tw

  return (
    <div className="flex items-stretch gap-3">
      <div
        className={`h-14 w-14 shrink-0 rounded-lg border border-ink/10 ${previewClass} flex items-center justify-center text-sm font-medium`}
      >
        {token.role === 'fg' ? 'Aa' : null}
      </div>
      <div className="min-w-0 flex flex-col justify-center gap-0.5">
        <p className="text-sm font-medium text-ink truncate">{token.name}</p>
        <p className="text-xs text-ink/70 font-mono truncate">{token.css}</p>
        <p className="text-xs text-ink/50 font-mono truncate">{token.tw}</p>
        <p className="text-xs text-ink/60 font-mono truncate">{value || '…'}</p>
      </div>
    </div>
  )
}

function CssVarSwatch({ cssVar, revision = 0 }) {
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(readCssVar(cssVar))
  }, [cssVar, revision])

  const color = asCssColor(value)
  const label = value && !value.startsWith('#') && !value.includes('(')
    ? `rgb(${value})`
    : value

  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <div
        className="h-12 w-full rounded-md border border-ink/10"
        style={{ backgroundColor: color }}
        title={label}
      />
      <p className="text-xs font-mono text-ink truncate">{cssVar}</p>
      <p className="text-[11px] font-mono text-ink/50 truncate">{label || '…'}</p>
    </div>
  )
}

function HowItWorks() {
  return (
    <section id="how" className={`space-y-4 ${SECTION_SCROLL}`}>
      <div>
        <h2 className="text-lg font-medium text-ink">How it works</h2>
        <p className="text-sm text-ink/70 mt-1">
          Colors live in CSS variables. Components only use Tailwind classes that point at those
          variables — never raw hex in JSX.
        </p>
      </div>

      <ol className="rounded-lg bg-surface border border-ink/10 divide-y divide-ink/5 text-sm">
        <li className="p-4 space-y-1">
          <p className="font-medium text-ink">
            1. Define tokens — <code className="font-mono text-ink/70">src/index.css</code>
          </p>
          <p className="text-ink/70">
            Surfaces, ink, accent, alerts, and route colors all live under{' '}
            <code className="text-ink">:root</code>.
          </p>
        </li>
        <li className="p-4 space-y-1">
          <p className="font-medium text-ink">
            2. Wire them to Tailwind —{' '}
            <code className="font-mono text-ink/70">tailwind.config.js</code>
          </p>
          <p className="text-ink/70">
            Example: <code className="text-ink">text-ink/70</code> uses the ink token at 70%
            opacity.
          </p>
        </li>
        <li className="p-4 space-y-1">
          <p className="font-medium text-ink">3. Use semantic classes in components</p>
          <p className="text-ink/70">
            Prefer meaning over hex:{' '}
            <code className="text-ink">bg-accent-soft text-accent-ink</code>.
          </p>
        </li>
        <li className="p-4 space-y-1">
          <p className="font-medium text-ink">4. Route colors come from a key</p>
          <p className="text-ink/70">
            A route has <code className="text-ink">color: &apos;blue&apos;</code> →{' '}
            <code className="text-ink">getRouteColor()</code> returns the matching classes.
          </p>
        </li>
        <li className="p-4 space-y-1">
          <p className="font-medium text-ink">5. Corner radius is tokenized too</p>
          <p className="text-ink/70">
            <code className="text-ink">rounded-md</code> for controls,{' '}
            <code className="text-ink">rounded-lg</code> for panels,{' '}
            <code className="text-ink">rounded-3xl</code> for cards and sheets,{' '}
            <code className="text-ink">rounded-full</code> for pills.
          </p>
        </li>
      </ol>
    </section>
  )
}

function RadiusSection({ revision = 0 }) {
  return (
    <section id="radius" className={`space-y-6 ${SECTION_SCROLL}`}>
      <div>
        <h2 className="text-lg font-medium text-ink">1b · Radius</h2>
        <p className="text-sm text-ink/70 mt-1">
          Corner sizes are CSS variables that map to Tailwind{' '}
          <code className="text-ink">rounded-*</code> classes.
        </p>
      </div>

      <div className="rounded-lg bg-surface p-4 border border-ink/10 space-y-3 text-sm text-ink/70">
        <p className="font-medium text-ink">When to use which</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <code className="text-ink">rounded-md</code> — buttons, map, small controls
          </li>
          <li>
            <code className="text-ink">rounded-lg</code> — panels, Alert, EmptyState
          </li>
          <li>
            <code className="text-ink">rounded-3xl</code> — DirectionCard, PromoCard, sheets
          </li>
          <li>
            <code className="text-ink">rounded-full</code> — Chip, RouteBadge
          </li>
          <li>
            <code className="text-ink">rounded-xl</code> / <code className="text-ink">rounded-2xl</code>{' '}
            — reserved, don’t use yet
          </li>
        </ul>
      </div>

      <div className="rounded-lg bg-surface p-4 border border-ink/10 space-y-4">
        <p className="text-sm font-medium text-ink">Scale</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {RADIUS_SCALE.map((r) => (
            <RadiusSwatch key={r.name} token={r} revision={revision} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-ink">Where it’s used</p>
          <p className="text-xs text-ink/50 mt-0.5">
            From <code className="text-ink">RADIUS_USAGE</code> in{' '}
            <code className="text-ink">tokens.js</code> — update that file when usage changes.
          </p>
        </div>
        <div className="rounded-lg bg-surface border border-ink/10 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-ink/70 border-b border-ink/10">
                <th className="py-2 px-4 font-medium">token</th>
                <th className="py-2 px-4 font-medium">classes</th>
                <th className="py-2 px-4 font-medium">status</th>
                <th className="py-2 px-4 font-medium">where</th>
              </tr>
            </thead>
            <tbody>
              {RADIUS_USAGE.map((row) => {
                const scale = RADIUS_SCALE.find((r) => r.name === row.name)
                return (
                  <tr key={row.name} className="border-b border-ink/5 align-top">
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-6 w-6 shrink-0 border border-ink/15 bg-accent-soft ${scale?.tw ?? ''}`}
                          aria-hidden
                        />
                        <div>
                          <p className="font-mono text-xs text-ink">{row.name}</p>
                          <p className="font-mono text-[11px] text-ink/50">
                            {scale?.rem} · {scale?.role}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-xs text-ink/70">
                      {row.tw.join(', ')}
                    </td>
                    <td className="py-2.5 px-4">
                      {row.used ? (
                        <span className="text-xs text-accent-ink">in use</span>
                      ) : (
                        <span className="text-xs text-ink/40">unused</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-ink/80">
                      <p className="text-xs text-ink/50 mb-1">{row.notes}</p>
                      {row.places.length > 0 ? (
                        <ul className="space-y-0.5 text-xs">
                          {row.places.map((p) => (
                            <li key={p}>· {p}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-ink/40">—</p>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function RadiusSwatch({ token, revision = 0 }) {
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(readCssVar(token.css))
  }, [token.css, revision])

  return (
    <div className="flex flex-col gap-2 min-w-0">
      <div
        className={`h-16 w-full border border-ink/15 bg-accent-soft ${token.tw}`}
        title={value || token.rem}
      />
      <div className="min-w-0 space-y-0.5">
        <p className="text-sm font-medium text-ink font-mono truncate">{token.tw}</p>
        <p className="text-xs font-mono text-ink/70 truncate">{token.css}</p>
        <p className="text-[11px] font-mono text-ink/50 truncate">
          {value || token.rem}
          {token.px ? ` (${token.px}px)` : ''} · {token.role}
        </p>
      </div>
    </div>
  )
}

function CssPaletteSection({ revision }) {
  return (
    <section id="palette" className={`space-y-4 ${SECTION_SCROLL}`}>
      <div>
        <h2 className="text-lg font-medium text-ink">1 · CSS palette</h2>
        <p className="text-sm text-ink/70 mt-1">
          Everything below comes from <code className="text-ink">:root</code>. We keep few color
          tokens and use opacity for softer text (
          <code className="text-ink">text-ink/70</code>, etc.).
        </p>
      </div>

      <div className="space-y-6 rounded-lg bg-surface p-4 border border-ink/10">
        {CSS_PALETTE.map((group) => (
          <div key={group.id} className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-ink">{group.label}</h3>
              {group.note && <p className="text-xs text-ink/50 mt-0.5">{group.note}</p>}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {group.vars.map((cssVar) => (
                <CssVarSwatch key={cssVar} cssVar={cssVar} revision={revision} />
              ))}
            </div>
            {group.examples && (
              <div className="flex flex-wrap gap-2 pt-1">
                {group.examples.map((ex) => (
                  <span
                    key={ex.tw}
                    className={`inline-flex items-center gap-1.5 rounded-md border border-ink/10 px-2 py-1 text-[11px] font-mono ${
                      ex.tw.startsWith('bg-') || ex.tw.startsWith('border-')
                        ? `bg-surface ${ex.tw} text-ink`
                        : `bg-surface ${ex.tw}`
                    }`}
                  >
                    {ex.tw.startsWith('bg-') && (
                      <span className={`h-3 w-3 rounded-sm border border-ink/10 ${ex.tw}`} />
                    )}
                    {ex.tw}
                  </span>
                ))}
              </div>
            )}
            {group.aliases && (
              <div className="space-y-1.5 pt-1">
                {group.aliases.map((a) => (
                  <p key={a.css} className="text-xs font-mono text-ink/60">
                    <code className="text-ink">{a.css}</code>
                    <span className="text-ink/40"> → </span>
                    <code className="text-ink">{a.pointsTo}</code>
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function LiveSyncDemo({ onChange }) {
  const [muted, setMuted] = useState('#f8fafd')
  const [accentSoft, setAccentSoft] = useState('#deedff')

  useEffect(() => {
    const nextMuted = readCssVar('--surface-muted')
    const nextAccent = readCssVar('--accent-soft')
    if (nextMuted) setMuted(nextMuted)
    if (nextAccent) setAccentSoft(nextAccent)
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--surface-muted', muted)
    onChange?.()
    return () => {
      document.documentElement.style.removeProperty('--surface-muted')
    }
  }, [muted, onChange])

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-soft', accentSoft)
    onChange?.()
    return () => {
      document.documentElement.style.removeProperty('--accent-soft')
    }
  }, [accentSoft, onChange])

  return (
    <section id="live" className={`space-y-4 ${SECTION_SCROLL}`}>
      <div>
        <h2 className="text-lg font-medium text-ink">Live sync</h2>
        <p className="text-sm text-ink/70 mt-1">
          Change a CSS variable — every class that uses it updates automatically.
        </p>
      </div>

      <div className="rounded-lg bg-surface p-4 space-y-4 border border-ink/10">
        <label className="flex flex-wrap items-center gap-3 text-sm text-ink">
          <span className="w-36 shrink-0 font-mono text-xs text-ink/70">--surface-muted</span>
          <input
            type="color"
            value={muted.startsWith('#') && muted.length === 7 ? muted : '#f8fafd'}
            onChange={(e) => setMuted(e.target.value)}
            className="h-9 w-12 cursor-pointer rounded border border-ink/10 bg-transparent"
          />
          <code className="text-xs text-ink/60">{muted}</code>
        </label>
        <label className="flex flex-wrap items-center gap-3 text-sm text-ink">
          <span className="w-36 shrink-0 font-mono text-xs text-ink/70">--accent-soft</span>
          <input
            type="color"
            value={accentSoft.startsWith('#') && accentSoft.length === 7 ? accentSoft : '#deedff'}
            onChange={(e) => setAccentSoft(e.target.value)}
            className="h-9 w-12 cursor-pointer rounded border border-ink/10 bg-transparent"
          />
          <code className="text-xs text-ink/60">{accentSoft}</code>
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-surface-muted p-4 border border-ink/10">
            <p className="text-xs text-ink/50 mb-2 font-mono">bg-surface-muted</p>
            <p className="text-ink">Page background</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center rounded-lg bg-surface-muted p-4 border border-ink/10">
            <Chip>chip</Chip>
            <Chip active>chip active</Chip>
            <span className="hover-darken px-4 py-1.5 rounded-full bg-alert text-alert-ink text-sm">
              alert token
            </span>
            <RouteBadge routeId="533">533</RouteBadge>
          </div>
        </div>
      </div>
    </section>
  )
}

function ComponentsGallery() {
  const [chip, setChip] = useState('a')

  return (
    <section id="components" className={`space-y-6 pb-8 ${SECTION_SCROLL}`}>
      <div>
        <h2 className="text-lg font-medium text-ink">4 · Components</h2>
        <p className="text-sm text-ink/70 mt-1">
          Live UI from <code className="text-ink">src/components/ui</code>. Promo blocks are the
          same modules used on Home and HomeScreen — not separate mocks.
        </p>
      </div>

      <GalleryBlock name="BackLink" hint="to | onClick">
        <BackLink to="/" />
      </GalleryBlock>

      <GalleryBlock name="Chip / ChipGroup" hint="active, variant=default|ghost, scroll">
        <ChipGroup>
          <Chip active={chip === 'a'} onClick={() => setChip('a')}>
            533
          </Chip>
          <Chip active={chip === 'b'} onClick={() => setChip('b')}>
            429
          </Chip>
          <Chip variant="ghost" active={chip === 'c'} onClick={() => setChip('c')}>
            ghost
          </Chip>
        </ChipGroup>
      </GalleryBlock>

      <GalleryBlock name="Alert" hint="variant=danger">
        <Alert>{copy.errors.schedulesLoad}</Alert>
      </GalleryBlock>

      <GalleryBlock name="EmptyState">
        <EmptyState>{copy.fromLadozhskaya.empty}</EmptyState>
      </GalleryBlock>

      <GalleryBlock name="PromoCard" hint="accent (Home) · muted (HomeScreen)">
        <div className="space-y-3">
          <AddToHomescreenPromo />
          <HomescreenPlatformCards className="grid grid-cols-1 gap-3 sm:grid-cols-2" />
        </div>
      </GalleryBlock>

      <GalleryBlock name="RouteBadge" hint="routeId">
        <div className="flex flex-wrap gap-2">
          {ROUTES.map((r) => (
            <RouteBadge key={r.id} routeId={r.id}>
              {r.name}
            </RouteBadge>
          ))}
        </div>
      </GalleryBlock>

      <GalleryBlock name="TextLink" hint="size=base|xs">
        <div className="flex flex-wrap items-center gap-4">
          <TextLink to="/full/533">{copy.nav.fullSchedule}</TextLink>
          <TextLink to="/about" size="xs">
            {copy.nav.about}
          </TextLink>
        </div>
      </GalleryBlock>

      <GalleryBlock name="DepartureRow" hint="routeId, labels">
        <div className="divide-y divide-ink/5 rounded-lg bg-surface-muted px-1">
          <DepartureRow
            routeId="533"
            routeName="533"
            destination={ROUTES[0].destination}
            untilLabel={`${copy.widget.inPrefix} ${copy.time.minutes(12)}`}
            timeLabel="14:30"
          />
          <DepartureRow
            routeId="430A"
            routeName="430А"
            destination={ROUTES[3].destination}
            untilLabel={`${copy.widget.inPrefix} ${copy.time.minutes(18)}`}
            timeLabel="14:36"
          />
          <DepartureRow
            routeId="429"
            routeName="429"
            destination={ROUTES[1].destination}
            untilLabel={`${copy.widget.inPrefix} ${copy.time.minutes(25)}`}
            timeLabel="14:43"
          />
        </div>
      </GalleryBlock>

      <GalleryBlock name="PageShell" hint="maxWidth, bg, fullHeight — layout chrome">
        <p className="text-sm text-ink/70">
          Shared layout for Home, About, Privacy, and HomeScreen. Not nested here to avoid a double
          shell.
        </p>
      </GalleryBlock>
    </section>
  )
}

function GalleryBlock({ name, hint, children }) {
  return (
    <div className="rounded-lg bg-surface p-4 border border-ink/10 space-y-3">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <p className="text-sm font-medium text-ink font-mono">{name}</p>
        {hint ? <p className="text-xs font-mono text-ink/50">{hint}</p> : null}
      </div>
      {children}
    </div>
  )
}

function TypeTokensSection() {
  return (
    <section id="type" className={`space-y-6 ${SECTION_SCROLL}`}>
      <div>
        <h2 className="text-lg font-medium text-ink">5 · Typography</h2>
        <p className="text-sm text-ink/70 mt-1">
          Google Sans (400 / 500) via Tailwind size and weight classes. Roles are listed in{' '}
          <code className="text-ink">TYPE_SCALE</code> and <code className="text-ink">TYPE_USAGE</code>.
          The privacy legal page is a separate case and is not covered here.
        </p>
      </div>

      <div className="rounded-lg bg-surface p-4 border border-ink/10 space-y-3 text-sm text-ink/70">
        <p className="font-medium text-ink">When to use which</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <code className="text-ink">caption</code> — footnotes, sources
          </li>
          <li>
            <code className="text-ink">body-sm</code> — secondary text;{' '}
            <code className="text-ink">body</code> — primary text and chips
          </li>
          <li>
            <code className="text-ink">label</code> — RouteBadge (only medium weight on compact UI)
          </li>
          <li>
            <code className="text-ink">title-sm</code> — sheets and modals;{' '}
            <code className="text-ink">title</code> — screens and cards
          </li>
          <li>
            <code className="text-ink">display</code> — hero headlines;{' '}
            <code className="text-ink">countdown</code> — 40px departure time in DirectionCard
          </li>
        </ul>
      </div>

      <div className="rounded-lg bg-surface border border-ink/10 overflow-hidden">
        <div className="px-4 py-3 border-b border-ink/10">
          <p className="text-sm font-medium text-ink">Scale</p>
          <p className="text-xs text-ink/50 mt-0.5">size = px / line-height</p>
        </div>
        <ul className="divide-y divide-ink/5">
          {TYPE_SCALE.map((t) => (
            <li key={t.name} className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-baseline sm:gap-6">
              <div className="sm:w-28 shrink-0">
                <p className="font-mono text-xs text-ink">{t.name}</p>
                <p className="font-mono text-[11px] text-ink/50">
                  {t.size} · {t.weight} · {t.role}
                </p>
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <p className={t.tw} style={t.style}>
                  {t.sample}
                </p>
                <p className="font-mono text-[11px] text-ink/40 break-all">
                  {t.recipe ?? t.tw}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg bg-surface p-4 border border-ink/10 space-y-3">
        <p className="text-sm font-medium text-ink">Ink on type</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {TYPE_INK.map((ink) => (
            <div key={ink.name} className="min-w-0">
              <p className={ink.tw}>Aa · {ink.opacity}</p>
              <p className="font-mono text-[11px] text-ink/50 mt-1">{ink.tw}</p>
              <p className="text-xs text-ink/50">{ink.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-ink">Where it’s used</p>
          <p className="text-xs text-ink/50 mt-0.5">
            From <code className="text-ink">TYPE_USAGE</code> in{' '}
            <code className="text-ink">tokens.js</code> — update that file when usage changes.
          </p>
        </div>
        <div className="rounded-lg bg-surface border border-ink/10 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-ink/70 border-b border-ink/10">
                <th className="py-2 px-4 font-medium">token</th>
                <th className="py-2 px-4 font-medium">classes</th>
                <th className="py-2 px-4 font-medium">status</th>
                <th className="py-2 px-4 font-medium">where</th>
              </tr>
            </thead>
            <tbody>
              {TYPE_USAGE.map((row) => {
                const scale = TYPE_SCALE.find((t) => t.name === row.name)
                return (
                  <tr key={row.name} className="border-b border-ink/5 align-top">
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <p className="font-mono text-xs text-ink">{row.name}</p>
                      {scale ? (
                        <p className="font-mono text-[11px] text-ink/50">
                          {scale.size} · {scale.role}
                        </p>
                      ) : (
                        <p className="font-mono text-[11px] text-ink/50">weight only</p>
                      )}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-xs text-ink/70">
                      {row.tw.join(', ')}
                    </td>
                    <td className="py-2.5 px-4">
                      {row.used ? (
                        <span className="text-xs text-accent-ink">in use</span>
                      ) : (
                        <span className="text-xs text-ink/40">unused</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-ink/80">
                      <p className="text-xs text-ink/50 mb-1">{row.notes}</p>
                      {row.places.length > 0 ? (
                        <ul className="space-y-0.5 text-xs">
                          {row.places.map((p) => (
                            <li key={p}>· {p}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-ink/40">—</p>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function DesignSystem() {
  const [revision, setRevision] = useState(0)
  const bump = useCallback(() => setRevision((n) => n + 1), [])

  return (
    <div className="min-h-[100dvh] bg-surface-muted py-6 px-4 sm:py-10">
      <DsSideNav />
      <div className="max-w-3xl mx-auto space-y-10">
        <header className="space-y-3">
          <BackLink to="/" />
          <h1 className="text-2xl font-normal text-ink">Design tokens</h1>
          <p className="text-sm text-ink/70 max-w-xl">
            One neutral surface range, one accent hue, and ink with opacity. No third-party
            palettes.
          </p>
        </header>

        <HowItWorks />
        <CssPaletteSection revision={revision} />
        <RadiusSection revision={revision} />
        <LiveSyncDemo onChange={bump} />

        <section id="tailwind" className={`space-y-2 ${SECTION_SCROLL}`}>
          <h2 className="text-lg font-medium text-ink">2 · Tailwind mapping</h2>
          <p className="text-sm text-ink/70">
            Edit hex values in <code className="text-ink">index.css</code>, not in this page.
          </p>
        </section>

        {TOKEN_GROUPS.map((group) => (
          <section key={group.id} className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-ink">{group.label}</h2>
              <p className="text-sm text-ink/70 mt-1">{group.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 rounded-lg bg-surface p-4 border border-ink/10">
              {group.tokens.map((token) => (
                <Swatch key={token.name} token={token} revision={revision} />
              ))}
            </div>
          </section>
        ))}

        <section id="routes" className={`space-y-4 ${SECTION_SCROLL}`}>
          <div>
            <h2 className="text-lg font-medium text-ink">3 · Route keys</h2>
            <p className="text-sm text-ink/70 mt-1">
              Each route picks a color key. <code className="text-ink">getRouteColor</code> turns
              that key into Tailwind classes.
            </p>
          </div>

          <div className="rounded-lg bg-surface p-4 border border-ink/10 space-y-4">
            <div className="flex flex-wrap gap-2">
              {Object.values(ROUTE_COLORS).map((c) => (
                <span
                  key={c.key}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium ${c.bg} ${c.ink}`}
                >
                  {c.key}
                </span>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-ink/70 border-b border-ink/10">
                    <th className="py-2 pr-3 font-medium">route</th>
                    <th className="py-2 pr-3 font-medium">key</th>
                    <th className="py-2 pr-3 font-medium">preview</th>
                    <th className="py-2 font-medium">classes</th>
                  </tr>
                </thead>
                <tbody>
                  {ROUTES.map((route) => (
                    <tr key={route.id} className="border-b border-ink/5">
                      <td className="py-2.5 pr-3 text-ink">{route.name}</td>
                      <td className="py-2.5 pr-3 font-mono text-xs text-ink/70">{route.color}</td>
                      <td className="py-2.5 pr-3">
                        <RouteBadge routeId={route.id}>{route.destination}</RouteBadge>
                      </td>
                      <td className="py-2.5 font-mono text-xs text-ink/50 whitespace-nowrap">
                        {getRouteColorClasses(route.color)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <ComponentsGallery />
        <TypeTokensSection />

        <section id="cheatsheet" className={`space-y-4 pb-8 ${SECTION_SCROLL}`}>
          <h2 className="text-lg font-medium text-ink">Cheatsheet</h2>
          <pre className="rounded-lg bg-surface p-4 border border-ink/10 text-xs text-ink/80 overflow-x-auto leading-relaxed">{`import { Chip, Alert, BackLink } from './ui'

text-xs text-ink/70          /* caption */
text-sm font-normal text-ink/70  /* body-sm */
text-base font-normal        /* body / Chip */
text-sm font-medium          /* label / RouteBadge */
text-lg font-normal          /* title-sm / sheet */
text-xl font-normal          /* title */
text-2xl font-normal         /* display */
fontSize: 40px; line-height: 1  /* countdown */

rounded-md   /* control */
rounded-lg   /* panel */
rounded-3xl  /* DirectionCard, PromoCard, sheet */
rounded-full /* pill */

bg-surface-muted text-ink
bg-accent-soft text-accent-ink
hover-darken
getRouteColor('533')`}</pre>
        </section>
      </div>
    </div>
  )
}

export default DesignSystem

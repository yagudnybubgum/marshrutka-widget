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
import {
  Alert,
  BackLink,
  Chip,
  ChipGroup,
  DepartureRow,
  EmptyState,
  PromoCard,
  RouteBadge,
  TextLink,
} from './ui'
import { ArrowRightIcon } from './icons'

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
      aria-label="Разделы"
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
          Значения только в <code className="text-ink">:root</code>. Ink — один channel-токен + opacity в классах.
        </p>
      </div>

      <ol className="rounded-lg bg-surface border border-ink/10 divide-y divide-ink/5 text-sm">
        <li className="p-4 space-y-1">
          <p className="font-medium text-ink">1. CSS vars — <code className="font-mono text-ink/70">src/index.css</code></p>
          <p className="text-ink/70">
            <code className="text-ink">--surface-*</code>, <code className="text-ink">--ink</code> (channels),{' '}
            <code className="text-ink">--accent-*</code>, feedback, routes.
          </p>
        </li>
        <li className="p-4 space-y-1">
          <p className="font-medium text-ink">2. Tailwind — <code className="font-mono text-ink/70">tailwind.config.js</code></p>
          <p className="text-ink/70">
            <code className="text-ink">ink: rgb(var(--ink) / &lt;alpha-value&gt;)</code> →{' '}
            <code className="text-ink">text-ink/70</code>, <code className="text-ink">bg-ink/40</code>.
          </p>
        </li>
        <li className="p-4 space-y-1">
          <p className="font-medium text-ink">3. Components</p>
          <p className="text-ink/70">
            Semantic classes only. Пример: <code className="text-ink">bg-accent-soft text-accent-ink</code>.
          </p>
        </li>
        <li className="p-4 space-y-1">
          <p className="font-medium text-ink">4. Route keys</p>
          <p className="text-ink/70">
            <code className="text-ink">color: &apos;blue&apos;</code> →{' '}
            <code className="text-ink">getRouteColor()</code> → TW classes.
          </p>
        </li>
        <li className="p-4 space-y-1">
          <p className="font-medium text-ink">5. Radius</p>
          <p className="text-ink/70">
            <code className="text-ink">--radius-*</code> →{' '}
            <code className="text-ink">rounded-lg</code> (card),{' '}
            <code className="text-ink">rounded-md</code> (control),{' '}
            <code className="text-ink">rounded-full</code> (pill).
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
          Значения в <code className="text-ink">:root</code> (
          <code className="text-ink">--radius-*</code>) → Tailwind{' '}
          <code className="text-ink">borderRadius</code> → классы{' '}
          <code className="text-ink">rounded-*</code>. Роли: md control, lg panel, 3xl card/sheet;
          xl/2xl — запас.
        </p>
      </div>

      <div className="rounded-lg bg-surface p-4 border border-ink/10 space-y-3 text-sm text-ink/70">
        <p className="font-medium text-ink">Как выбирать</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <code className="text-ink">rounded-md</code> — контролы, карта, мелкие кнопки
          </li>
          <li>
            <code className="text-ink">rounded-lg</code> — панели / Alert / EmptyState
          </li>
          <li>
            <code className="text-ink">rounded-3xl</code> — DirectionCard, PromoCard, sheet
          </li>
          <li>
            <code className="text-ink">rounded-full</code> — Chip, RouteBadge
          </li>
          <li>
            <code className="text-ink">rounded-xl</code> / <code className="text-ink">rounded-2xl</code> — reserved, пока не юзать
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
          <p className="text-sm font-medium text-ink">Usage in project</p>
          <p className="text-xs text-ink/50 mt-0.5">
            Карта из <code className="text-ink">RADIUS_USAGE</code> в{' '}
            <code className="text-ink">tokens.js</code> — обновляй при миграциях.
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
          Всё из <code className="text-ink">:root</code>. Меньше токенов — прозрачность через{' '}
          <code className="text-ink">/70</code> и т.п.
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
          Меняешь CSS var → utility-классы обновляются сами.
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
            <p className="text-ink">Страница / body фон</p>
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
          Те же модули, что на экранах — <code className="text-ink">src/components/ui</code>.
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

      <GalleryBlock name="PromoCard" hint="variant=accent|surface">
        <div className="grid gap-3 sm:grid-cols-2">
          <PromoCard
            to="/homescreen"
            title={copy.home.promoTitle}
            subtitle={copy.home.promoSubtitle}
            trailing={<ArrowRightIcon className="ml-2 h-5 w-5 flex-shrink-0 text-accent-ink/70" />}
          />
          <PromoCard variant="surface" href="#" title={copy.homescreen.iphone} />
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
          Используется на Home, About, Privacy, HomeScreen. Здесь не вложен во избежание двойного shell.
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
          Google Sans (400/500) + TW <code className="text-ink">text-*</code> /{' '}
          <code className="text-ink">font-*</code>. Роли в{' '}
          <code className="text-ink">TYPE_SCALE</code> / <code className="text-ink">TYPE_USAGE</code>.
          Privacy legal-страница — отдельный кейс, сюда не входит.
        </p>
      </div>

      <div className="rounded-lg bg-surface p-4 border border-ink/10 space-y-3 text-sm text-ink/70">
        <p className="font-medium text-ink">Как выбирать</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <code className="text-ink">caption</code> — сноски, source
          </li>
          <li>
            <code className="text-ink">body-sm</code> — secondary UI;{' '}
            <code className="text-ink">body</code> — primary / чипы
          </li>
          <li>
            <code className="text-ink">label</code> — RouteBadge (единственный medium на compact)
          </li>
          <li>
            <code className="text-ink">title-sm</code> — sheet/modal;{' '}
            <code className="text-ink">title</code> — экраны и карточки
          </li>
          <li>
            <code className="text-ink">display</code> — hero;{' '}
            <code className="text-ink">countdown</code> — 40/40 (lh:1) в DirectionCard
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
              <p className={ink.tw}>Аа · {ink.opacity}</p>
              <p className="font-mono text-[11px] text-ink/50 mt-1">{ink.tw}</p>
              <p className="text-xs text-ink/50">{ink.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-ink">Usage in project</p>
          <p className="text-xs text-ink/50 mt-0.5">
            Карта из <code className="text-ink">TYPE_USAGE</code> в{' '}
            <code className="text-ink">tokens.js</code> — обновляй при миграциях.
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
            Один нейтральный ряд, один акцентный hue, ink × opacity. Без сторонних палитр.
          </p>
        </header>

        <HowItWorks />
        <CssPaletteSection revision={revision} />
        <RadiusSection revision={revision} />
        <LiveSyncDemo onChange={bump} />

        <section id="tailwind" className={`space-y-2 ${SECTION_SCROLL}`}>
          <h2 className="text-lg font-medium text-ink">2 · Tailwind mapping</h2>
          <p className="text-sm text-ink/70">
            Hex/channels правятся в <code className="text-ink">index.css</code>, не здесь.
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
              Key → classes через <code className="text-ink">getRouteColor</code>.
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

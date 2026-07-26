# UI primitives refactor + `/ds` sync

Date: 2026-07-26  
Status: approved design

## Goal

Extract repeated UI markup into shared primitives under `src/components/ui/`, migrate all consumers, and render live previews of those same primitives on `/ds` so the design system page stays the source of truth for both tokens and components.

## Non-goals

- No visual redesign / copy changes
- No extraction of `DirectionCard`, schedule skeletons, or FullSchedule time grid
- No changes to CSS variables, Tailwind mapping, or route color tokens (already done)
- No new dependencies

## File structure

```
src/components/ui/
  BackLink.jsx
  Chip.jsx              # Chip + ChipGroup
  Alert.jsx
  EmptyState.jsx
  PageShell.jsx
  PromoCard.jsx
  RouteBadge.jsx
  TextLink.jsx
  DepartureRow.jsx
  index.js              # barrel re-exports
```

Consumers import from `../components/ui` (or `./ui` from sibling paths). Prefer named exports.

## Component APIs

### `BackLink`

Replaces duplicated `ChevronLeft + "назад"` links/buttons.

```jsx
<BackLink to="/" />
<BackLink onClick={onBack} />
<BackLink to="/">custom label</BackLink>
```

- Renders `Link` when `to` is set, otherwise `button`
- Default children: `назад`
- Classes: `text-ink hover:text-ink/70 transition-colors inline-flex items-center gap-1 text-sm font-normal` (+ optional `className`)

### `Chip` / `ChipGroup`

```jsx
<Chip active={bool} onClick={fn} style={?} className={?}>533</Chip>
<ChipGroup scroll>{/* chips */}</ChipGroup>
```

- Active: `bg-accent-soft text-accent-ink`
- Idle: `bg-surface-sunken text-ink/70 hover:text-ink` (Home / RouteMap)  
  FullSchedule weekday/weekend chips omit sunken bg when idle — support `variant?: 'default' | 'ghost'` where `ghost` = idle without `bg-surface-sunken`
- Shared chrome: `flex-shrink-0 px-5 py-2 text-base font-normal rounded-full transition-colors`
- `ChipGroup` with `scroll`: `-mx-4 overflow-x-auto scrollbar-hide` + inner `flex w-max flex-nowrap gap-2 px-4 pb-1`
- Without `scroll`: `flex flex-wrap gap-2` (RouteMap) or `flex gap-2` with children stretching (`flex-1` via className on Chip for FullSchedule)

### `Alert`

```jsx
<Alert>Не удалось загрузить…</Alert>
```

- `variant` reserved, default `danger`: `rounded-xl bg-danger px-4 py-3 text-danger-ink` + `role="alert"`

### `EmptyState`

```jsx
<EmptyState>Нет данных о расписании</EmptyState>
```

- `rounded-xl bg-surface-sunken px-4 py-3 text-ink/70`

### `PageShell`

Shared page chrome for list/content screens.

```jsx
<PageShell maxWidth="5xl" footer={<Footer />}>
  …
</PageShell>
```

| Prop | Default | Maps to |
|------|---------|---------|
| `maxWidth` | `'5xl'` | `max-w-3xl` / `4xl` / `5xl` / `7xl` |
| `bg` | `'muted'` | `bg-surface-muted` or `bg-surface` (`bg="surface"`) |
| `pad` | default | `pt-5/6 pb-8 px-4 sm:py-10` — allow `className` override on outer |
| `footer` | — | rendered after content, still inside max-width column when possible |
| `fullHeight` | `'min'` | `min-h-[100dvh]` vs `h-[100dvh]` for overflow-locked pages (HomeScreen) |

HomeScreen uses `h-[100dvh] overflow-hidden flex flex-col`; About uses `bg-surface`. Shell must cover both without forcing one layout.

### `PromoCard`

Home CTA + HomeScreen platform cards.

```jsx
<PromoCard
  to="/homescreen"
  title="Расписание всегда под рукой"
  subtitle="Добавьте его на главный экран"
  trailing={<ArrowRightIcon … />}
/>
<PromoCard href="…" external title="У меня iPhone" />
```

- Base: `block rounded-xl …` with accent-soft variant (Home) vs surface + hover border (HomeScreen)
- `variant?: 'accent' | 'surface'` — accent = Home CTA (`hover-darken bg-accent-soft text-accent-ink p-4`); surface = HomeScreen cards (`bg-surface border border-transparent hover:border-stroke p-6`)

### `RouteBadge`

```jsx
<RouteBadge routeId="533">533</RouteBadge>
```

- Classes: `px-5 py-2 rounded-full text-sm font-medium` + `getRouteColor(routeId)`
- Optional `color` key override if needed; prefer `routeId`

### `TextLink`

```jsx
<TextLink to={`/full/${id}`}>Полное расписание</TextLink>
<TextLink to="/about" size="xs">О проекте</TextLink>
```

- `size`: `base` → `text-base … text-ink/70 hover:text-ink`; `xs` → `text-xs …` (Footer)
- `to` → Router `Link`; `href` → `<a>` (+ `external` for target/rel)

### `DepartureRow`

```jsx
<DepartureRow
  routeId={dep.routeId}
  routeName={dep.routeName}
  destination={dep.destination}
  untilLabel={formatTimeUntil(dep.minutesUntil)}
  timeLabel={formatTime(dep.time)}
/>
```

- Layout matches FromLadozhskaya row: left `RouteBadge` + destination with ArrowRightIcon; right until + time
- Divider ownership stays on parent (`divide-y`)

## `/ds` sync

Add section **«4 · Components»** after Route keys on `DesignSystem.jsx`.

For each primitive:
1. Live interactive preview using the real component import
2. Label: component name + short prop hint (mono)
3. Show meaningful states where they exist (Chip idle/active/ghost; Alert; EmptyState; both PromoCard variants; DepartureRow with sample route)

Also:
- Replace header back control with `<BackLink to="/" />`
- Update Live sync demo chips/alert spans to use real `Chip` / `Alert` / `RouteBadge` so token tweaks reflect through components

Cheatsheet can append component import examples (optional, keep short).

## Consumer migration

| File | Replacements |
|------|----------------|
| `Home.jsx` | PageShell, ChipGroup+Chip, TextLink, PromoCard |
| `HomeScreen.jsx` | PageShell, BackLink, PromoCard |
| `About.jsx` / `PrivacyPolicy.jsx` | PageShell, BackLink, TextLink (if footer stays separate — Footer may use TextLink internally) |
| `Footer.jsx` | TextLink |
| `FullSchedule.jsx` | BackLink, Chip (ghost), Alert, EmptyState |
| `RouteMapPage.jsx` | BackLink, ChipGroup+Chip, PageShell-ish header |
| `MarshrutkaWidget.jsx` | Alert, EmptyState |
| `FromLadozhskaya.jsx` | Alert, EmptyState, DepartureRow, TextLink-style «Показать ещё» optional (button — leave as button or Chip ghost) |
| `DesignSystem.jsx` | BackLink + Components gallery + Live sync uses ui |

«Показать ещё» stays a plain button unless it fits `TextLink`/`Chip` cleanly — prefer not forcing it.

## Acceptance

- No duplicated BackLink / Chip / Alert / EmptyState class strings across screens
- `/ds` Components section imports from `ui/` (same modules as production)
- Visual parity: screens look and behave the same
- Build passes

## Out of scope follow-ups

- DirectionCard extraction
- Skeleton primitives
- Figma / Storybook

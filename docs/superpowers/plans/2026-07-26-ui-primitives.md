# UI Primitives Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract high+medium UI primitives into `src/components/ui/`, migrate all screens, and sync live previews on `/ds`.

**Architecture:** Named exports under `src/components/ui/` with a barrel `index.js`. Screens import the same modules that `/ds` previews. Visual parity only — no redesign.

**Tech Stack:** React 18, react-router-dom 7, Tailwind 3, Vite, Vitest (schedule tests only — no RTL).

## Global Constraints

- No visual redesign or copy changes
- No DirectionCard / skeleton / FullSchedule grid extraction
- No CSS var / token changes
- No new dependencies
- Named exports from `src/components/ui`

## File map

| Path | Role |
|------|------|
| `src/components/ui/*.jsx` | Primitives |
| `src/components/ui/index.js` | Barrel |
| Screens listed in spec | Consumers |
| `src/components/DesignSystem.jsx` | Gallery + BackLink + Live sync |

---

### Task 1: Create UI primitives + barrel

**Files:**
- Create: `src/components/ui/BackLink.jsx`
- Create: `src/components/ui/Chip.jsx`
- Create: `src/components/ui/Alert.jsx`
- Create: `src/components/ui/EmptyState.jsx`
- Create: `src/components/ui/PageShell.jsx`
- Create: `src/components/ui/PromoCard.jsx`
- Create: `src/components/ui/RouteBadge.jsx`
- Create: `src/components/ui/TextLink.jsx`
- Create: `src/components/ui/DepartureRow.jsx`
- Create: `src/components/ui/index.js`

**Interfaces:**
- Produces: APIs exactly as in `docs/superpowers/specs/2026-07-26-ui-primitives-design.md`

- [ ] **Step 1: Implement all primitives per spec APIs**

`BackLink` — Link or button + ChevronLeftIcon, default «назад».  
`Chip` / `ChipGroup` — active/idle + variant `default|ghost`, scroll group.  
`Alert` — danger box + role=alert.  
`EmptyState` — sunken box.  
`PageShell` — maxWidth/bg/fullHeight/footer/className.  
`PromoCard` — variant accent|surface, to|href.  
`RouteBadge` — getRouteColor(routeId).  
`TextLink` — size base|xs, to|href.  
`DepartureRow` — RouteBadge + ArrowRight destination + times.

- [ ] **Step 2: Barrel export all named components**

- [ ] **Step 3: Commit**

```bash
git add src/components/ui
git commit -m "Add shared UI primitives under components/ui."
```

---

### Task 2: Migrate screens to primitives

**Files:**
- Modify: `src/components/Home.jsx`
- Modify: `src/components/HomeScreen.jsx`
- Modify: `src/components/About.jsx`
- Modify: `src/components/PrivacyPolicy.jsx`
- Modify: `src/components/Footer.jsx`
- Modify: `src/components/FullSchedule.jsx`
- Modify: `src/components/RouteMapPage.jsx`
- Modify: `src/components/MarshrutkaWidget.jsx`
- Modify: `src/components/FromLadozhskaya.jsx`

- [ ] **Step 1: Replace duplicated markup with ui imports (visual parity)**

- [ ] **Step 2: Commit**

```bash
git add src/components/*.jsx
git commit -m "Migrate screens to shared UI primitives."
```

---

### Task 3: Sync `/ds` Components gallery

**Files:**
- Modify: `src/components/DesignSystem.jsx`

- [ ] **Step 1: BackLink in header; Live sync uses Chip/Alert/RouteBadge; add «4 · Components» gallery**

- [ ] **Step 2: `npm run build` + `npm test` pass**

- [ ] **Step 3: Commit**

```bash
git add src/components/DesignSystem.jsx
git commit -m "Sync /ds page with live UI component gallery."
```

---

## Spec coverage

- All high+medium components → Task 1
- Consumer migration table → Task 2
- `/ds` sync bullets → Task 3
- Acceptance (no dup strings, same modules, build) → Task 3 step 2

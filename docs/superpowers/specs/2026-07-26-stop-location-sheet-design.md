# Stop location sheet — iOS-like snap points

Date: 2026-07-26  
Status: approved design

## Goal

Give the mobile «Остановка на Ладожской» bottom sheet native-like behavior: open at the current medium height by default, and allow dragging to a taller large snap (and back / dismiss), matching iOS sheet detents.

Desktop modal behavior stays unchanged.

## Non-goals

- No new content in the sheet (no address, no “Open in Yandex Maps”, no CTAs)
- No peek/compact third detent
- No desktop snap/drag sheet
- No visual redesign beyond what’s needed for flex height + vaul chrome
- No remembering last snap across opens

## Decisions

| Topic | Choice |
| --- | --- |
| Snap count | Two: medium + large |
| Gestures | Full iOS-like: drag between snaps; drag below medium → dismiss; backdrop tap → dismiss; Escape → dismiss |
| Expanded content | Same UI — map simply grows |
| Library | `vaul` |
| Desktop | Keep current centered portal modal |

## Behavior (mobile)

1. Open → animate in at **medium** (`0.55` of viewport height).
2. Snap points: `[0.55, 0.92]` (large leaves room for home indicator / safe area).
3. Drag sheet upward → snap to large; downward → medium; further down with enough distance/velocity → close.
4. Backdrop tap closes. Escape closes.
5. Re-open always resets to medium (`0.55`), even if previous session ended on large.
6. Content: drag handle + title + map filling remaining sheet height (`flex-1 min-h-0`).

## Behavior (desktop, `md+`)

Unchanged: centered modal, fixed map height (`md:h-[360px]`), close via X / backdrop / Escape. No `vaul`, no snap points.

## Architecture

### Dependency

Add `vaul`.

### `StopLocationOverlay.jsx`

Public API unchanged for callers:

```jsx
<StopLocationOverlay
  open={mapOpen}
  onClose={() => setMapOpen(false)}
  stop={stop}
  title={copy.widget.stopLadozhskayaTitle}
/>
```

Internal split:

- **Mobile:** `Drawer` from `vaul` — controlled `open` / `onOpenChange` (map `onOpenChange(false)` → `onClose`).  
  - `snapPoints={[0.55, 0.92]}`  
  - controlled `activeSnapPoint` / `setActiveSnapPoint`, reset to `0.55` whenever `open` becomes true  
  - `Drawer.Content`: handle, title, `StopLocationMap`  
  - Prefer drag on whole sheet (`handleOnly={false}`); if Yandex map pan steals gestures, fall back to `handleOnly`  
  - Remove custom mobile `stop-sheet-enter` animation (vaul owns enter/exit)  
  - Do not double-apply `document.body.is-scroll-locked` on mobile (vaul handles scroll lock)

- **Desktop:** existing portal + backdrop + modal panel + `stop-modal-enter-md`. Keep Escape + body scroll lock for this branch only.

Breakpoint strategy: render mobile drawer below `md`, desktop modal at `md+` (matchMedia / CSS-hidden dual tree — pick one implementation in the plan; prefer a single tree with media query hook to avoid double-mounting the map).

### `StopLocationMap.jsx`

- Mobile sheet: height via parent flex (`className` with `flex-1 min-h-0` / `h-full`), not fixed `h-[55vh]`.
- Existing `ResizeObserver` + `fitToViewport` stays — required when snap height changes.
- No API change required beyond `className`.

### Styles / tokens

- Keep sheet chrome: `rounded-t-3xl bg-surface shadow-xl`, handle `h-1 w-10 rounded-full bg-ink/20`.
- Update `src/config/tokens.js` notes for StopLocationOverlay (snap sheet on mobile).
- Safe-area: respect bottom inset on drawer content if needed (`env(safe-area-inset-bottom)`).
- `prefers-reduced-motion`: leave desktop modal reduced-motion rules; rely on vaul defaults on mobile.

## Edge cases

- Map gesture conflict with sheet drag → switch to `handleOnly` if needed during implementation.
- Overlay fade: default vaul `fadeFromIndex` (last snap) is fine unless backdrop looks wrong at medium — then set `fadeFromIndex={0}` or `1` explicitly.
- Map must not remount on snap change (only container resize).

## Testing / smoke

1. Mobile: open notice → sheet at ~55%; map visible and interactive.
2. Drag up → ~92%; map grows (no black bars / wrong center).
3. Drag down → medium → dismiss.
4. Backdrop dismiss; Escape dismiss.
5. Re-open after large → starts at medium.
6. Desktop: modal centered, no snap, X works.
7. Reduced motion: no broken layout.

## Out of scope follow-ups

- Shared reusable `Sheet` primitive for other screens
- Deep-linking / share sheet height
- Nested drawers

# Stop Location Sheet Snap Points Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mobile stop-location overlay opens at medium height and can be dragged to a larger snap (and dismissed) via `vaul`, matching iOS sheet detents; desktop modal stays as-is.

**Architecture:** Add `vaul` for the mobile drawer with controlled snap points `[0.55, 0.92]`. Split rendering with a `useMediaQuery('(min-width: 768px)')` hook so only one tree mounts (no double map). Desktop keeps the existing portal modal. Map height becomes flex-filled on mobile; existing `ResizeObserver` handles snap resizes.

**Tech Stack:** React 18, Vite, Tailwind 3 (`md` = 768px), `vaul`, Vitest (no React Testing Library — manual smoke for UI).

## Global Constraints

- Public API of `StopLocationOverlay` unchanged: `{ open, onClose, stop, title }`
- Two snaps only: `0.55` (default open) and `0.92`
- Full gestures: drag between snaps; below medium → dismiss; backdrop + Escape dismiss
- No new sheet content / CTAs
- No desktop snap/drag
- Re-open always resets to `0.55`
- Prefer single map instance (media-query branch, not CSS dual-mount)
- Start with `handleOnly={false}`; switch to `handleOnly` only if map pan steals sheet drag
- Spec: `docs/superpowers/specs/2026-07-26-stop-location-sheet-design.md`

## File map

| Path | Role |
|------|------|
| `package.json` / lockfile | Add `vaul` |
| `src/hooks/useMediaQuery.js` | `md` breakpoint match |
| `src/components/StopLocationOverlay.jsx` | Mobile Drawer + desktop modal |
| `src/components/StopLocationMap.jsx` | Unchanged logic; new `className` from parent |
| `src/config/tokens.js` | Note snap sheet |
| `src/index.css` | Drop unused `stop-sheet-enter` if nothing else uses it |

---

### Task 1: Add `vaul` + `useMediaQuery`

**Files:**
- Modify: `package.json` (via npm)
- Create: `src/hooks/useMediaQuery.js`
- Test: `src/hooks/useMediaQuery.test.js`

**Interfaces:**
- Produces: `useMediaQuery(query: string) => boolean`
- Consumes: `window.matchMedia`

- [ ] **Step 1: Install vaul**

```bash
npm install vaul
```

Expected: `vaul` listed under `dependencies` in `package.json`.

- [ ] **Step 2: Write the failing hook test**

Create `src/hooks/useMediaQuery.test.js`:

```js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMediaQuery } from './useMediaQuery'

describe('useMediaQuery', () => {
  let listeners

  beforeEach(() => {
    listeners = new Set()
    vi.stubGlobal('matchMedia', (query) => ({
      matches: query.includes('768') ? false : false,
      media: query,
      addEventListener: (_event, cb) => listeners.add(cb),
      removeEventListener: (_event, cb) => listeners.delete(cb),
    }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns initial matchMedia.matches and updates on change', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(false)

    act(() => {
      // simulate viewport crossing md
      listeners.forEach((cb) => cb({ matches: true, media: '(min-width: 768px)' }))
    })
    // Hook must re-read mql.matches inside listener — see implementation
  })
})
```

**Important:** This project may not have `@testing-library/react`. Prefer a zero-RTL unit test of the matchMedia wiring by extracting pure init, **or** skip the RTL test and instead verify the hook manually in Step 4 / Task 3 smoke.

**Preferred (no new dep):** skip RTL. Create only the hook file; verify with `npm test` that existing suite still passes, and rely on Task 3 smoke for breakpoint behavior.

- [ ] **Step 3: Implement `src/hooks/useMediaQuery.js`**

```js
import { useEffect, useState } from 'react'

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}
```

- [ ] **Step 4: Confirm existing tests still pass**

```bash
npm test
```

Expected: PASS (schedule tests unchanged). Do **not** add `@testing-library/react` unless already present.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/hooks/useMediaQuery.js
git commit -m "$(cat <<'EOF'
Add vaul and a matchMedia hook for sheet breakpoints.

EOF
)"
```

---

### Task 2: Rewrite `StopLocationOverlay` (mobile vaul + desktop modal)

**Files:**
- Modify: `src/components/StopLocationOverlay.jsx` (full replace of implementation)
- Touch only via className: `src/components/StopLocationMap.jsx` (no logic change required)

**Interfaces:**
- Consumes: `useMediaQuery` from `../hooks/useMediaQuery`; `Drawer` from `vaul`; existing `StopLocationMap`, `copy`, `XMarkIcon`
- Produces: same export default component props `{ open, onClose, stop, title }`

- [ ] **Step 1: Replace `StopLocationOverlay.jsx` with the following**

```jsx
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Drawer } from 'vaul'
import StopLocationMap from './StopLocationMap'
import { XMarkIcon } from './icons'
import { copy } from '../config/copy'
import { useMediaQuery } from '../hooks/useMediaQuery'

const SNAP_MEDIUM = 0.55
const SNAP_LARGE = 0.92
const SNAP_POINTS = [SNAP_MEDIUM, SNAP_LARGE]

const StopLocationOverlay = ({ open, onClose, stop, title }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [snap, setSnap] = useState(SNAP_MEDIUM)

  useEffect(() => {
    if (open) setSnap(SNAP_MEDIUM)
  }, [open])

  useEffect(() => {
    if (!open || !isDesktop) return undefined

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.body.classList.add('is-scroll-locked')
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.classList.remove('is-scroll-locked')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose, isDesktop])

  if (!open || !stop) return null

  const heading = title ?? stop.name

  if (isDesktop) {
    return createPortal(
      <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={heading}>
        <button
          type="button"
          className="absolute inset-0 bg-ink/40"
          aria-label={copy.a11y.close}
          onClick={onClose}
        />
        <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
          <div className="pointer-events-auto w-full max-w-lg overflow-hidden rounded-3xl bg-surface shadow-xl stop-modal-enter-md">
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <h2 className="text-lg font-medium text-ink">{heading}</h2>
              <button
                type="button"
                onClick={onClose}
                className="hover-darken inline-flex shrink-0 rounded-md p-1.5 text-ink/70"
                aria-label={copy.a11y.close}
              >
                <XMarkIcon />
              </button>
            </div>
            <StopLocationMap
              lat={stop.lat}
              lng={stop.lng}
              name={stop.name}
              className="h-[360px] w-full"
            />
          </div>
        </div>
      </div>,
      document.body,
    )
  }

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose()
      }}
      snapPoints={SNAP_POINTS}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      dismissible
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <Drawer.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 bottom-0 z-50 flex h-full max-h-[97%] flex-col rounded-t-3xl bg-surface outline-none"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex shrink-0 flex-col items-center pt-3 pb-2">
            <div className="h-1 w-10 rounded-full bg-ink/20" aria-hidden />
          </div>
          <Drawer.Title className="shrink-0 px-4 pb-3 text-lg font-medium text-ink">
            {heading}
          </Drawer.Title>
          <StopLocationMap
            lat={stop.lat}
            lng={stop.lng}
            name={stop.name}
            className="min-h-0 w-full flex-1"
          />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default StopLocationOverlay
```

Notes for implementer:
- Do **not** add `document.body.is-scroll-locked` on the mobile branch — vaul owns it.
- Do **not** use `stop-sheet-enter` on mobile — vaul animates.
- If dragging the sheet fails because the Yandex map captures pointers, set `handleOnly` on `Drawer.Root` and wrap the handle+title block as the drag region per vaul docs (`Drawer.Handle` if available in installed version, else keep handle markup and `handleOnly`).
- If backdrop looks too faint at medium, set `fadeFromIndex={0}` on `Drawer.Root`.

- [ ] **Step 2: Lint the touched file**

```bash
npx eslint src/components/StopLocationOverlay.jsx src/hooks/useMediaQuery.js
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/StopLocationOverlay.jsx
git commit -m "$(cat <<'EOF'
Use vaul snap points for the mobile stop location sheet.

EOF
)"
```

---

### Task 3: Tokens + CSS cleanup + smoke

**Files:**
- Modify: `src/config/tokens.js` (StopLocationOverlay notes)
- Modify: `src/index.css` (remove unused sheet-enter if unused)

**Interfaces:**
- Consumes: none new
- Produces: accurate token docs; no dead CSS for mobile sheet enter

- [ ] **Step 1: Update tokens note**

In `src/config/tokens.js`, change the StopLocationOverlay place string under `3xl` from:

```js
'StopLocationOverlay — bottom sheet (rounded-t-3xl) + desktop modal (md:rounded-3xl)',
```

to:

```js
'StopLocationOverlay — mobile vaul sheet (rounded-t-3xl, snaps 0.55/0.92) + desktop modal (rounded-3xl)',
```

Also update the drag-handle place under `full` if it still says only «drag handle» — leave as-is (still accurate).

- [ ] **Step 2: Remove unused `stop-sheet-enter` CSS**

In `src/index.css`, delete `@keyframes stop-sheet-enter`, `.stop-sheet-enter`, and the `.stop-sheet-enter` entry inside the `prefers-reduced-motion` block — only if no remaining references:

```bash
rg "stop-sheet-enter" src
```

Expected after cleanup: no matches (or only comments). Keep `stop-modal-enter` / `.stop-modal-enter-md`.

- [ ] **Step 3: Manual smoke (mobile + desktop)**

```bash
npm run dev
```

Checklist (from spec):

1. Mobile (DevTools iPhone width): open «Остановка на Ладожской» → ~55% height, map visible.
2. Drag up → ~92%; map grows; placemark stays centered (ResizeObserver).
3. Drag down → medium → dismiss.
4. Backdrop dismiss; Escape dismiss (desktop required; mobile if vaul forwards it).
5. After closing from large, re-open → medium again.
6. Desktop ≥768px: centered modal, X + backdrop, map `360px`, no snap.
7. Optional: `prefers-reduced-motion` — layout still intact.

- [ ] **Step 4: Commit**

```bash
git add src/config/tokens.js src/index.css
git commit -m "$(cat <<'EOF'
Document snap sheet tokens and drop unused sheet-enter CSS.

EOF
)"
```

---

## Spec coverage (self-review)

| Spec requirement | Task |
| --- | --- |
| `vaul` dependency | Task 1 |
| Snaps `0.55` / `0.92`, default medium on open | Task 2 |
| Full drag + backdrop dismiss | Task 2 |
| Map grows only, no new CTAs | Task 2 |
| Desktop modal unchanged | Task 2 |
| Single tree via matchMedia | Task 1 + 2 |
| No double scroll-lock on mobile | Task 2 |
| Safe-area padding | Task 2 |
| Tokens note | Task 3 |
| Remove mobile enter CSS if unused | Task 3 |
| Smoke checklist | Task 3 |
| `handleOnly` fallback | Task 2 notes |
| Re-open resets snap | Task 2 `useEffect` on `open` |

# Home Anatomy Animation — Design

## Goal
Looped portfolio piece: interface anatomy of the marshrutka home screen.
Dummy route `/anatomy`, not part of product UX.

## Approach
- Hybrid: phone frame + anatomy overlays → static HomeMock reveal
- GSAP Timeline (loop + holds)
- Labels outside phone like reference (`1:1`, `390PX`, `home anatomy design`)

## Files
- `src/components/AnatomyPage.jsx` — canvas + GSAP
- `src/components/anatomy/AnatomyHomeMock.jsx` — frozen home UI
- `src/App.jsx` — route `/anatomy`
- dep: `gsap`

## Timeline (~8s)
1. Guides draw-in
2. Hatched offset squares
3. Skeleton blocks (header → chips → cards → links → promo)
4. Tech labels
5. HomeMock crossfade; guides dim
6. Hold
7. Dissolve → restart

## Visual
White canvas · lavender guides `#D1A7E2` · mono labels · UI tokens from project

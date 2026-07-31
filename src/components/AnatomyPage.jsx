import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import AnatomyHomeMock, { AnatomyStopSheet } from './anatomy/AnatomyHomeMock'

const GUIDE = '#D1A7E2'
const PHONE_W = 390
/** Initial tall enough to measure; fitted to mock after fonts. */
const PHONE_H_INIT = 900
const ART_PAD = 40
const PAD = 16
const INSET = 8
const ART_W = PHONE_W + ART_PAD * 2

const BLOCKS = ['header', 'title', 'date', 'chips', 'card1', 'card2', 'links', 'promo']
const GUIDE_BLOCKS = ['card1', 'card2', 'links', 'promo']

function yInArtboard(el, artboard) {
  const a = artboard.getBoundingClientRect()
  const r = el.getBoundingClientRect()
  const scale = a.height / artboard.offsetHeight
  return {
    top: (r.top - a.top) / scale,
    bottom: (r.bottom - a.top) / scale,
    left: (r.left - a.left) / scale,
    right: (r.right - a.left) / scale,
    height: r.height / scale,
    width: r.width / scale,
  }
}

function uniqueSorted(values, eps = 0.5) {
  const out = []
  for (const v of [...values].sort((a, b) => a - b)) {
    if (out.length === 0 || Math.abs(out[out.length - 1] - v) > eps) out.push(v)
  }
  return out
}

export default function AnatomyPage() {
  const rootRef = useRef(null)
  const artboardRef = useRef(null)
  const svgRef = useRef(null)
  const skeletonRef = useRef(null)
  const phoneRef = useRef(null)
  const tlRef = useRef(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const artboard = artboardRef.current
    const svg = svgRef.current
    const skeleton = skeletonRef.current
    const phone = phoneRef.current
    if (!root || !artboard || !svg || !skeleton || !phone) return

    let cancelled = false
    let tl = null

    const setup = () => {
      if (cancelled) return

      const mockInner = root.querySelector('[data-mock] > *')
      const fittedH = Math.ceil(mockInner?.offsetHeight || PHONE_H_INIT)
      const artH = fittedH + ART_PAD * 2

      phone.style.height = `${fittedH}px`
      artboard.style.height = `${artH}px`
      artboard.style.transform = `scale(min(1, (100vw - 48px) / ${ART_W}, (100dvh - 48px) / ${artH}))`
      svg.setAttribute('viewBox', `0 0 ${ART_W} ${artH}`)
      svg.querySelectorAll('[data-guide-v]').forEach((line) => {
        line.setAttribute('y2', String(artH))
      })

      const phoneTop = ART_PAD
      const phoneBottom = ART_PAD + fittedH
      const measured = {}

      for (const id of BLOCKS) {
        const el = root.querySelector(`[data-block="${id}"]`)
        if (!el) continue
        measured[id] = yInArtboard(el, artboard)
      }

      const chipRects = [...root.querySelectorAll('[data-chip]')].map((el) =>
        yInArtboard(el, artboard),
      )

      const hYs = uniqueSorted([
        phoneTop,
        ...GUIDE_BLOCKS.flatMap((id) => {
          const m = measured[id]
          return m ? [m.top, m.bottom] : []
        }),
        ...(measured.title ? [measured.title.top, measured.title.bottom] : []),
        ...(measured.date ? [measured.date.bottom] : []),
        ...(chipRects.length
          ? [
              Math.min(...chipRects.map((r) => r.top)),
              Math.max(...chipRects.map((r) => r.bottom)),
            ]
          : []),
        phoneBottom,
      ])

      svg.querySelectorAll('[data-guide-h]').forEach((n) => n.remove())
      for (const y of hYs) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('data-guide', '')
        line.setAttribute('data-guide-h', '')
        line.setAttribute('x1', '0')
        line.setAttribute('x2', String(ART_W))
        line.setAttribute('y1', String(y))
        line.setAttribute('y2', String(y))
        line.setAttribute('stroke', GUIDE)
        line.setAttribute('stroke-width', '1')
        svg.appendChild(line)
      }

      skeleton.querySelectorAll('[data-bone]').forEach((n) => n.remove())

      const addBone = ({ top, left, width, height, radius }) => {
        const bone = document.createElement('div')
        bone.setAttribute('data-bone', '')
        bone.className = 'absolute border border-black/80 bg-transparent'
        bone.style.top = `${top - ART_PAD}px`
        bone.style.left = `${left}px`
        bone.style.width = `${width}px`
        bone.style.height = `${height}px`
        bone.style.borderRadius = `${radius}px`
        skeleton.appendChild(bone)
      }

      if (measured.title) {
        const m = measured.title
        addBone({
          top: m.top,
          left: m.left - ART_PAD,
          width: Math.min(m.width, PHONE_W - (m.left - ART_PAD) - INSET - 16),
          height: m.height,
          radius: 6,
        })
      }
      if (measured.date) {
        const m = measured.date
        addBone({
          top: m.top,
          left: m.left - ART_PAD,
          width: Math.min(m.width + 8, 160),
          height: m.height,
          radius: 6,
        })
      }

      root.querySelectorAll('[data-chip]').forEach((el) => {
        const m = yInArtboard(el, artboard)
        addBone({
          top: m.top,
          left: m.left - ART_PAD,
          width: m.width,
          height: m.height,
          radius: 999,
        })
      })

      for (const id of ['card1', 'card2', 'promo']) {
        const m = measured[id]
        if (!m) continue
        addBone({
          top: m.top,
          left: INSET,
          width: PHONE_W - INSET * 2,
          height: m.height,
          radius: 24,
        })
      }

      if (measured.links) {
        const m = measured.links
        const h = Math.min(20, m.height)
        const top = m.top + (m.height - h) / 2
        addBone({ top, left: 56, width: 144, height: h, radius: 6 })
        addBone({ top, left: PHONE_W - 56 - 112, width: 112, height: h, radius: 6 })
      }

      const contentL = ART_PAD + INSET + PAD
      const contentR = ART_PAD + PHONE_W - INSET - PAD
      const offsetYs = [
        measured.header?.top ?? phoneTop + 24,
        measured.promo?.bottom ?? phoneBottom - 24,
      ]
      root.querySelectorAll('[data-offset]').forEach((el, i) => {
        const y = offsetYs[i < 2 ? 0 : 1]
        const x = i % 2 === 0 ? contentL - 10 : contentR - 10
        el.style.left = `${x}px`
        el.style.top = `${y - 10}px`
      })

      const q = gsap.utils.selector(root)
      const lines = q('[data-guide]')
      const offsets = q('[data-offset]')
      const bones = q('[data-bone]')
      const mock = q('[data-mock]')
      const phoneChrome = q('[data-phone-chrome]')
      const stopNotice = q('[data-stop-notice]')
      const sheetScrim = q('[data-sheet-scrim]')
      const sheet = q('[data-sheet]')

      lines.forEach((el) => {
        const len = el.getTotalLength?.() ?? 0
        gsap.set(el, {
          strokeDasharray: len,
          strokeDashoffset: len,
          opacity: 1,
        })
      })

      gsap.set(offsets, { scale: 0.6, opacity: 0, transformOrigin: 'center' })
      gsap.set(bones, { opacity: 0, y: 8 })
      gsap.set(mock, { opacity: 0 })
      gsap.set(phoneChrome, { opacity: 0 })
      gsap.set(stopNotice, { scale: 1, transformOrigin: 'center' })
      gsap.set(sheetScrim, { opacity: 0 })

      const sheetClosedY = phone.offsetHeight || fittedH
      const sheetHalfY = sheetClosedY * 0.45
      const sheetLargeY = sheetClosedY * 0.08
      gsap.set(sheet, { y: sheetClosedY, force3D: true })

      tl = gsap.timeline({
        repeat: -1,
        defaults: { ease: 'power2.inOut' },
      })
      tlRef.current = tl

      tl.to(lines, {
        strokeDashoffset: 0,
        duration: 1.05,
        stagger: { each: 0.05, from: 'edges' },
        ease: 'power2.out',
      })

      tl.to(
        offsets,
        {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          stagger: 0.07,
          ease: 'power3.out',
        },
        '-=0.35',
      )

      tl.to(
        bones,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
        },
        '-=0.1',
      )

      tl.to(phoneChrome, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '+=0.15')
      tl.to(mock, { opacity: 1, duration: 0.85, ease: 'power2.inOut' }, '-=0.25')
      tl.to(
        [...bones, ...offsets],
        { opacity: 0, duration: 0.55, ease: 'power2.inOut' },
        '-=0.55',
      )
      tl.to(lines, { opacity: 0.28, duration: 0.55, ease: 'power2.inOut' }, '<')

      tl.to({}, { duration: 0.7 })

      tl.to(stopNotice, { scale: 0.96, duration: 0.12, ease: 'power2.in' })
      tl.to(stopNotice, { scale: 1, duration: 0.2, ease: 'power2.out' })

      tl.to(sheetScrim, { opacity: 1, duration: 0.5, ease: 'power2.inOut' }, '-=0.05')
      tl.to(sheet, { y: sheetHalfY, duration: 0.75, ease: 'expo.out' }, '<')

      tl.to({}, { duration: 0.85 })

      tl.to(sheet, { y: sheetLargeY, duration: 0.75, ease: 'power4.inOut' })

      tl.to({}, { duration: 1.05 })

      tl.to(sheet, { y: sheetClosedY, duration: 0.7, ease: 'power4.inOut' })
      tl.to(sheetScrim, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, '-=0.4')

      tl.to({}, { duration: 0.45 })

      tl.to(
        [...mock, ...phoneChrome, ...lines, ...offsets],
        {
          opacity: 0,
          duration: 0.7,
          ease: 'power2.inOut',
          stagger: { each: 0.02, from: 'end' },
        },
      )
      tl.set(lines, {
        strokeDashoffset: (_i, el) => el.getTotalLength?.() ?? 0,
        opacity: 1,
      })
      tl.set(offsets, { scale: 0.6, opacity: 0 })
      tl.set(bones, { opacity: 0, y: 8 })
      tl.set([mock, phoneChrome], { opacity: 0 })
      tl.set(stopNotice, { scale: 1 })
      tl.set(sheetScrim, { opacity: 0 })
      tl.set(sheet, { y: sheetClosedY })
      tl.to({}, { duration: 0.35 })
    }

    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    fontsReady.then(setup)

    return () => {
      cancelled = true
      tl?.kill()
      tlRef.current = null
    }
  }, [])

  const contentL = INSET + PAD
  const contentR = PHONE_W - INSET - PAD
  const artHInit = PHONE_H_INIT + ART_PAD * 2

  return (
    <div
      ref={rootRef}
      className="anatomy-page min-h-[100dvh] w-full overflow-hidden bg-white text-black"
    >
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[560px] items-center justify-center px-6 py-10">
        <div
          ref={artboardRef}
          className="relative origin-center"
          style={{
            width: ART_W,
            height: artHInit,
            transform: `scale(min(1, (100vw - 48px) / ${ART_W}, (100dvh - 48px) / ${artHInit}))`,
          }}
        >
          <svg
            ref={svgRef}
            className="pointer-events-none absolute inset-0 z-30 h-full w-full overflow-visible"
            viewBox={`0 0 ${ART_W} ${artHInit}`}
            fill="none"
            aria-hidden
          >
            {[
              ART_PAD,
              ART_PAD + INSET,
              ART_PAD + contentL,
              ART_PAD + contentR,
              ART_PAD + PHONE_W - INSET,
              ART_PAD + PHONE_W,
            ].map((x, i) => (
              <line
                key={`v-${i}`}
                data-guide
                data-guide-v
                x1={x}
                y1={0}
                x2={x}
                y2={artHInit}
                stroke={GUIDE}
                strokeWidth="1"
              />
            ))}
          </svg>

          {[0, 1, 2, 3].map((i) => (
            <div key={i} data-offset className="anatomy-hatch absolute z-30 h-5 w-5" />
          ))}

          <div
            ref={phoneRef}
            className="absolute overflow-hidden rounded-[48px]"
            style={{
              left: ART_PAD,
              top: ART_PAD,
              width: PHONE_W,
              height: PHONE_H_INIT,
              boxShadow: '0 0 0 10px #d3d8e0',
            }}
          >
            <div
              data-phone-chrome
              className="absolute inset-0 rounded-[40px] bg-surface-muted"
            />

            <div
              ref={skeletonRef}
              className="pointer-events-none absolute inset-0 z-10"
            />

            <div
              data-mock
              className="absolute inset-x-0 top-0 z-20 overflow-hidden rounded-[40px]"
            >
              <AnatomyHomeMock />
            </div>

            <AnatomyStopSheet />
          </div>
        </div>
      </div>
    </div>
  )
}

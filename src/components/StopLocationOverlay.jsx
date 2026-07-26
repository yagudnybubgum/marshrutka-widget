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
      fadeFromIndex={0}
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

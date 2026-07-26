import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import StopLocationMap from './StopLocationMap'
import { XMarkIcon } from './icons'

const StopLocationOverlay = ({ open, onClose, stop, title }) => {
  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.body.classList.add('is-scroll-locked')
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.classList.remove('is-scroll-locked')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open || !stop) return null

  const heading = title ?? stop.name

  return createPortal(
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={heading}>
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Закрыть"
        onClick={onClose}
      />

      <div className="absolute inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center md:p-6 md:pointer-events-none">
        <div className="pointer-events-auto overflow-hidden rounded-t-2xl bg-surface shadow-xl stop-sheet-enter md:w-full md:max-w-lg md:rounded-2xl stop-modal-enter-md">
          <div className="flex flex-col items-center pt-3 pb-2 md:hidden">
            <div className="h-1 w-10 rounded-full bg-ink/20" aria-hidden />
          </div>
          <div className="flex items-center justify-between gap-3 px-4 pb-3 md:px-5 md:py-4 md:pb-4">
            <h2 className="text-lg font-medium text-ink">{heading}</h2>
            <button
              type="button"
              onClick={onClose}
              className="hover-darken hidden md:inline-flex shrink-0 rounded-lg p-1.5 text-ink/70"
              aria-label="Закрыть"
            >
              <XMarkIcon />
            </button>
          </div>
          <StopLocationMap
            lat={stop.lat}
            lng={stop.lng}
            name={stop.name}
            className="h-[55vh] w-full md:h-[360px]"
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default StopLocationOverlay

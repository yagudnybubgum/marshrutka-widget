import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import StopLocationMap from './StopLocationMap'
import { XMarkIcon } from './icons'

const StopLocationOverlay = ({ open, onClose, stop }) => {
  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open || !stop) return null

  return createPortal(
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={stop.name}>
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Закрыть"
        onClick={onClose}
      />

      <div className="absolute inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center md:p-6 md:pointer-events-none">
        <div className="pointer-events-auto overflow-hidden rounded-t-2xl bg-base-100 shadow-xl stop-sheet-enter md:w-full md:max-w-lg md:rounded-2xl stop-modal-enter-md">
          <div className="flex flex-col items-center pt-3 pb-2 md:hidden">
            <div className="h-1 w-10 rounded-full bg-black/15" aria-hidden />
          </div>
          <div className="flex items-center justify-between gap-3 px-4 pb-3 md:px-5 md:py-4 md:pb-4">
            <h2 className="text-lg font-medium text-black">{stop.name}</h2>
            <button
              type="button"
              onClick={onClose}
              className="hidden md:inline-flex shrink-0 rounded-lg p-1.5 text-black/60 hover:bg-black/5"
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

import { useEffect, useRef, useState } from 'react'
import { loadYmaps, getYandexMapsKey } from '../utils/loadYmaps'
import { copy } from '../config/copy'

const DEFAULT_ZOOM = 17

const StopLocationMap = ({ lat, lng, name, className = '' }) => {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    if (lat == null || lng == null) {
      setError(copy.errors.stopNoCoords)
      return
    }
    if (!getYandexMapsKey()) {
      setError(copy.errors.ymapsKeyMissing)
      return
    }

    let cancelled = false

    loadYmaps()
      .then((ymaps) => {
        if (cancelled || !containerRef.current || mapRef.current) return

        const map = new ymaps.Map(containerRef.current, {
          center: [lat, lng],
          zoom: DEFAULT_ZOOM,
          controls: ['zoomControl'],
        }, {
          suppressMapOpenBlock: true,
        })

        map.geoObjects.add(new ymaps.Placemark(
          [lat, lng],
          { balloonContent: name, hintContent: name },
          { preset: 'islands#blueDotIcon' },
        ))

        const resizeObserver = new ResizeObserver(() => {
          map.container.fitToViewport()
        })
        resizeObserver.observe(containerRef.current)
        map._resizeObserver = resizeObserver

        mapRef.current = map
        // sheet/modal может анимировать высоту — добить viewport после paint
        requestAnimationFrame(() => map.container.fitToViewport())
      })
      .catch(() => {
        if (!cancelled) setError(copy.errors.ymapsLoad)
      })

    return () => {
      cancelled = true
      const map = mapRef.current
      if (map) {
        map._resizeObserver?.disconnect()
        map.destroy()
        mapRef.current = null
      }
    }
  }, [lat, lng, name])

  if (error) {
    return (
      <div className={`flex items-center justify-center px-4 text-sm text-ink/70 text-center ${className}`}>
        {error}
      </div>
    )
  }

  return <div ref={containerRef} className={className} />
}

export default StopLocationMap

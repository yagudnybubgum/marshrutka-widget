import { useEffect, useRef, useState } from 'react'
import { loadYmaps, getYandexMapsKey } from '../utils/loadYmaps'
import { copy } from '../config/copy'

function getMapLineColor() {
  const styles = getComputedStyle(document.documentElement)
  const value = styles.getPropertyValue('--map-line').trim()
  if (value && !value.startsWith('var(')) return value
  return styles.getPropertyValue('--accent').trim()
}

/** OSRM → [lat, lng][] вдоль дорог. При fail — прямые отрезки. */
async function fetchRoadCoords(stops) {
  if (!stops?.length) return []
  if (stops.length === 1) return [[stops[0].lat, stops[0].lng]]

  const straight = () => stops.map((s) => [s.lat, s.lng])

  try {
    const path = stops.map((s) => `${s.lng},${s.lat}`).join(';')
    const url =
      `https://router.project-osrm.org/route/v1/driving/${path}` +
      '?overview=full&geometries=geojson'

    const res = await fetch(url)
    if (!res.ok) return straight()

    const data = await res.json()
    const coords = data?.routes?.[0]?.geometry?.coordinates
    if (!coords?.length) return straight()

    // GeoJSON: [lng, lat] → Яндекс: [lat, lng]
    return coords.map(([lng, lat]) => [lat, lng])
  } catch {
    return straight()
  }
}

function drawRoute(ymaps, map, collection, stops, lineCoords) {
  collection.removeAll()
  if (!stops?.length) return

  if (lineCoords?.length >= 2) {
    collection.add(new ymaps.Polyline(lineCoords, {}, {
      strokeColor: getMapLineColor(),
      strokeWidth: 4,
      strokeOpacity: 0.9,
      strokeStyle: 'solid',
    }))
  }

  stops.forEach((stop, index) => {
    const isEndpoint = index === 0 || index === stops.length - 1
    collection.add(new ymaps.Placemark(
      [stop.lat, stop.lng],
      { balloonContent: stop.name, hintContent: stop.name },
      {
        preset: isEndpoint ? 'islands#blueDotIcon' : 'islands#blueCircleDotIcon',
      }
    ))
  })

  const bounds = collection.getBounds()
  if (bounds) {
    map.setBounds(bounds, {
      checkZoomRange: true,
      zoomMargin: 36,
    })
  }
  map.container.fitToViewport()
}

const RouteMap = ({ stops }) => {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const collectionRef = useRef(null)
  const stopsRef = useRef(stops)
  const drawGenRef = useRef(0)
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)

  stopsRef.current = stops

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    if (!getYandexMapsKey()) {
      setError(copy.errors.ymapsKeyMissing)
      return
    }

    let cancelled = false

    loadYmaps()
      .then((ymaps) => {
        if (cancelled || !containerRef.current || mapRef.current) return

        const map = new ymaps.Map(containerRef.current, {
          center: [59.94, 30.52],
          zoom: 11,
          controls: ['zoomControl', 'geolocationControl'],
        }, {
          suppressMapOpenBlock: true,
        })

        const collection = new ymaps.GeoObjectCollection()
        map.geoObjects.add(collection)

        mapRef.current = map
        collectionRef.current = collection

        const resizeObserver = new ResizeObserver(() => {
          map.container.fitToViewport()
        })
        resizeObserver.observe(containerRef.current)
        map._resizeObserver = resizeObserver

        setReady(true)
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
        collectionRef.current = null
      }
      setReady(false)
    }
  }, [])

  useEffect(() => {
    if (!ready || !mapRef.current || !collectionRef.current || !window.ymaps) return

    const gen = ++drawGenRef.current
    const ymaps = window.ymaps
    const map = mapRef.current
    const collection = collectionRef.current

    // Сразу маркеры + прямая, потом подменим на дорожную геометрию
    drawRoute(ymaps, map, collection, stops, stops.map((s) => [s.lat, s.lng]))

    fetchRoadCoords(stops).then((lineCoords) => {
      if (drawGenRef.current !== gen) return
      if (!mapRef.current || !collectionRef.current) return
      drawRoute(ymaps, mapRef.current, collectionRef.current, stops, lineCoords)
    })
  }, [stops, ready])

  if (error) {
    return (
      <div className="h-full w-full min-h-[320px] flex items-center justify-center px-4 text-sm text-ink/70 text-center">
        {error}
      </div>
    )
  }

  return <div ref={containerRef} className="h-full w-full min-h-[320px]" />
}

export default RouteMap

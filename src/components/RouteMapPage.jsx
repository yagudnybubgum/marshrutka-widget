import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getRoute, isValidRouteId } from '../config/routes'
import { getRouteGeo } from '../utils/routesGeo'
import RouteMap from './RouteMap'
import { ChevronLeftIcon } from './icons'

const RouteMapPage = () => {
  const { routeId } = useParams()
  const route = getRoute(routeId)
  const geo = getRouteGeo(routeId)

  const [directionId, setDirectionId] = useState(null)

  useEffect(() => {
    setDirectionId(geo?.directions?.[0]?.id ?? null)
  }, [geo])

  const direction = useMemo(() => {
    if (!geo?.directions?.length) return null
    return geo.directions.find((d) => d.id === directionId) ?? geo.directions[0]
  }, [geo, directionId])

  if (!isValidRouteId(routeId)) {
    return <Navigate to="/" replace />
  }

  if (!geo || !direction) {
    return (
      <div className="min-h-[100dvh] bg-surface-muted py-6 px-4 flex flex-col">
        <div className="max-w-4xl mx-auto w-full">
          <Link
            to={routeId === '533' ? '/' : `/?tab=${encodeURIComponent(routeId)}`}
            className="text-ink hover:text-ink/70 transition-colors flex items-center gap-1 text-sm mb-6"
          >
            <ChevronLeftIcon />
            назад
          </Link>
          <p className="text-sm text-ink/70">Карта для маршрута {routeId} пока не добавлена.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-surface-muted flex flex-col">
      <div className="px-4 pt-4 pb-3 max-w-4xl mx-auto w-full shrink-0">
        <Link
          to={routeId === '533' ? '/' : `/?tab=${encodeURIComponent(routeId)}`}
          className="text-ink hover:text-ink/70 transition-colors flex items-center gap-1 text-sm mb-3"
        >
          <ChevronLeftIcon />
          назад
        </Link>

        <h1 className="text-xl font-normal text-ink mb-1">
          Карта маршрута {route?.name ?? routeId}
        </h1>

        <div className="flex flex-wrap gap-2 mt-3">
          {geo.directions.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDirectionId(d.id)}
              className={`flex-shrink-0 px-5 py-2 text-base font-normal rounded-full transition-colors ${
                direction.id === d.id
                  ? 'bg-chip-active text-chip-active-ink'
                  : 'bg-chip text-ink/70 hover:text-ink'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 pb-4 max-w-4xl mx-auto w-full min-h-0">
        <div className="bg-surface rounded-lg overflow-hidden h-[min(70dvh,640px)] border border-ink/5">
          <RouteMap stops={direction.stops} />
        </div>
        <p className="text-xs text-ink/50 mt-2 px-0.5">
          {direction.stops.length} остановок · маршрут по дорогам
        </p>
      </div>
    </div>
  )
}

export default RouteMapPage

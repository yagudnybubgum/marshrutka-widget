import { useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { getRoute, isValidRouteId } from '../config/routes'
import { getRouteGeo } from '../utils/routesGeo'
import RouteMap from './RouteMap'
import { BackLink, Chip, ChipGroup } from './ui'
import { copy } from '../config/copy'

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

  const backTo = routeId === '533' ? '/' : `/?tab=${encodeURIComponent(routeId)}`

  if (!isValidRouteId(routeId)) {
    return <Navigate to="/" replace />
  }

  if (!geo || !direction) {
    return (
      <div className="min-h-[100dvh] bg-surface-muted py-6 px-4 flex flex-col">
        <div className="max-w-4xl mx-auto w-full">
          <BackLink to={backTo} className="mb-6" />
          <p className="text-sm text-ink/70">{copy.map.missing(routeId)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-surface-muted flex flex-col">
      <div className="px-4 pt-4 pb-3 max-w-4xl mx-auto w-full shrink-0">
        <BackLink to={backTo} className="mb-3" />

        <h1 className="text-xl font-normal text-ink mb-1">
          {copy.map.title(route?.name ?? routeId)}
        </h1>

        <ChipGroup className="mt-3">
          {geo.directions.map((d) => (
            <Chip
              key={d.id}
              type="button"
              onClick={() => setDirectionId(d.id)}
              active={direction.id === d.id}
            >
              {d.name}
            </Chip>
          ))}
        </ChipGroup>
      </div>

      <div className="flex-1 px-4 pb-4 max-w-4xl mx-auto w-full min-h-0">
        <div className="bg-surface rounded-md overflow-hidden h-[min(70dvh,640px)] border border-ink/5">
          <RouteMap stops={direction.stops} />
        </div>
        <p className="text-xs text-ink/70 mt-2 px-0.5">
          {copy.map.stopsMeta(direction.stops.length)}
        </p>
      </div>
    </div>
  )
}

export default RouteMapPage

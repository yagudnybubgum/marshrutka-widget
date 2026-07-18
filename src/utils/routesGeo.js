const geoModules = import.meta.glob('../data/routes-geo/*.json', { eager: true })

const byRouteId = Object.fromEntries(
  Object.entries(geoModules).map(([path, mod]) => {
    const id = path.split('/').pop().replace(/\.json$/, '')
    return [id, mod.default ?? mod]
  })
)

export const getRouteGeo = (routeId) => byRouteId[routeId] ?? null

export const hasRouteGeo = (routeId) => Boolean(byRouteId[routeId])

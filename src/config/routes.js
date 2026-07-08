export const ROUTES = [
  { id: '533', name: '533', destination: 'Янино-1', color: 'bg-blue-100 text-blue-800' },
  { id: '429', name: '429', destination: 'Разметелево', color: 'bg-green-100 text-green-800' },
  { id: '664', name: '664', destination: 'МЕГА Дыбенко', color: 'bg-gray-100 text-gray-800' },
  { id: '430A', name: '430А', destination: 'Ёксолово', color: 'bg-purple-100 text-purple-800' },
  { id: '453', name: '453', destination: 'Дубровка', color: 'bg-orange-100 text-orange-800' },
]

export const ROUTES_FROM_LADOZHSKAYA = ROUTES.filter((r) => r.id !== '664')

export const getRoute = (id) => ROUTES.find((r) => r.id === id)

export const isValidRouteId = (id) => ROUTES.some((r) => r.id === id)

export const getRouteColor = (routeId) => getRoute(routeId)?.color ?? 'bg-gray-100 text-gray-800'

import { getRouteColorClasses } from './tokens'

export const ROUTES = [
  { id: '533', name: '533', destination: 'Янино-1', color: 'blue' },
  { id: '429', name: '429', destination: 'Разметелево', color: 'green' },
  { id: '664', name: '664', destination: 'МЕГА Дыбенко', color: 'gray' },
  { id: '430A', name: '430А', destination: 'Ёксолово', color: 'purple' },
  { id: '453', name: '453', destination: 'Дубровка', color: 'orange' },
  { id: '605', name: '605', destination: 'ул. Быкова (Павлово)', color: 'gray', isNew: true },
]

export const ROUTES_FROM_LADOZHSKAYA = ROUTES.filter((r) => r.id !== '664' && r.id !== '605')

export const getRoute = (id) => ROUTES.find((r) => r.id === id)

export const isValidRouteId = (id) => ROUTES.some((r) => r.id === id)

export const getRouteColor = (routeId) =>
  getRouteColorClasses(getRoute(routeId)?.color ?? 'gray')

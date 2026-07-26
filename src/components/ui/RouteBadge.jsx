import { getRouteColor } from '../../config/routes'
import { getRouteColorClasses } from '../../config/tokens'

export function RouteBadge({ routeId, color, className = '', children, ...rest }) {
  const tone =
    color != null ? getRouteColorClasses(color) : getRouteColor(routeId)

  return (
    <span
      className={`px-5 py-2 rounded-full text-sm font-medium ${tone} ${className}`.trim()}
      {...rest}
    >
      {children}
    </span>
  )
}

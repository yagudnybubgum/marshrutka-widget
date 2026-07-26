import { ArrowRightIcon } from '../icons'
import { RouteBadge } from './RouteBadge'

export function DepartureRow({
  routeId,
  routeName,
  destination,
  untilLabel,
  timeLabel,
  className = '',
}) {
  return (
    <div className={`flex items-center justify-between py-4 ${className}`.trim()}>
      <div className="flex items-center gap-3">
        <RouteBadge routeId={routeId}>{routeName}</RouteBadge>
        <div className="flex flex-col">
          <span className="inline-flex items-center gap-1 text-sm text-ink/70">
            <ArrowRightIcon className="h-3.5 w-3.5" />
            {destination}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-ink/70">{untilLabel}</span>
        <span className="text-xl font-normal text-ink/80">{timeLabel}</span>
      </div>
    </div>
  )
}

import { ArrowRightIcon } from '../icons'
import { RouteBadge } from './RouteBadge'

/** Fits longest route id in product (430А). Keeps destinations column-aligned. */
const BADGE_SLOT = 'w-[4.75rem] shrink-0 tabular-nums'

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
      <div className="flex items-center gap-2 min-w-0">
        <RouteBadge routeId={routeId} className={BADGE_SLOT}>
          {routeName}
        </RouteBadge>
        <ArrowRightIcon className="h-3.5 w-3.5 shrink-0 text-ink/70" />
        <span className="text-sm text-ink/70 truncate">{destination}</span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm text-ink/70">{untilLabel}</span>
        <span className="text-xl font-normal text-ink/80">{timeLabel}</span>
      </div>
    </div>
  )
}

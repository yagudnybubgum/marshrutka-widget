import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useNow } from '../context/TimeContext'
import { loadScheduleRaw, peekScheduleRaw } from '../utils/schedule/loadSchedule'
import { processScheduleForWidget } from '../utils/schedule/processSchedule'
import { formatTime, formatTimeUntil, getCurrentTimeInMinutes } from '../utils/schedule/formatTime'
import { getScheduleWindow } from '../utils/schedule/getScheduleWindow'
import { getRouteGeo } from '../utils/routesGeo'
import StopLocationOverlay from './StopLocationOverlay'
import { MapPinIcon } from './icons'
import { Alert, EmptyState } from './ui'
import { copy } from '../config/copy'

const getLadozhskayaStop = (routeNumber) => {
  const geo = getRouteGeo(routeNumber)
  const direction = geo?.directions?.find((d) => d.id === 'from_ladozhskaya')
  return direction?.stops?.find((s) => s.id === 'ladozhskaya') ?? null
}

const LadozhskayaStopNotice = ({ onShowMap }) => (
  <button
    type="button"
    onClick={onShowMap}
    className="hover-darken w-full rounded-t-3xl bg-alert px-4 pb-4 pt-3 text-left text-alert-ink"
  >
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
      <p className="text-base font-normal">{copy.widget.stopMoved}</p>
      <span className="inline-flex items-center gap-1 text-sm font-normal">
        {copy.widget.viewOnMap}
        <MapPinIcon />
      </span>
    </div>
  </button>
)

const DirectionCardSkeleton = () => (
  <div className="rounded-3xl overflow-hidden bg-surface p-4" aria-hidden>
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="skeleton h-7 w-28" />
          <div className="skeleton h-4 w-24" />
        </div>
        <div className="skeleton h-10 w-20" />
      </div>
      <div className="space-y-2">
        <div className="skeleton h-4 w-full max-w-xs" />
        <div className="skeleton h-4 w-48" />
      </div>
    </div>
  </div>
)

const DirectionCard = ({
  directionName,
  nextTrip,
  followingTrips,
  previousTrip,
  routeNumber,
  cardIndex = 0,
  animate = true,
}) => {
  const [mapOpen, setMapOpen] = useState(false)
  const showStopNotice = routeNumber === '533' && directionName === copy.direction.fromLadozhskaya
  const stop = showStopNotice ? getLadozhskayaStop(routeNumber) : null

  const scheduleTo = nextTrip
    ? `/full/${routeNumber}?dir=${encodeURIComponent(directionName)}&t=${nextTrip.time}`
    : `/full/${routeNumber}`

  return (
    <div
      style={cardIndex != null ? { '--card-i': cardIndex } : undefined}
      className={`${animate ? 'card-enter ' : ''}rounded-3xl overflow-hidden bg-surface`}
    >
      <Link
        to={scheduleTo}
        className="hover-darken block p-4"
      >
        {nextTrip ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-xl font-normal text-ink">{directionName}</h3>
                <p className="text-sm text-ink/70">
                  {nextTrip.minutesUntil === 0
                    ? copy.widget.now
                    : `${copy.widget.inPrefix} ${formatTimeUntil(nextTrip.minutesUntil)}`}
                  {nextTrip.isTomorrow ? copy.widget.tomorrowSuffix : ''}
                </p>
              </div>
              <div className="text-right self-start">
                <p className="font-normal text-ink" style={{ fontSize: '40px' }}>
                  {formatTime(nextTrip.time)}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {followingTrips.length > 0 && (
                <p className="text-sm text-ink/80">
                  {`${copy.widget.followingPrefix} ${followingTrips
                    .slice(0, 3)
                    .map((t) => `${formatTime(t.time)}${t.isTomorrow ? copy.widget.tomorrowSuffix : ''}`)
                    .join(', ')}`}
                </p>
              )}
              {previousTrip && (
                <p className="text-sm text-ink/80">
                  {copy.widget.previousLeft(formatTimeUntil(-previousTrip.minutesUntil))}
                </p>
              )}
            </div>
          </div>
        ) : (
          <EmptyState>{copy.widget.emptyDirection}</EmptyState>
        )}
      </Link>
      {showStopNotice && nextTrip && (
        <LadozhskayaStopNotice onShowMap={() => setMapOpen(true)} />
      )}
      <StopLocationOverlay
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        stop={stop}
        title={copy.widget.stopLadozhskayaTitle}
      />
    </div>
  )
}

const MarshrutkaWidget = ({ routeNumber = '533', onScheduleChange }) => {
  const [state, setState] = useState(() => {
    const cached = peekScheduleRaw(routeNumber)
    return {
      routeNumber,
      rawData: cached,
      loading: !cached,
      error: null,
    }
  })
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false)
  const now = useNow()

  if (state.routeNumber !== routeNumber) {
    const cached = peekScheduleRaw(routeNumber)
    setState({
      routeNumber,
      rawData: cached,
      loading: !cached,
      error: null,
    })
  }

  const { rawData, loading, error } = state

  useEffect(() => {
    if (peekScheduleRaw(routeNumber)) return undefined

    let cancelled = false

    const load = async () => {
      try {
        const data = await loadScheduleRaw(routeNumber)
        if (cancelled) return
        setState({
          routeNumber,
          rawData: data,
          loading: false,
          error: null,
        })
      } catch {
        if (cancelled) return
        setState({
          routeNumber,
          rawData: null,
          loading: false,
          error: copy.errors.scheduleLoad(routeNumber),
        })
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [routeNumber])

  const schedule = useMemo(() => {
    if (!rawData) return null
    return processScheduleForWidget(rawData, now)
  }, [rawData, now])

  useEffect(() => {
    if (schedule) {
      onScheduleChange?.(schedule)
      setHasAnimatedIn(true)
    }
  }, [schedule, onScheduleChange])

  const currentTime = useMemo(() => getCurrentTimeInMinutes(now), [now])

  const windowDir1 = schedule ? getScheduleWindow(schedule.direction1, currentTime) : { nextTrip: null, followingTrips: [], previousTrip: null }
  const windowDir2 = schedule ? getScheduleWindow(schedule.direction2, currentTime) : { nextTrip: null, followingTrips: [], previousTrip: null }

  return (
    <div className="w-full space-y-5">
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-busy="true" aria-label={copy.a11y.loadingSchedule}>
          <DirectionCardSkeleton />
          <DirectionCardSkeleton />
        </div>
      )}

      {error && <Alert>{error}</Alert>}

      {!loading && rawData && !schedule && !error && (
        <Alert>
          {copy.errors.scheduleProcess(routeNumber)}
        </Alert>
      )}

      {schedule && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DirectionCard
            directionName={schedule.direction1Name}
            nextTrip={windowDir1.nextTrip}
            followingTrips={windowDir1.followingTrips}
            previousTrip={windowDir1.previousTrip}
            routeNumber={routeNumber}
            cardIndex={0}
            animate={!hasAnimatedIn}
          />

          {schedule.direction2.length > 0 && (
            <DirectionCard
              directionName={schedule.direction2Name}
              nextTrip={windowDir2.nextTrip}
              followingTrips={windowDir2.followingTrips}
              previousTrip={windowDir2.previousTrip}
              routeNumber={routeNumber}
              cardIndex={1}
              animate={!hasAnimatedIn}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default MarshrutkaWidget

import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useNow } from '../context/TimeContext'
import { loadScheduleRaw } from '../utils/schedule/loadSchedule'
import { processScheduleForWidget } from '../utils/schedule/processSchedule'
import { formatTime, formatTimeUntil, getCurrentTimeInMinutes } from '../utils/schedule/formatTime'
import { getScheduleWindow } from '../utils/schedule/getScheduleWindow'
import { getRouteGeo } from '../utils/routesGeo'
import StopLocationOverlay from './StopLocationOverlay'
import { MapPinIcon } from './icons'

const getLadozhskayaStop = (routeNumber) => {
  const geo = getRouteGeo(routeNumber)
  const direction = geo?.directions?.find((d) => d.id === 'from_ladozhskaya')
  return direction?.stops?.find((s) => s.id === 'ladozhskaya') ?? null
}

const LadozhskayaStopNotice = ({ onShowMap }) => (
  <button
    type="button"
    onClick={onShowMap}
    className="w-full bg-amber-50 px-4 pb-4 pt-3 text-left transition-colors hover:bg-amber-100/80 active:bg-amber-100"
  >
    <div className="space-y-2">
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-amber-900">Остановка переехала</p>
        <p className="text-sm text-amber-900 [text-wrap:pretty]">
          Садимся у&nbsp;дальней остановки слева от&nbsp;перехода
        </p>
      </div>
      <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-900">
        Показать на карте
        <MapPinIcon />
      </span>
    </div>
  </button>
)

const DirectionCard = ({
  directionName,
  nextTrip,
  followingTrips,
  previousTrip,
  routeNumber,
  cardIndex = 0,
}) => {
  const [mapOpen, setMapOpen] = useState(false)
  const showStopNotice = routeNumber === '533' && directionName === 'С Ладожской'
  const stop = showStopNotice ? getLadozhskayaStop(routeNumber) : null

  const scheduleTo = nextTrip
    ? `/full/${routeNumber}?dir=${encodeURIComponent(directionName)}&t=${nextTrip.time}`
    : `/full/${routeNumber}`

  return (
    <div
      style={cardIndex != null ? { '--card-i': cardIndex } : undefined}
      className="card-enter rounded-xl overflow-hidden bg-base-100"
    >
      <Link
        to={scheduleTo}
        className="block p-4 transition-colors hover:bg-base-100/80 active:bg-black/[0.03]"
      >
        {nextTrip ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-xl font-normal text-black">{directionName}</h3>
                <p className="text-sm text-black/70">
                  {nextTrip.minutesUntil === 0
                    ? 'сейчас'
                    : `через ${formatTimeUntil(nextTrip.minutesUntil)}`}
                  {nextTrip.isTomorrow ? ' (завтра)' : ''}
                </p>
              </div>
              <div className="text-right self-start">
                <p className="font-normal text-black" style={{ fontSize: '40px' }}>
                  {formatTime(nextTrip.time)}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {followingTrips.length > 0 && (
                <p className="text-sm text-black/80">
                  {`Следующие в ${followingTrips
                    .slice(0, 3)
                    .map((t) => `${formatTime(t.time)}${t.isTomorrow ? ' (завтра)' : ''}`)
                    .join(', ')}`}
                </p>
              )}
              {previousTrip && (
                <p className="text-sm text-black/80">
                  {`Предыдущая ушла ${formatTimeUntil(-previousTrip.minutesUntil)} назад`}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="alert alert-info">
            <span className="text-black">нет данных по этому направлению.</span>
          </div>
        )}
      </Link>
      {showStopNotice && nextTrip && (
        <LadozhskayaStopNotice onShowMap={() => setMapOpen(true)} />
      )}
      <StopLocationOverlay
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        stop={stop}
        title="Остановка на Ладожской"
      />
    </div>
  )
}

const MarshrutkaWidget = ({ routeNumber = '533', onScheduleChange }) => {
  const [rawData, setRawData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false)
  const now = useNow()

  useEffect(() => {
    let cancelled = false

    setRawData(null)
    setError(null)
    setLoading(true)
    setShowLoadingIndicator(false)

    const load = async () => {
      try {
        const data = await loadScheduleRaw(routeNumber)
        if (cancelled) return
        setRawData(data)
        setLoading(false)
      } catch {
        if (cancelled) return
        setError(`Не удалось загрузить расписание для маршрута ${routeNumber}.`)
        setLoading(false)
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
    }
  }, [schedule, onScheduleChange])

  useEffect(() => {
    if (!loading) {
      setShowLoadingIndicator(false)
      return
    }

    const timer = setTimeout(() => {
      setShowLoadingIndicator(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [loading])

  const currentTime = useMemo(() => getCurrentTimeInMinutes(now), [now])

  const windowDir1 = schedule ? getScheduleWindow(schedule.direction1, currentTime) : { nextTrip: null, followingTrips: [], previousTrip: null }
  const windowDir2 = schedule ? getScheduleWindow(schedule.direction2, currentTime) : { nextTrip: null, followingTrips: [], previousTrip: null }

  return (
    <div className="w-full space-y-5">
      {loading && showLoadingIndicator && (
        <div className="flex flex-col items-center gap-3 py-10 text-black/70">
          <span className="loading loading-spinner loading-lg text-black" />
          <p className="text-sm sm:text-base font-normal text-black">загружаем расписание…</p>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <span className="text-black">{error}</span>
        </div>
      )}

      {!loading && rawData && !schedule && !error && (
        <div className="alert alert-error">
          <span className="text-black">Не удалось обработать данные расписания для маршрута {routeNumber}.</span>
        </div>
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
          />

          {schedule.direction2.length > 0 && (
            <DirectionCard
              directionName={schedule.direction2Name}
              nextTrip={windowDir2.nextTrip}
              followingTrips={windowDir2.followingTrips}
              previousTrip={windowDir2.previousTrip}
              routeNumber={routeNumber}
              cardIndex={1}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default MarshrutkaWidget

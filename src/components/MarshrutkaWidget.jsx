import { useState, useEffect, useMemo } from 'react'
import { useNow } from '../context/TimeContext'
import { loadScheduleRaw } from '../utils/schedule/loadSchedule'
import { processScheduleForWidget } from '../utils/schedule/processSchedule'
import { formatTime, formatTimeUntil, getCurrentTimeInMinutes } from '../utils/schedule/formatTime'
import { getScheduleWindow } from '../utils/schedule/getScheduleWindow'

const LadozhskayaStopNotice = () => (
  <div className="rounded-lg bg-amber-50 px-3 py-2.5 space-y-0.5">
    <p className="text-sm font-medium text-amber-900">Остановка переехала</p>
    <p className="text-sm text-amber-900 [text-wrap:pretty]">
      Теперь садимся не справа от перехода, а слева, у павильона с табличкой «533»
    </p>
  </div>
)

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
  const { nextTrip: nextTrip1, followingTrips: followingTrips1, previousTrip: previousTrip1 } = windowDir1
  const { nextTrip: nextTrip2, followingTrips: followingTrips2, previousTrip: previousTrip2 } = windowDir2

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
          <div className="card bg-base-100 rounded-xl">
            <div className="card-body gap-4 p-4">
              {nextTrip1 ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-normal text-black">{schedule.direction1Name}</h3>
                      <p className="text-sm text-black/70">
                        {`через ${formatTimeUntil(nextTrip1.minutesUntil)}`}
                        {nextTrip1.isTomorrow ? ' (завтра)' : ''}
                      </p>
                    </div>
                    <div className="text-right self-start">
                      <p className="font-normal text-black" style={{ fontSize: '40px' }}>
                        {formatTime(nextTrip1.time)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {followingTrips1.length > 0 && (
                      <p className="text-sm text-black/80">
                        {`Следующие в ${followingTrips1
                          .slice(0, 3)
                          .map((t) => `${formatTime(t.time)}${t.isTomorrow ? ' (завтра)' : ''}`)
                          .join(', ')}`}
                      </p>
                    )}
                    {previousTrip1 && (
                      <p className="text-sm text-black/80">
                        {`Предыдущая в ${formatTime(previousTrip1.time)}${previousTrip1.isTomorrow ? ' (завтра)' : ''}`}
                      </p>
                    )}
                  </div>
                  {routeNumber === '533' && schedule.direction1Name === 'С Ладожской' && (
                    <LadozhskayaStopNotice />
                  )}
                </div>
              ) : (
                <div className="alert alert-info">
                  <span className="text-black">нет данных по этому направлению.</span>
                </div>
              )}
            </div>
          </div>

          {schedule.direction2.length > 0 && (
            <div className="card bg-base-100 rounded-xl">
              <div className="card-body gap-4 p-4">
                {nextTrip2 ? (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-normal text-black">{schedule.direction2Name}</h3>
                        <p className="text-sm text-black/70">
                          {`через ${formatTimeUntil(nextTrip2.minutesUntil)}`}
                          {nextTrip2.isTomorrow ? ' (завтра)' : ''}
                        </p>
                      </div>
                      <div className="text-right self-start">
                        <p className="font-normal text-black" style={{ fontSize: '40px' }}>
                          {formatTime(nextTrip2.time)}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {followingTrips2.length > 0 && (
                        <p className="text-sm text-black/80">
                          {`Следующие в ${followingTrips2
                            .slice(0, 3)
                            .map((t) => `${formatTime(t.time)}${t.isTomorrow ? ' (завтра)' : ''}`)
                            .join(', ')}`}
                        </p>
                      )}
                      {previousTrip2 && (
                        <p className="text-sm text-black/80">
                          {`Предыдущая в ${formatTime(previousTrip2.time)}${previousTrip2.isTomorrow ? ' (завтра)' : ''}`}
                        </p>
                      )}
                    </div>
                    {routeNumber === '533' && schedule.direction2Name === 'С Ладожской' && (
                      <LadozhskayaStopNotice />
                    )}
                  </div>
                ) : (
                  <div className="alert alert-info">
                    <span className="text-black">нет данных по этому направлению.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MarshrutkaWidget

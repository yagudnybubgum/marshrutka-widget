import { useState, useEffect, useMemo } from 'react'
import { useNow } from '../context/TimeContext'
import { ROUTES_FROM_LADOZHSKAYA, getRouteColor } from '../config/routes'
import { loadSchedulesRaw } from '../utils/schedule/loadSchedule'
import { extractLadozhskayaDepartures } from '../utils/schedule/processSchedule'
import { formatTime, formatTimeUntil, getCurrentTimeInMinutes } from '../utils/schedule/formatTime'
import { ArrowRightIcon } from './icons'

const FromLadozhskaya = ({ active = false }) => {
  const [rawSchedules, setRawSchedules] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [visibleCount, setVisibleCount] = useState(12)
  const now = useNow()

  useEffect(() => {
    if (!active) return

    let cancelled = false

    const loadAllSchedules = async () => {
      setLoading(true)
      setError(null)

      try {
        const routeIds = ROUTES_FROM_LADOZHSKAYA.map((r) => r.id)
        const results = await loadSchedulesRaw(routeIds)
        if (cancelled) return

        setRawSchedules(results.filter((r) => r.data))
        setLoading(false)
      } catch {
        if (cancelled) return
        setError('Не удалось загрузить расписания')
        setLoading(false)
      }
    }

    loadAllSchedules()

    return () => {
      cancelled = true
    }
  }, [active])

  const allDepartures = useMemo(() => {
    const departures = []

    for (const { routeId, data } of rawSchedules) {
      const route = ROUTES_FROM_LADOZHSKAYA.find((r) => r.id === routeId)
      const times = extractLadozhskayaDepartures(data, now)
      times.forEach((time) => {
        departures.push({
          routeId,
          routeName: route.name,
          destination: route.destination,
          time,
        })
      })
    }

    return departures
  }, [rawSchedules, now])

  const currentTime = useMemo(() => getCurrentTimeInMinutes(now), [now])

  const sortedDepartures = useMemo(() => {
    const minutesInDay = 24 * 60

    return allDepartures
      .map((dep) => {
        let minutesUntil = dep.time - currentTime
        let isTomorrow = false

        if (minutesUntil < 0) {
          minutesUntil += minutesInDay
          isTomorrow = true
        }

        return {
          ...dep,
          minutesUntil,
          isTomorrow,
        }
      })
      .sort((a, b) => a.minutesUntil - b.minutesUntil)
  }, [allDepartures, currentTime])

  const todayDepartures = useMemo(() => {
    return sortedDepartures.filter((dep) => !dep.isTomorrow)
  }, [sortedDepartures])

  const upcomingDepartures = todayDepartures.slice(0, visibleCount)
  const hasMore = todayDepartures.length > visibleCount

  if (!active) {
    return null
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-black/70">
        <span className="loading loading-spinner loading-lg text-black" />
        <p className="text-sm sm:text-base font-normal text-black">загружаем расписания…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span className="text-black">{error}</span>
      </div>
    )
  }

  if (upcomingDepartures.length === 0) {
    return (
      <div className="alert alert-info">
        <span className="text-black">Нет данных о расписании с Ладожской</span>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="divide-y divide-gray-100">
        {upcomingDepartures.map((dep, index) => (
          <div
            key={`${dep.routeId}-${dep.time}-${index}`}
            className="flex items-center justify-between py-4"
          >
            <div className="flex items-center gap-3">
              <span className={`px-5 py-2 rounded-full text-sm font-medium ${getRouteColor(dep.routeId)}`}>
                {dep.routeName}
              </span>
              <div className="flex flex-col">
                <span className="inline-flex items-center gap-1 text-sm text-black/70">
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                  {dep.destination}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-black/60">{formatTimeUntil(dep.minutesUntil)}</span>
              <span className="text-xl font-normal text-black/80">{formatTime(dep.time)}</span>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="px-5 py-2 text-base font-normal text-black/70 hover:text-black transition-colors"
          >
            Показать ещё
          </button>
        </div>
      )}

      {!hasMore && todayDepartures.length > 0 && (
        <div className="mt-4 text-center text-sm text-black/50">Больше рейсов сегодня нет</div>
      )}
    </div>
  )
}

export default FromLadozhskaya

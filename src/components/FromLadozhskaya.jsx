import { useState, useEffect, useMemo } from 'react'
import { useNow } from '../context/TimeContext'
import { ROUTES_FROM_LADOZHSKAYA } from '../config/routes'
import { loadSchedulesRaw } from '../utils/schedule/loadSchedule'
import { extractLadozhskayaDepartures } from '../utils/schedule/processSchedule'
import { formatTime, formatTimeUntil, getCurrentTimeInMinutes } from '../utils/schedule/formatTime'
import { Alert, DepartureRow, EmptyState } from './ui'

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
      <div className="w-full" aria-busy="true" aria-label="Загрузка расписания">
        <div className="divide-y divide-ink/5">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex items-center justify-between py-4" aria-hidden>
              <div className="flex items-center gap-3">
                <div className="skeleton h-9 w-16 rounded-full" />
                <div className="skeleton h-4 w-28" />
              </div>
              <div className="flex items-center gap-3">
                <div className="skeleton h-4 w-16" />
                <div className="skeleton h-7 w-14" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <Alert>{error}</Alert>
  }

  if (upcomingDepartures.length === 0) {
    return <EmptyState>Нет данных о расписании с Ладожской</EmptyState>
  }

  return (
    <div className="w-full">
      <div className="divide-y divide-ink/5">
        {upcomingDepartures.map((dep, index) => (
          <DepartureRow
            key={`${dep.routeId}-${dep.time}-${index}`}
            routeId={dep.routeId}
            routeName={dep.routeName}
            destination={dep.destination}
            untilLabel={formatTimeUntil(dep.minutesUntil)}
            timeLabel={formatTime(dep.time)}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="px-5 py-2 text-base font-normal text-ink/70 hover:text-ink transition-colors"
          >
            Показать ещё
          </button>
        </div>
      )}

      {!hasMore && todayDepartures.length > 0 && (
        <div className="mt-4 text-center text-sm text-ink/70">Больше рейсов сегодня нет</div>
      )}
    </div>
  )
}

export default FromLadozhskaya

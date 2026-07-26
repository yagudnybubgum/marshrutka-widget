import { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNow } from '../context/TimeContext'
import { isWeekendOrHoliday } from '../utils/holidays'
import { loadScheduleRaw } from '../utils/schedule/loadSchedule'
import { processScheduleForFull } from '../utils/schedule/processSchedule'
import { formatTime, getCurrentTimeInMinutes } from '../utils/schedule/formatTime'
import { ChevronLeftIcon } from './icons'

const FullSchedule = ({ routeNumber = '533', onBack }) => {
  const [scheduleData, setScheduleData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [headerVisible, setHeaderVisible] = useState(true)
  const [searchParams] = useSearchParams()
  const lastScrollTopRef = useRef(0)
  const scrollContainerRef = useRef(null)
  const focusCellRef = useRef(null)
  const hasScrolledToFocusRef = useRef(false)
  const now = useNow()

  const focusDir = searchParams.get('dir')
  const focusTimeParam = searchParams.get('t')
  const focusTime = focusTimeParam !== null && focusTimeParam !== ''
    ? Number(focusTimeParam)
    : null

  const isWeekend = isWeekendOrHoliday(now)
  const [activeTab, setActiveTab] = useState(isWeekend ? 'weekend' : 'weekday')

  useEffect(() => {
    setActiveTab(isWeekend ? 'weekend' : 'weekday')
  }, [isWeekend])

  useEffect(() => {
    hasScrolledToFocusRef.current = false
  }, [routeNumber, focusDir, focusTime])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const rawData = await loadScheduleRaw(routeNumber)
        if (cancelled) return

        const processedData = processScheduleForFull(rawData)
        if (!processedData) {
          throw new Error('Не удалось обработать данные расписания')
        }

        setScheduleData(processedData)
        setLoading(false)
      } catch {
        if (cancelled) return
        setError('Не удалось загрузить файл расписания.')
        setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [routeNumber])

  useEffect(() => {
    if (!scheduleData) return

    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const handleScroll = () => {
      const currentScrollTop = scrollContainer.scrollTop
      const lastScrollTop = lastScrollTopRef.current
      const scrollHeight = scrollContainer.scrollHeight
      const clientHeight = scrollContainer.clientHeight

      if (currentScrollTop <= 0) {
        setHeaderVisible(true)
        lastScrollTopRef.current = 0
        return
      }

      const distanceFromBottom = scrollHeight - currentScrollTop - clientHeight
      if (distanceFromBottom < 50) {
        lastScrollTopRef.current = currentScrollTop
        return
      }

      if (currentScrollTop > lastScrollTop && currentScrollTop > 50) {
        setHeaderVisible(false)
      } else if (currentScrollTop < lastScrollTop) {
        setHeaderVisible(true)
      }

      lastScrollTopRef.current = currentScrollTop
    }

    scrollContainer.addEventListener('scroll', handleScroll)
    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [scheduleData])

  const activeColumns = useMemo(() => {
    if (!scheduleData) return []

    if (!scheduleData.hasPeriodInfo) {
      return scheduleData.columns
    }

    const targetPeriod = activeTab === 'weekday' ? 'Будние дни' : 'Выходные дни'
    return scheduleData.columns.filter((col) => col.period === targetPeriod)
  }, [scheduleData, activeTab])

  const currentTime = getCurrentTimeInMinutes(now)

  const nearestTimeIdxByCol = useMemo(() => {
    return activeColumns.map((col) => {
      const nextIdx = col.times.findIndex((t) => t >= currentTime)
      return nextIdx === -1 ? 0 : nextIdx
    })
  }, [activeColumns, currentTime])

  const focusedSlot = useMemo(() => {
    if (!focusDir || focusTime === null || Number.isNaN(focusTime)) return null

    const colIdx = activeColumns.findIndex((col) => col.name === focusDir)
    if (colIdx === -1) return null

    const timeIdx = activeColumns[colIdx].times.findIndex((time) => time === focusTime)
    if (timeIdx === -1) return null

    return { colIdx, timeIdx }
  }, [activeColumns, focusDir, focusTime])

  useEffect(() => {
    if (!focusedSlot || loading || hasScrolledToFocusRef.current) return

    let cancelled = false

    const tryScroll = () => {
      const el = focusCellRef.current
      const container = scrollContainerRef.current
      if (!el || !container) return false

      const elRect = el.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      const offset = elRect.top - containerRect.top + container.scrollTop
      container.scrollTo({
        top: Math.max(0, offset - container.clientHeight / 3),
        behavior: 'smooth',
      })
      hasScrolledToFocusRef.current = true
      return true
    }

    const frame = requestAnimationFrame(() => {
      if (cancelled) return
      if (tryScroll()) return
      requestAnimationFrame(() => {
        if (!cancelled) tryScroll()
      })
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [focusedSlot, loading, activeColumns])

  if (loading) {
    return (
      <div className="h-[100dvh] bg-surface-muted flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-ink/70">
          <span className="loading loading-spinner loading-lg text-ink" />
          <p className="text-sm font-normal">загружаем расписание…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[100dvh] bg-surface-muted flex items-center justify-center">
        <div className="rounded-xl bg-danger px-4 py-3 text-danger-ink" role="alert">
          {error}
        </div>
      </div>
    )
  }

  if (!scheduleData || scheduleData.columns.length === 0) {
    return (
      <div className="h-[100dvh] bg-surface-muted flex items-center justify-center">
        <div className="rounded-xl bg-surface-sunken px-4 py-3 text-ink/70">
          Нет данных расписания
        </div>
      </div>
    )
  }

  return (
    <div className="h-[100dvh] bg-surface-muted flex flex-col relative">
      <div
        className={`absolute top-0 left-0 right-0 z-20 bg-surface-muted px-4 pt-6 pb-4 transition-transform duration-300 ${
          headerVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center">
          <button
            onClick={onBack}
            className="text-ink hover:text-ink/70 transition-colors flex items-center gap-1 text-sm font-normal"
          >
            <ChevronLeftIcon />
            назад
          </button>
          <h1 className="text-xl font-normal text-ink flex-1 text-center">
            Маршрутка {routeNumber}
          </h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <div className={`h-full max-w-7xl mx-auto ${headerVisible ? 'pt-20' : 'pt-0'}`}>
          <div ref={scrollContainerRef} className="h-full overflow-y-auto pb-4 px-4">
            <div className="sticky top-0 bg-surface-muted z-20">
              {scheduleData?.hasPeriodInfo && (
                <div className="flex gap-2 mb-4 pt-1">
                  <button
                    onClick={() => setActiveTab('weekday')}
                    className={`flex-1 px-5 py-2 text-base font-normal rounded-full transition-colors ${
                      activeTab === 'weekday'
                        ? 'bg-accent-soft text-accent-ink'
                        : 'text-ink/70 hover:text-ink'
                    }`}
                  >
                    Будние дни
                  </button>
                  <button
                    onClick={() => setActiveTab('weekend')}
                    className={`flex-1 px-5 py-2 text-base font-normal rounded-full transition-colors ${
                      activeTab === 'weekend'
                        ? 'bg-accent-soft text-accent-ink'
                        : 'text-ink/70 hover:text-ink'
                    }`}
                  >
                    Выходные дни
                  </button>
                </div>
              )}

              <div className="flex">
                {activeColumns.map((col, idx) => (
                  <div
                    key={idx}
                    className="flex-1 text-left px-3 py-3 text-sm font-normal text-ink/70 border-b border-ink/20"
                  >
                    {col.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex">
              {activeColumns.map((col, colIdx) => (
                <div key={colIdx} className="flex-1">
                  {col.times.map((time, timeIdx) => {
                    const isFocused =
                      focusedSlot?.colIdx === colIdx && focusedSlot?.timeIdx === timeIdx
                    const isNearestUpcoming =
                      !focusedSlot && nearestTimeIdxByCol[colIdx] === timeIdx
                    const isHighlighted = isFocused || isNearestUpcoming

                    return (
                      <div
                        key={timeIdx}
                        ref={isFocused ? focusCellRef : undefined}
                        className={`px-3 py-3 text-sm border-b border-ink/10 ${
                          isHighlighted ? 'bg-highlight text-accent-ink font-semibold' : 'text-ink'
                        }`}
                      >
                        {formatTime(time)}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            <div className="mt-8 pb-8 flex justify-center">
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs text-ink/70">Источник расписания</p>
                <a
                  href="https://vk.com/doc546677069_685452050?hash=DNg9ALCXkg2QX3cQxTPS3fy3eG1D449zfQ9zZtxAuvk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-ink/70 hover:text-ink transition-colors"
                >
                  https://vk.com/doc546677069_685452050
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FullSchedule

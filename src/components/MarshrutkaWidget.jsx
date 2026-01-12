import { useState, useEffect, useMemo, useRef } from 'react'
import * as XLSX from 'xlsx'
import { isWeekendOrHoliday } from '../utils/holidays'

const MarshrutkaWidget = ({ routeNumber = '533', onScheduleChange }) => {
  const [schedule, setSchedule] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  // Автоматическая загрузка файла при старте или изменении маршрута
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/d1583780-0508-4307-9920-67e4adfcc8a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MarshrutkaWidget.jsx:10',message:'routeNumber changed in widget, resetting state',data:{routeNumber,prevSchedule:schedule,prevLoading:loading},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    // Сбрасываем состояние при смене маршрута
    setSchedule(null)
    setError(null)
    setLoading(true)
    loadScheduleFile()
  }, [routeNumber])

  const loadScheduleFile = async () => {
    try {
      // Определяем base path из Vite env или из текущего location
      const getBasePath = () => {
        // Используем BASE_URL из Vite (всегда правильный)
        const viteBase = import.meta.env.BASE_URL
        if (viteBase && viteBase !== '/') {
          return viteBase
        }
        // Fallback: определяем из window.location
        const path = window.location.pathname
        if (path.includes('/marshrutka-widget/')) {
          return '/marshrutka-widget/'
        }
        return '/'
      }
      
      const basePath = getBasePath()
      const filePath = `${basePath}schedule-${routeNumber}.xlsx`.replace(/\/\//g, '/') // Убираем двойные слэши
      console.log('Загрузка файла по пути:', filePath, 'BASE_URL:', import.meta.env.BASE_URL, 'location.pathname:', window.location.pathname)
      
      const response = await fetch(filePath)
      if (!response.ok) {
        console.error('Ошибка загрузки:', response.status, response.statusText, 'URL:', filePath)
        throw new Error(`Файл расписания не найден (${response.status})`)
      }
      const arrayBuffer = await response.arrayBuffer()
      const data = new Uint8Array(arrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: null })
      
      // Отладка: выводим первые строки файла
      console.log(`Excel файл для маршрута ${routeNumber} загружен. Первые 10 строк:`, jsonData.slice(0, 10))
      
      const processedSchedule = processScheduleData(jsonData)
      console.log(`Обработанное расписание для маршрута ${routeNumber}:`, processedSchedule)
      
      if (!processedSchedule) {
        console.warn(`Не удалось обработать данные для маршрута ${routeNumber}. Проверьте формат файла.`)
        setError(`Не удалось обработать данные расписания для маршрута ${routeNumber}. Проверьте формат файла.`)
        setLoading(false)
        return
      }
      
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/d1583780-0508-4307-9920-67e4adfcc8a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MarshrutkaWidget.jsx:64',message:'Schedule loaded, updating state',data:{routeNumber,hasSchedule:!!processedSchedule,scrollY:window.scrollY},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      setSchedule(processedSchedule)
      onScheduleChange?.(processedSchedule)
      setLoading(false)
    } catch (err) {
      console.error('Ошибка загрузки файла:', err)
      setError(`Не удалось загрузить файл расписания для маршрута ${routeNumber}. Проверьте, что файл schedule-${routeNumber}.xlsx находится в папке public.`)
      setLoading(false)
    }
  }

  const processScheduleData = (data) => {
    if (data.length < 2) {
      console.warn('Недостаточно строк в данных:', data.length)
      return null
    }

    const today = new Date()
    const isWeekend = isWeekendOrHoliday(today)

    const firstRow = data[0] || []
    const secondRow = data[1] || []
    
    // Проверяем, есть ли в первой строке указание на период (будние/выходные)
    const hasPeriodInfo = firstRow.some(cell => {
      const value = cell ? cell.toString().toLowerCase() : ''
      return value.includes('будн') || value.includes('выходн')
    })

    let periodRow, directionRow, bodyRows

    if (hasPeriodInfo) {
      // Формат с периодом (как в 533): строка 1 = период, строка 2 = направления, строка 3+ = время
      periodRow = firstRow
      directionRow = secondRow
      bodyRows = data.slice(2)
    } else {
      // Формат без периода (как в 429): строка 1 = направления, строка 2+ = время
      periodRow = []
      directionRow = firstRow
      bodyRows = data.slice(1)
    }

    console.log('Первая строка (период):', periodRow)
    console.log('Строка направлений:', directionRow)
    console.log('Количество строк с данными:', bodyRows.length)
    console.log('Есть информация о периоде:', hasPeriodInfo)

    const columnMeta = hasPeriodInfo 
      ? periodRow.map((cell, idx) => {
          const value = cell ? cell.toString().toLowerCase() : ''
          if (value.includes('будн')) return { idx, type: 'weekday' }
          if (value.includes('выходн')) return { idx, type: 'weekend' }
          return { idx, type: null }
        })
      : directionRow.map((cell, idx) => {
          // Если нет информации о периоде, все колонки считаем будними
          return { idx, type: 'weekday' }
        })
    
    console.log('Метаданные колонок:', columnMeta)

    const formatDirectionName = (name) => {
      if (!name) return name
      const nameStr = name.toString().trim()
      
      // Обработка для маршрута 533 (Янино - Ладожская)
      if (nameStr.includes('Янино') && nameStr.includes('Ладожская')) {
        if (/Янино.*[=_]?[=>].*Ладожская/i.test(nameStr)) {
          return 'Из Янино'
        }
        if (/Ладожская.*[=_]?[=>].*Янино/i.test(nameStr)) {
          return 'С Ладожской'
        }
      }
      
      // Обработка для маршрута 429 (Разметелево - Ладожская)
      if (nameStr.includes('Разметелево')) {
        return 'Из Разметелево'
      }
      if (nameStr.includes('Ладожская')) {
        return 'С Ладожской'
      }
      
      // Обработка для маршрута 664 (Янино - МЕГА Дыбенко)
      if (nameStr.includes('МЕГА') || nameStr.includes('Дыбенко')) {
        return 'От "МЕГА Дыбенко"'
      }
      if (nameStr.includes('Янино') && !nameStr.includes('Ладожская')) {
        return 'Из Янино'
      }
      
      return name
    }

    const extractTimesForColumn = (colIdx) =>
      bodyRows
        .map(row => parseTime(row ? row[colIdx] : null))
        .filter(time => time !== null)
        .sort((a, b) => a - b)

    const buildDirections = (type) =>
      columnMeta
        .filter(col => col.type === type)
        .map(col => ({
          name: formatDirectionName(directionRow[col.idx] || ''),
          times: extractTimesForColumn(col.idx)
        }))
        .filter(dir => dir.times.length > 0)

    const weekdayDirections = buildDirections('weekday')
    const weekendDirections = buildDirections('weekend')

    console.log('Направления будних дней:', weekdayDirections)
    console.log('Направления выходных дней:', weekendDirections)

    const activeDirections = (() => {
      // Если формат без периода, используем будние направления для всех дней
      if (!hasPeriodInfo) {
        return weekdayDirections.length ? weekdayDirections : []
      }
      // Если формат с периодом, выбираем по типу дня
      if (isWeekend && weekendDirections.length) return weekendDirections
      if (!isWeekend && weekdayDirections.length) return weekdayDirections
      return weekdayDirections.length ? weekdayDirections : weekendDirections
    })()

    console.log('Активные направления:', activeDirections)

    if (!activeDirections.length) {
      console.warn('Нет активных направлений для обработки')
      return null
    }

    const primary = activeDirections[0]
    const secondary = activeDirections.length > 1 ? activeDirections[1] : null

    return {
      direction1: primary.times,
      direction2: secondary ? secondary.times : [],
      direction1Name: primary.name || 'Направление 1',
      direction2Name: secondary ? secondary.name || 'Направление 2' : 'Направление 2',
      isWeekend
    }
  }

  const parseTime = (value) => {
    if (value === null || value === undefined || value === '') return null
    
    // Если это число от 0 до 1, это время в формате Excel (0 = 00:00, 1 = 24:00)
    if (typeof value === 'number') {
      if (value >= 0 && value < 1) {
        const totalMinutes = Math.round(value * 24 * 60)
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60
        return hours * 60 + minutes
      }
      // Если число от 0 до 1439 (минуты в дне), это уже минуты
      if (value >= 0 && value < 1440 && value % 1 === 0) {
        return value
      }
      // Если число от 0 до 23, считаем это часами
      if (value >= 0 && value < 24) {
        return Math.floor(value) * 60
      }
    }
    
    const str = value.toString().trim()
    
    // Пытаемся распарсить время в формате HH:MM или HH.MM
    const timeMatch = str.match(/(\d{1,2})[:.](\d{2})/)
    if (timeMatch) {
      const hours = parseInt(timeMatch[1], 10)
      const minutes = parseInt(timeMatch[2], 10)
      if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
        return hours * 60 + minutes
      }
    }
    
    return null
  }

  const getCurrentTimeInMinutes = () => {
    const now = new Date()
    return now.getHours() * 60 + now.getMinutes()
  }

  const getScheduleWindow = (times, currentTime, followingCount = 3) => {
    if (!times || times.length === 0) {
      return { nextTrip: null, followingTrips: [], previousTrip: null }
    }

    const minutesInDay = 24 * 60
    let nextIndex = times.findIndex(time => time >= currentTime)
    let baseOffset = 0

    if (nextIndex === -1) {
      nextIndex = 0
      baseOffset = 1
    }

    const buildTrip = (index, dayOffset) => {
      const absoluteTime = times[index] + dayOffset * minutesInDay
      return {
        time: times[index],
        minutesUntil: absoluteTime - currentTime,
        isTomorrow: dayOffset > 0
      }
    }

    // Находим предыдущую маршрутку
    let previousIndex = nextIndex - 1
    let previousOffset = baseOffset
    if (previousIndex < 0) {
      previousIndex = times.length - 1
      previousOffset = baseOffset - 1
    }
    const previousTrip = previousOffset >= 0 ? buildTrip(previousIndex, previousOffset) : null

    const nextTrip = buildTrip(nextIndex, baseOffset)
    const followingTrips = []

    for (let i = 1; i <= followingCount; i++) {
      const rawIndex = nextIndex + i
      const wrappedIndex = rawIndex % times.length
      const wrapOffset = baseOffset + Math.floor(rawIndex / times.length)
      followingTrips.push(buildTrip(wrappedIndex, wrapOffset))
    }

    return { nextTrip, followingTrips, previousTrip }
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60) % 24
    const mins = minutes % 60
    return `${hours}:${mins.toString().padStart(2, '0')}`
  }

  const formatTimeUntil = (minutes) => {
    if (minutes < 60) {
      return `${minutes} мин`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours} ч. ${mins} мин` : `${hours} ч.`
  }

  // Обновляем текущее время каждую секунду для точного отображения
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000) // Обновляем каждую секунду
    
    return () => clearInterval(interval)
  }, [])

  const currentTime = useMemo(() => getCurrentTimeInMinutes(), [now])

  const windowDir1 = schedule ? getScheduleWindow(schedule.direction1, currentTime) : { nextTrip: null, followingTrips: [], previousTrip: null }
  const windowDir2 = schedule ? getScheduleWindow(schedule.direction2, currentTime) : { nextTrip: null, followingTrips: [], previousTrip: null }
  const nextTrip1 = windowDir1.nextTrip
  const nextTrip2 = windowDir2.nextTrip
  const followingTrips1 = windowDir1.followingTrips
  const followingTrips2 = windowDir2.followingTrips
  const previousTrip1 = windowDir1.previousTrip
  const previousTrip2 = windowDir2.previousTrip

  // #region agent log
  const widgetRef = useRef(null);
  useEffect(() => {
    fetch('http://127.0.0.1:7244/ingest/d1583780-0508-4307-9920-67e4adfcc8a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MarshrutkaWidget.jsx:324',message:'MarshrutkaWidget render',data:{routeNumber,loading,hasSchedule:!!schedule,hasError:!!error,widgetHeight:widgetRef.current?.offsetHeight,scrollY:window.scrollY},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
  });
  // #endregion
  return (
    <div ref={widgetRef} className="w-full space-y-5 min-h-[400px]">
      {loading && (
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

      {schedule && !loading && (
        <>
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
                    <div className="divider my-0"></div>
                      <div className="space-y-2">
                        {followingTrips1.length > 0 && (
                          <p className="text-sm text-black/80">
                          {`Следующие в ${followingTrips1
                            .slice(0, 3)
                            .map(t => `${formatTime(t.time)}${t.isTomorrow ? ' (завтра)' : ''}`)
                            .join(', ')}`}
                        </p>
                      )}
                        {previousTrip1 && (
                          <p className="text-sm text-black/80">
                            {`Предыдущая в ${formatTime(previousTrip1.time)}${previousTrip1.isTomorrow ? ' (завтра)' : ''}`}
                          </p>
                        )}
                      </div>
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
                          <h3 className="text-xl font-normal text-black">
                            {schedule.direction2Name}
                          </h3>
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
                      <div className="divider my-0"></div>
                      <div className="space-y-2">
                        {followingTrips2.length > 0 && (
                          <p className="text-sm text-black/80">
                            {`Следующие в ${followingTrips2
                              .slice(0, 3)
                              .map(t => `${formatTime(t.time)}${t.isTomorrow ? ' (завтра)' : ''}`)
                              .join(', ')}`}
                          </p>
                        )}
                        {previousTrip2 && (
                          <p className="text-sm text-black/80">
                            {`Предыдущая в ${formatTime(previousTrip2.time)}${previousTrip2.isTomorrow ? ' (завтра)' : ''}`}
                          </p>
                        )}
                      </div>
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
        </>
      )}

      {!schedule && !error && !loading && (
        <div className="hero py-10 bg-base-200 rounded-2xl">
          <div className="hero-content text-center">
            <div className="max-w-md space-y-2">
              <h2 className="text-2xl font-normal text-black">добавьте расписание</h2>
              <p className="text-black/70">
                поместите файл <code>schedule-{routeNumber}.xlsx</code> в папку <code>public</code>, и мы автоматически подтянем данные.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MarshrutkaWidget

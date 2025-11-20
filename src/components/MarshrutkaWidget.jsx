import { useState, useEffect, useMemo } from 'react'
import * as XLSX from 'xlsx'

const MarshrutkaWidget = ({ onScheduleChange }) => {
  const [schedule, setSchedule] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  // Автоматическая загрузка файла при старте
  useEffect(() => {
    loadScheduleFile()
  }, [])

  const loadScheduleFile = async () => {
    try {
      // Определяем base path из текущего location или из Vite env
      const getBasePath = () => {
        // Если есть BASE_URL из Vite, используем его
        if (import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/') {
          return import.meta.env.BASE_URL
        }
        // Иначе определяем из window.location
        const path = window.location.pathname
        // Если путь содержит /marshrutka-widget/, используем его как base
        if (path.includes('/marshrutka-widget/')) {
          return '/marshrutka-widget/'
        }
        return '/'
      }
      
      const basePath = getBasePath()
      const filePath = `${basePath}schedule.xlsx`.replace(/\/\//g, '/') // Убираем двойные слэши
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
      console.log('Excel файл загружен. Первые 10 строк:', jsonData.slice(0, 10))
      
      const processedSchedule = processScheduleData(jsonData)
      console.log('Обработанное расписание:', processedSchedule)
      setSchedule(processedSchedule)
      onScheduleChange?.(processedSchedule)
      setLoading(false)
    } catch (err) {
      console.error('Ошибка загрузки файла:', err)
      setError('Не удалось загрузить файл расписания. Проверьте, что файл schedule.xlsx находится в папке public.')
      setLoading(false)
    }
  }

  const processScheduleData = (data) => {
    if (data.length < 3) return null

    const today = new Date()
    const dayOfWeek = today.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    const periodRow = data[0] || []
    const directionRow = data[1] || []
    const bodyRows = data.slice(2)

    const columnMeta = periodRow.map((cell, idx) => {
      const value = cell ? cell.toString().toLowerCase() : ''
      if (value.includes('будн')) return { idx, type: 'weekday' }
      if (value.includes('выходн')) return { idx, type: 'weekend' }
      return { idx, type: null }
    })

    const formatDirectionName = (name) => {
      if (!name) return name
      const nameStr = name.toString().trim()
      if (nameStr.includes('Янино') && nameStr.includes('Ладожская')) {
        if (/Янино.*[=_]?[=>].*Ладожская/i.test(nameStr)) {
          return 'Из Янино'
        }
        if (/Ладожская.*[=_]?[=>].*Янино/i.test(nameStr)) {
          return 'С Ладожской'
        }
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

    const activeDirections = (() => {
      if (isWeekend && weekendDirections.length) return weekendDirections
      if (!isWeekend && weekdayDirections.length) return weekdayDirections
      return weekdayDirections.length ? weekdayDirections : weekendDirections
    })()

    if (!activeDirections.length) return null

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
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
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

  return (
    <div className="w-full space-y-5">
      {loading && (
        <div className="flex flex-col items-center gap-3 py-10 text-black/70">
          <span className="loading loading-spinner loading-lg text-black" />
          <p className="text-sm sm:text-base font-normal text-black">Загружаем расписание…</p>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <span className="text-black">{error}</span>
        </div>
      )}

      {schedule && !loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card bg-base-100 rounded-none">
              <div className="card-body gap-4 p-4">
                {nextTrip1 ? (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-normal text-black">{schedule.direction1Name}</h3>
                        <p className="text-sm text-black/70">
                          {`Через ${formatTimeUntil(nextTrip1.minutesUntil)}`}
                          {nextTrip1.isTomorrow ? ' (завтра)' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-normal text-black" style={{ fontSize: '40px' }}>
                          {formatTime(nextTrip1.time)}
                        </p>
                      </div>
                    </div>
                    <div className="divider my-0"></div>
                      <div className="space-y-2">
                        {previousTrip1 && (
                          <p className="text-sm text-black/80">
                            {`Прошлая была в ${formatTime(previousTrip1.time)}${previousTrip1.isTomorrow ? ' (завтра)' : ''}`}
                          </p>
                        )}
                        {followingTrips1.length > 0 && (
                          <p className="text-sm text-black/80">
                          {`После в ${followingTrips1
                            .slice(0, 3)
                            .map(t => `${formatTime(t.time)}${t.isTomorrow ? ' (завтра)' : ''}`)
                            .join(', ')}`}
                        </p>
                      )}
                      </div>
                  </div>
                ) : (
                  <div className="alert alert-info">
                    <span className="text-black">Нет данных по этому направлению.</span>
                  </div>
                )}
              </div>
            </div>

            {schedule.direction2.length > 0 && (
              <div className="card bg-base-100 rounded-none">
                <div className="card-body gap-4 p-4">
                  {nextTrip2 ? (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="text-xl font-normal text-black">
                            {schedule.direction2Name}
                          </h3>
                          <p className="text-sm text-black/70">
                            {`Через ${formatTimeUntil(nextTrip2.minutesUntil)}`}
                            {nextTrip2.isTomorrow ? ' (завтра)' : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-normal text-black" style={{ fontSize: '40px' }}>
                            {formatTime(nextTrip2.time)}
                          </p>
                        </div>
                      </div>
                      <div className="divider my-0"></div>
                      <div className="space-y-2">
                        {previousTrip2 && (
                          <p className="text-sm text-black/80">
                            {`Прошлая была в ${formatTime(previousTrip2.time)}${previousTrip2.isTomorrow ? ' (завтра)' : ''}`}
                          </p>
                        )}
                        {followingTrips2.length > 0 && (
                          <p className="text-sm text-black/80">
                            {`После в ${followingTrips2
                              .slice(0, 3)
                              .map(t => `${formatTime(t.time)}${t.isTomorrow ? ' (завтра)' : ''}`)
                              .join(', ')}`}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="alert alert-info">
                      <span className="text-black">Нет данных по этому направлению.</span>
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
              <h2 className="text-2xl font-normal text-black">Добавьте расписание</h2>
              <p className="text-black/70">
                Поместите файл `schedule.xlsx` в папку `public`, и мы автоматически подтянем данные.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MarshrutkaWidget

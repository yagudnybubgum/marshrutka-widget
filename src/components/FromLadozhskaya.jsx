import { useState, useEffect, useMemo } from 'react'
import * as XLSX from 'xlsx'
import { isWeekendOrHoliday } from '../utils/holidays'

// Маршрутки которые идут с Ладожской
const ROUTES_FROM_LADOZHSKAYA = [
  { id: '533', name: '533', destination: 'Янино-1' },
  { id: '429', name: '429', destination: 'Разметелево' },
  { id: '430A', name: '430А', destination: 'Ёксолово' },
  { id: '453', name: '453', destination: 'Дубровка' },
]

const FromLadozhskaya = () => {
  const [allDepartures, setAllDepartures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [now, setNow] = useState(new Date())
  const [visibleCount, setVisibleCount] = useState(12)

  // Обновляем время каждую секунду
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const getCurrentTimeInMinutes = () => {
    const now = new Date()
    return now.getHours() * 60 + now.getMinutes()
  }

  const parseTime = (value) => {
    if (value === null || value === undefined || value === '') return null
    
    if (typeof value === 'number') {
      if (value >= 0 && value < 1) {
        const totalMinutes = Math.round(value * 24 * 60)
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60
        return hours * 60 + minutes
      }
      if (value >= 0 && value < 1440 && value % 1 === 0) {
        return value
      }
      if (value >= 0 && value < 24) {
        return Math.floor(value) * 60
      }
    }
    
    const str = value.toString().trim()
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

  const getBasePath = () => {
    const viteBase = import.meta.env.BASE_URL
    if (viteBase && viteBase !== '/') {
      return viteBase
    }
    const path = window.location.pathname
    if (path.includes('/marshrutka-widget/')) {
      return '/marshrutka-widget/'
    }
    return '/'
  }

  const loadScheduleForRoute = async (routeId) => {
    const basePath = getBasePath()
    const filePath = `${basePath}schedule-${routeId}.xlsx`.replace(/\/\//g, '/')
    
    const response = await fetch(filePath)
    if (!response.ok) {
      console.warn(`Не удалось загрузить расписание для маршрута ${routeId}`)
      return null
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const data = new Uint8Array(arrayBuffer)
    const workbook = XLSX.read(data, { type: 'array' })
    
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: null })
    
    return jsonData
  }

  const extractLadozhskayaDepartures = (data, routeId) => {
    if (!data || data.length < 2) return []

    const today = new Date()
    const isWeekend = isWeekendOrHoliday(today)

    const firstRow = data[0] || []
    const secondRow = data[1] || []
    
    const hasPeriodInfo = firstRow.some(cell => {
      const value = cell ? cell.toString().toLowerCase() : ''
      return value.includes('будн') || value.includes('выходн')
    })

    let periodRow, directionRow, bodyRows

    if (hasPeriodInfo) {
      periodRow = firstRow
      directionRow = secondRow
      bodyRows = data.slice(2)
    } else {
      periodRow = []
      directionRow = firstRow
      bodyRows = data.slice(1)
    }

    // Ищем колонки "С Ладожской" (направление в область)
    const ladozhskayaColumnIndexes = []
    
    directionRow.forEach((cell, idx) => {
      if (!cell) return
      const name = cell.toString().toLowerCase()
      
      // Проверяем что колонка содержит "ладожская"
      if (!name.includes('ладожская')) return
      
      // Определяем это направление ОТ Ладожской или К Ладожской
      let isFromLadozhskaya = false
      
      // Формат со стрелкой: "Ладожская_=>_Янино1" - от Ладожской
      if (name.includes('=>') || name.includes('->') || name.includes('–')) {
        const parts = name.split(/=>|->|–|_=>_|_->_/)
        if (parts.length >= 2) {
          const firstPart = parts[0].trim().toLowerCase()
          isFromLadozhskaya = firstPart.includes('ладожская')
        }
      } else {
        // Формат без стрелки: "ст. м. Ладожская" или "ст. м Ладожская"
        // В таких файлах колонки идут парами: [из деревни, с Ладожской]
        // Для будних: колонки 0,1, для выходных: 2,3
        // Колонка с Ладожской - это нечётный индекс в паре (1, 3, ...)
        // Или если это просто "Ладожская" без названия деревни - это направление С Ладожской
        if (name.includes('ст.') || name.includes('ст ')) {
          // Это формат "ст. м. Ладожская" - направление С Ладожской
          isFromLadozhskaya = true
        }
      }
      
      if (isFromLadozhskaya) {
        // Определяем период (будни/выходные)
        let period = 'weekday'
        if (hasPeriodInfo && periodRow[idx]) {
          const periodValue = periodRow[idx].toString().toLowerCase()
          if (periodValue.includes('выходн')) {
            period = 'weekend'
          }
        }
        ladozhskayaColumnIndexes.push({ idx, period })
      }
    })

    // Выбираем нужные колонки в зависимости от дня
    const relevantColumns = ladozhskayaColumnIndexes.filter(col => {
      if (!hasPeriodInfo) return true
      return isWeekend ? col.period === 'weekend' : col.period === 'weekday'
    })

    // Если нет колонок для текущего периода, берем любые
    const columnsToUse = relevantColumns.length > 0 ? relevantColumns : ladozhskayaColumnIndexes

    const times = []
    columnsToUse.forEach(col => {
      bodyRows.forEach(row => {
        const time = parseTime(row ? row[col.idx] : null)
        if (time !== null && !times.includes(time)) {
          times.push(time)
        }
      })
    })

    return times.sort((a, b) => a - b)
  }

  useEffect(() => {
    const loadAllSchedules = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const departures = []
        
        for (const route of ROUTES_FROM_LADOZHSKAYA) {
          try {
            const data = await loadScheduleForRoute(route.id)
            if (data) {
              const times = extractLadozhskayaDepartures(data, route.id)
              times.forEach(time => {
                departures.push({
                  routeId: route.id,
                  routeName: route.name,
                  destination: route.destination,
                  time
                })
              })
            }
          } catch (err) {
            console.warn(`Ошибка загрузки маршрута ${route.id}:`, err)
          }
        }
        
        setAllDepartures(departures)
        setLoading(false)
      } catch (err) {
        console.error('Ошибка загрузки расписаний:', err)
        setError('Не удалось загрузить расписания')
        setLoading(false)
      }
    }

    loadAllSchedules()
  }, [])

  const currentTime = useMemo(() => getCurrentTimeInMinutes(), [now])

  // Сортируем все отправления по времени до отправления
  const sortedDepartures = useMemo(() => {
    const minutesInDay = 24 * 60
    
    return allDepartures
      .map(dep => {
        let minutesUntil = dep.time - currentTime
        let isTomorrow = false
        
        if (minutesUntil < 0) {
          minutesUntil += minutesInDay
          isTomorrow = true
        }
        
        return {
          ...dep,
          minutesUntil,
          isTomorrow
        }
      })
      .sort((a, b) => a.minutesUntil - b.minutesUntil)
  }, [allDepartures, currentTime])

  // Фильтруем только сегодняшние отправления
  const todayDepartures = useMemo(() => {
    return sortedDepartures.filter(dep => !dep.isTomorrow)
  }, [sortedDepartures])

  // Берем видимое количество отправлений
  const upcomingDepartures = todayDepartures.slice(0, visibleCount)
  
  // Есть ли ещё отправления для показа
  const hasMore = todayDepartures.length > visibleCount
  
  const handleShowMore = () => {
    setVisibleCount(prev => prev + 12)
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

  const getRouteColor = (routeId) => {
    const colors = {
      '533': 'bg-blue-100 text-blue-800',
      '429': 'bg-green-100 text-green-800',
      '430A': 'bg-purple-100 text-purple-800',
      '453': 'bg-orange-100 text-orange-800',
    }
    return colors[routeId] || 'bg-gray-100 text-gray-800'
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
                    <span className="text-sm text-black/70">
                      → {dep.destination}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm text-black/60">
                    {formatTimeUntil(dep.minutesUntil)}
                  </span>
                  <span className="text-xl font-normal text-black/80">
                    {formatTime(dep.time)}
                  </span>
                </div>
              </div>
            ))}
      </div>
      
      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleShowMore}
            className="px-5 py-2 text-base font-normal text-black/70 hover:text-black transition-colors"
          >
            Показать ещё
          </button>
        </div>
      )}
      
      {!hasMore && todayDepartures.length > 0 && (
        <div className="mt-4 text-center text-sm text-black/50">
          Больше рейсов сегодня нет
        </div>
      )}
    </div>
  )
}

export default FromLadozhskaya

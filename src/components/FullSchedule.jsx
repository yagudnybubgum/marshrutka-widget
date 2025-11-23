import { useState, useEffect, useMemo, useRef } from 'react'
import * as XLSX from 'xlsx'

const FullSchedule = ({ onBack }) => {
  const [scheduleData, setScheduleData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [now, setNow] = useState(new Date())
  const [headerVisible, setHeaderVisible] = useState(true)
  const lastScrollTopRef = useRef(0)
  
  // Определяем активный таб (будние или выходные)
  const isWeekend = now.getDay() === 0 || now.getDay() === 6
  const [activeTab, setActiveTab] = useState(isWeekend ? 'weekend' : 'weekday')

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    loadScheduleFile()
  }, [])

  // Обработчик скролла для скрытия/показа хедера
  useEffect(() => {
    if (!scheduleData) return
    
    const scrollContainer = document.querySelector('.schedule-scroll-container')
    if (!scrollContainer) return

    const handleScroll = () => {
      const currentScrollTop = scrollContainer.scrollTop
      const lastScrollTop = lastScrollTopRef.current
      
      // Если в самом верху - всегда показываем
      if (currentScrollTop <= 0) {
        setHeaderVisible(true)
        lastScrollTopRef.current = 0
        return
      }
      
      // Если прокрутили вниз больше чем на 50px - скрываем
      // Если прокрутили вверх - показываем
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

  const loadScheduleFile = async () => {
    try {
      const getBasePath = () => {
        if (import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/') {
          return import.meta.env.BASE_URL
        }
        const path = window.location.pathname
        if (path.includes('/marshrutka-widget/')) {
          return '/marshrutka-widget/'
        }
        return '/'
      }
      
      const basePath = getBasePath()
      const filePath = `${basePath}schedule.xlsx`.replace(/\/\//g, '/')
      
      const response = await fetch(filePath)
      if (!response.ok) {
        throw new Error(`Файл расписания не найден (${response.status})`)
      }
      const arrayBuffer = await response.arrayBuffer()
      const data = new Uint8Array(arrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: null })
      
      const processedData = processScheduleData(jsonData)
      setScheduleData(processedData)
      setLoading(false)
    } catch (err) {
      console.error('Ошибка загрузки файла:', err)
      setError('Не удалось загрузить файл расписания.')
      setLoading(false)
    }
  }

  const processScheduleData = (data) => {
    if (data.length < 3) return null

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

    const extractTimesForColumn = (colIdx) =>
      bodyRows
        .map(row => parseTime(row ? row[colIdx] : null))
        .filter(time => time !== null)
        .sort((a, b) => a - b)

    const buildColumns = () => {
      const columns = []
      
      // Будние дни
      const weekdayCols = columnMeta.filter(col => col.type === 'weekday')
      weekdayCols.forEach(col => {
        columns.push({
          period: 'Будние дни',
          name: formatDirectionName(directionRow[col.idx] || ''),
          times: extractTimesForColumn(col.idx),
          colIdx: col.idx
        })
      })
      
      // Выходные дни
      const weekendCols = columnMeta.filter(col => col.type === 'weekend')
      weekendCols.forEach(col => {
        columns.push({
          period: 'Выходные дни',
          name: formatDirectionName(directionRow[col.idx] || ''),
          times: extractTimesForColumn(col.idx),
          colIdx: col.idx
        })
      })
      
      return columns.filter(col => col.times.length > 0)
    }

    return {
      columns: buildColumns()
    }
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60) % 24
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  const getCurrentTimeInMinutes = () => {
    return now.getHours() * 60 + now.getMinutes()
  }

  // Фильтруем колонки по активному табу
  const activeColumns = useMemo(() => {
    if (!scheduleData) return []
    
    const targetPeriod = activeTab === 'weekday' ? 'Будние дни' : 'Выходные дни'
    return scheduleData.columns.filter(col => col.period === targetPeriod)
  }, [scheduleData, activeTab])


  const currentTime = getCurrentTimeInMinutes()

  if (loading) {
    return (
      <div className="h-[100dvh] bg-base-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-black/70">
          <span className="loading loading-spinner loading-lg text-black" />
          <p className="text-sm font-normal">загружаем расписание…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[100dvh] bg-base-200 flex items-center justify-center">
        <div className="alert alert-error">
          <span className="text-black">{error}</span>
        </div>
      </div>
    )
  }

  if (!scheduleData || scheduleData.columns.length === 0) {
    return (
      <div className="h-[100dvh] bg-base-200 flex items-center justify-center">
        <div className="alert alert-info">
          <span className="text-black">Нет данных расписания</span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[100dvh] bg-base-200 flex flex-col relative">
      {/* Header */}
      <div 
        className={`absolute top-0 left-0 right-0 z-20 bg-base-200 px-4 pt-6 pb-0 transition-transform duration-300 ${
          headerVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center">
          <button
            onClick={onBack}
            className="text-black hover:text-black/70 transition-colors flex items-center gap-1 text-sm font-normal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            назад
          </button>
          <h1 className="text-xl font-normal text-black flex-1 text-center">
            Маршрутка 533
          </h1>
          <div className="w-16"></div> {/* Spacer для центрирования */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className={`h-full max-w-7xl mx-auto transition-all duration-300 ${
          headerVisible ? 'pt-20' : 'pt-0'
        }`}>
          <div className={`h-full overflow-y-auto schedule-scroll-container pb-4 transition-all duration-300 ${
            headerVisible ? 'px-4' : 'px-4'
          }`}>
            {/* Tabs and Table Header - combined sticky */}
            <div className="sticky top-0 bg-base-200 z-20">
              <nav aria-label="Tabs" className="flex space-x-4 mb-4 pt-2 sm:justify-center">
                <button
                  onClick={() => setActiveTab('weekday')}
                  className={`flex-1 sm:flex-none rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'weekday'
                      ? 'bg-gray-200 text-gray-800'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Будние дни
                </button>
                <button
                  onClick={() => setActiveTab('weekend')}
                  className={`flex-1 sm:flex-none rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'weekend'
                      ? 'bg-gray-200 text-gray-800'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Выходные дни
                </button>
              </nav>
              
              {/* Table header */}
              <div className="flex border-b border-black/20">
                {activeColumns.map((col, idx) => (
                  <div
                    key={idx}
                    className="flex-1 text-left px-3 py-3 text-sm font-normal text-black/70"
                  >
                    {col.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Simple two columns with times in vertical list */}
            <div className="flex gap-4 mt-4">
              {activeColumns.map((col, colIdx) => (
                <div key={colIdx} className="flex-1">
                  <div className="space-y-1">
                    {col.times.map((time, timeIdx) => {
                      const isCurrent = Math.abs(time - currentTime) < 2
                      return (
                        <div
                          key={timeIdx}
                          className={`p-2 text-sm ${
                            isCurrent ? 'bg-yellow-200 font-semibold' : 'text-black'
                          }`}
                        >
                          {formatTime(time)}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FullSchedule


import { useState, useEffect } from 'react'
import MarshrutkaWidget from './components/MarshrutkaWidget'
import FullSchedule from './components/FullSchedule'

function App() {
  const [schedule, setSchedule] = useState(null)
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const [showFullSchedule, setShowFullSchedule] = useState(false)

  // Праздничные дни (используется расписание выходного дня)
  const holidays = [
    // 2025
    '2025-12-31',
    // 2026
    '2026-01-01', '2026-01-02', '2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08', '2026-01-09',
    '2026-02-23',
    '2026-03-09',
    '2026-05-01', '2026-05-11',
    '2026-06-12',
    '2026-11-04',
    '2026-12-31',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const isWeekendOrHoliday = (date) => {
    const dayOfWeek = date.getDay()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${day}`
    return dayOfWeek === 0 || dayOfWeek === 6 || holidays.includes(dateString)
  }

  const formatDate = (date) => {
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ]
    const day = date.getDate()
    const month = months[date.getMonth()]
    return `${day} ${month}`
  }

  if (showFullSchedule) {
    return <FullSchedule onBack={() => setShowFullSchedule(false)} />
  }

  return (
    <div className="h-[100dvh] bg-base-200 pt-6 pb-2 px-4 sm:py-10 overflow-hidden flex flex-col">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 w-full flex-1 min-h-0 flex flex-col">
        <div className="flex justify-between items-center gap-2 flex-shrink-0">
          <h1 className="text-xl font-normal text-black flex-shrink-0">
            Маршрутка 533
          </h1>
          {schedule && (
            <div className={`text-base font-normal whitespace-nowrap ${
              isWeekendOrHoliday(currentDateTime) ? 'text-red-600' : 'text-black'
            }`}>
              {formatDate(currentDateTime)}
            </div>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <MarshrutkaWidget onScheduleChange={setSchedule} />
          {schedule && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowFullSchedule(true)}
                className="text-base font-normal text-black/70 hover:text-black transition-colors"
              >
                Полное расписание
              </button>
            </div>
          )}
        </div>
      </div>
      <footer className="max-w-5xl mx-auto w-full py-2 sm:mt-8 sm:pb-4 flex-shrink-0">
        <a 
          href="mailto:sotskiidenis@gmail.com"
          className="text-xs text-black/70 text-center hover:text-black transition-colors block"
        >
          Связаться с разработчиком
        </a>
      </footer>
    </div>
  )
}

export default App
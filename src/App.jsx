import { useState, useEffect } from 'react'
import MarshrutkaWidget from './components/MarshrutkaWidget'

function App() {
  const [schedule, setSchedule] = useState(null)
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatDateTime = (date) => {
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ]
    const day = date.getDate()
    const month = months[date.getMonth()]
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `Сегодня ${day} ${month}, ${hours}:${minutes}`
  }

  const isWeekend = currentDateTime.getDay() === 0 || currentDateTime.getDay() === 6

  return (
    <div className="min-h-screen bg-base-200 py-6 px-3 sm:py-10 overflow-x-hidden flex flex-col">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 w-full flex-1">
        <div className="flex justify-between items-center gap-2">
          <h1 className="text-xl font-normal text-black flex-shrink-0">
            Маршрутка 533
          </h1>
          {schedule && (
            <div className="badge badge-lg font-normal bg-white text-black rounded-full flex-shrink-0 whitespace-nowrap">
              {isWeekend ? 'Выходной' : 'Будний день'}
            </div>
          )}
        </div>

        <MarshrutkaWidget onScheduleChange={setSchedule} />
      </div>
      <footer className="max-w-5xl mx-auto w-full mt-8 pb-4">
        <p className="text-sm text-black/70 text-center">
          {formatDateTime(currentDateTime)}
        </p>
      </footer>
    </div>
  )
}

export default App
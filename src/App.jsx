import { useState, useEffect } from 'react'
import MarshrutkaWidget from './components/MarshrutkaWidget'
import FullSchedule from './components/FullSchedule'

function App() {
  const [schedule, setSchedule] = useState(null)
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const [showFullSchedule, setShowFullSchedule] = useState(false)

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
            <div className="badge badge-lg font-normal bg-white text-black rounded-full flex-shrink-0 whitespace-nowrap">
              {isWeekend ? 'выходной' : 'будний день'}
            </div>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <MarshrutkaWidget onScheduleChange={setSchedule} />
          {schedule && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowFullSchedule(true)}
                className="text-sm font-normal text-black/70 hover:text-black transition-colors"
              >
                Полное расписание
              </button>
            </div>
          )}
        </div>
      </div>
      <footer className="max-w-5xl mx-auto w-full py-2 sm:mt-8 sm:pb-4 flex-shrink-0">
        <p className="text-sm text-black/70 text-center">
          {formatDateTime(currentDateTime)}
        </p>
      </footer>
    </div>
  )
}

export default App
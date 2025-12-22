import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MarshrutkaWidget from './MarshrutkaWidget'
import FullSchedule from './FullSchedule'

function Home() {
  const [schedule, setSchedule] = useState(null)
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const [showFullSchedule, setShowFullSchedule] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatDate = (date) => {
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ]
    const day = date.getDate()
    const month = months[date.getMonth()]
    return `${day} ${month}`
  }

  const getDayType = (date) => {
    const dayOfWeek = date.getDay()
    return dayOfWeek === 0 || dayOfWeek === 6 ? 'Выходной' : 'Будний'
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
            <div className="flex flex-col items-end text-xs font-normal text-gray-800 flex-shrink-0">
              <span>{formatDate(currentDateTime)}</span>
              <span>{getDayType(currentDateTime)}</span>
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
        <div className="flex flex-col items-center gap-2">
          <a 
            href="mailto:onlineyanino@gmail.com"
            className="text-xs text-black/70 text-center hover:text-black transition-colors"
          >
            Связаться с разработчиком
          </a>
          <Link 
            to="/privacy-policy"
            className="text-xs text-black/70 text-center hover:text-black transition-colors"
          >
            Политика конфиденциальности
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default Home


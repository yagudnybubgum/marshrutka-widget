import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import MarshrutkaWidget from './MarshrutkaWidget'

function Home() {
  const [routeNumber, setRouteNumber] = useState('533')
  const [schedule, setSchedule] = useState(null)
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const scrollContainerRef = useRef(null)

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

  // Сбрасываем расписание при смене маршрута
  useEffect(() => {
    setSchedule(null)
  }, [routeNumber])


  return (
    <div className="min-h-[100dvh] bg-base-200 pt-5 pb-8 px-4 sm:py-10">
      <div className="max-w-5xl mx-auto space-y-3 sm:space-y-8 w-full">
        <div className="flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <h1 className="text-xl font-normal text-black">
              Расписание маршруток Янино-1
            </h1>
            {schedule && (
              <>
                <span className="text-xs font-normal text-gray-800 sm:hidden">
                  {formatDate(currentDateTime)}, {getDayType(currentDateTime).toLowerCase()}
                </span>
                <div className="hidden sm:flex sm:flex-col sm:items-end text-xs font-normal text-gray-800 flex-shrink-0">
                  <span>{formatDate(currentDateTime)}</span>
                  <span>{getDayType(currentDateTime)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-base-200 pb-1 sm:px-10 pt-1 w-fit">
          <div className="flex gap-2 justify-start">
            <button
              onClick={() => {
                setRouteNumber('533')
              }}
              className={`px-5 py-2 text-base font-normal rounded-full transition-colors ${
                routeNumber === '533'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-gray-100 text-black/70 hover:text-black'
              }`}
            >
              533
            </button>
            <button
              onClick={() => {
                setRouteNumber('429')
              }}
              className={`px-5 py-2 text-base font-normal rounded-full transition-colors relative ${
                routeNumber === '429'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-gray-100 text-black/70 hover:text-black'
              }`}
            >
              429
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
                new
              </span>
            </button>
          </div>
        </div>

        <div ref={scrollContainerRef} className="mt-3">
          <MarshrutkaWidget key={routeNumber} routeNumber={routeNumber} onScheduleChange={setSchedule} />
          {schedule && (
            <div className="mt-6 flex justify-center">
              <Link
                to={routeNumber === '533' ? '/full533' : '/full429'}
                className="text-base font-normal text-black/70 hover:text-black transition-colors"
              >
                Полное расписание
              </Link>
            </div>
          )}
          <Link
            to="/homescreen"
            className="mt-6 block bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-base font-normal">Добавляем расписание на&nbsp;домашний экран</span>
                <span className="text-sm opacity-90 mt-0.5">всегда под рукой</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 flex-shrink-0 ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>
          <footer className="mt-8 pb-8">
            <div className="flex flex-col items-center gap-2">
              <Link 
                to="/about"
                className="text-xs text-black/70 text-center hover:text-black transition-colors"
              >
                О проекте
              </Link>
              <Link 
                to="/privacy-policy"
                className="text-xs text-black/70 text-center hover:text-black transition-colors"
              >
                Политика конфиденциальности
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default Home




import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import MarshrutkaWidget from './MarshrutkaWidget'
import Footer from './Footer'
import { getDayType as getDayTypeUtil } from '../utils/holidays'

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
    return getDayTypeUtil(date)
  }

  // Сбрасываем расписание при смене маршрута
  useEffect(() => {
    setSchedule(null)
  }, [routeNumber])


  return (
    <div className="min-h-[100dvh] bg-base-200 pt-5 pb-8 px-4 sm:py-10 flex flex-col">
      <div className="max-w-5xl mx-auto space-y-3 sm:space-y-4 w-full flex-1 flex flex-col">
        <div className="flex-shrink-0">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-normal text-black">
              Расписание маршруток Янино-1
            </h1>
            <span className="text-sm font-normal text-gray-800">
              {formatDate(currentDateTime)}, {getDayType(currentDateTime).toLowerCase()}
            </span>
          </div>
        </div>

        <div className="bg-base-200 -mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pt-3 pb-1">
            <button
              onClick={() => setRouteNumber('533')}
              className={`flex-shrink-0 px-5 py-2 text-base font-normal rounded-full transition-colors ${
                routeNumber === '533'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-gray-100 text-black/70 hover:text-black'
              }`}
            >
              533
            </button>
            <button
              onClick={() => setRouteNumber('429')}
              className={`flex-shrink-0 px-5 py-2 text-base font-normal rounded-full transition-colors ${
                routeNumber === '429'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-gray-100 text-black/70 hover:text-black'
              }`}
            >
              429
            </button>
            <button
              onClick={() => setRouteNumber('664')}
              className={`flex-shrink-0 px-5 py-2 text-base font-normal rounded-full transition-colors ${
                routeNumber === '664'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-gray-100 text-black/70 hover:text-black'
              }`}
            >
              664
            </button>
            <button
              onClick={() => setRouteNumber('430A')}
              className={`flex-shrink-0 px-5 py-2 text-base font-normal rounded-full transition-colors relative ${
                routeNumber === '430A'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-gray-100 text-black/70 hover:text-black'
              }`}
            >
              430А
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
                new
              </span>
            </button>
            <button
              onClick={() => setRouteNumber('453')}
              className={`flex-shrink-0 px-5 py-2 text-base font-normal rounded-full transition-colors relative ${
                routeNumber === '453'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-gray-100 text-black/70 hover:text-black'
              }`}
            >
              453
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
                new
              </span>
            </button>
          </div>
        </div>

        <div ref={scrollContainerRef} className="mt-3 flex-1">
          <MarshrutkaWidget key={routeNumber} routeNumber={routeNumber} onScheduleChange={setSchedule} />
          {schedule && (
            <div className="mt-6 flex justify-center">
              <Link
                to={`/full${routeNumber}`}
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
                <span className="text-base font-normal">Расписание всегда под рукой</span>
                <span className="text-sm opacity-90 mt-0.5">Добавьте его на главный экран</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 flex-shrink-0 ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>
        </div>
        <Footer className="mt-auto" />
      </div>
    </div>
  )
}

export default Home




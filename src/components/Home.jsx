import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import MarshrutkaWidget from './MarshrutkaWidget'
import FromLadozhskaya from './FromLadozhskaya'
import Footer from './Footer'
import { ROUTES, isValidRouteId } from '../config/routes'
import { hasRouteGeo } from '../utils/routesGeo'
import { useNow } from '../context/TimeContext'
import { getDayType as getDayTypeUtil } from '../utils/holidays'

const DEFAULT_TAB = '533'

function isValidTab(tab) {
  return tab === 'ladozhskaya' || isValidRouteId(tab)
}

function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [schedule, setSchedule] = useState(null)
  const now = useNow()

  const tabFromUrl = searchParams.get('tab')
  const activeTab = isValidTab(tabFromUrl) ? tabFromUrl : DEFAULT_TAB
  const routeNumber = activeTab !== 'ladozhskaya' ? activeTab : null

  const setActiveTab = (tab) => {
    if (tab === DEFAULT_TAB) {
      setSearchParams({}, { replace: true })
      return
    }
    setSearchParams({ tab }, { replace: true })
  }

  const formatDate = (date) => {
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
    ]
    const day = date.getDate()
    const month = months[date.getMonth()]
    return `${day} ${month}`
  }

  useEffect(() => {
    setSchedule(null)
  }, [routeNumber])

  return (
    <div className="min-h-[100dvh] bg-base-200 pt-5 pb-8 px-4 sm:py-10 flex flex-col">
      <div className="max-w-5xl mx-auto space-y-3 sm:space-y-4 w-full flex-1 flex flex-col">
        <div className="flex-shrink-0">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-normal text-black">
              Маршрутки Янино-1
            </h1>
            <span className="text-sm font-normal text-gray-800">
              {formatDate(now)}, {getDayTypeUtil(now).toLowerCase()}
            </span>
          </div>
        </div>

        <div className="bg-base-200">
          <div className="flex flex-wrap gap-2 pt-3 pb-1">
            {ROUTES.map((route) => (
              <button
                key={route.id}
                onClick={() => setActiveTab(route.id)}
                className={`flex-shrink-0 px-5 py-2 text-base font-normal rounded-full transition-colors ${
                  activeTab === route.id
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-gray-100 text-black/70 hover:text-black'
                }`}
              >
                {route.name}
              </button>
            ))}
            <button
              onClick={() => setActiveTab('ladozhskaya')}
              className={`flex-shrink-0 px-5 py-2 text-base font-normal rounded-full transition-colors ${
                activeTab === 'ladozhskaya'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-gray-100 text-black/70 hover:text-black'
              }`}
            >
              С Ладожской
            </button>
          </div>
        </div>

        <div className="mt-3 flex-1">
          {activeTab !== 'ladozhskaya' ? (
            <>
              <MarshrutkaWidget key={routeNumber} routeNumber={routeNumber} onScheduleChange={setSchedule} />
              {schedule && (
                <div className="mt-6 flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
                  <Link
                    to={`/full/${routeNumber}`}
                    className="text-base font-normal text-black/70 hover:text-black transition-colors"
                  >
                    Полное расписание
                  </Link>
                  {hasRouteGeo(routeNumber) && (
                    <Link
                      to={`/map/${routeNumber}`}
                      className="text-base font-normal text-black/70 hover:text-black transition-colors"
                    >
                      Карта маршрута
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <FromLadozhskaya active />
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

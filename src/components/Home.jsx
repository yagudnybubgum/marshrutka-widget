import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import MarshrutkaWidget from './MarshrutkaWidget'
import FullSchedule from './FullSchedule'

function Home() {
  const [routeNumber, setRouteNumber] = useState('533')
  const [schedule, setSchedule] = useState(null)
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const [showFullSchedule, setShowFullSchedule] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)
  const scrollContainerRef = useRef(null)
  const lastScrollTopRef = useRef(0)

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
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/d1583780-0508-4307-9920-67e4adfcc8a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Home.jsx:39',message:'routeNumber changed, resetting schedule',data:{routeNumber,prevSchedule:schedule},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    setSchedule(null)
  }, [routeNumber])

  // Обработчик скролла для скрытия/показа заголовка
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.scrollY || document.documentElement.scrollTop
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

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (showFullSchedule) {
    return <FullSchedule routeNumber={routeNumber} onBack={() => setShowFullSchedule(false)} />
  }

  // #region agent log
  useEffect(() => {
    const container = scrollContainerRef.current;
    fetch('http://127.0.0.1:7244/ingest/d1583780-0508-4307-9920-67e4adfcc8a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Home.jsx:75',message:'Home component render',data:{routeNumber,scheduleExists:!!schedule,showFullSchedule,headerVisible,containerHeight:container?.offsetHeight,scrollY:window.scrollY},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
  });
  // #endregion
  return (
    <div className="min-h-[100dvh] bg-base-200 pt-5 pb-8 px-4 sm:py-10">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 w-full">
        <div 
          className={`flex justify-between items-center gap-2 transition-opacity duration-300 ${
            headerVisible ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
          }`}
        >
          <h1 className="text-xl font-normal text-black">
            Онлайн Расписание
          </h1>
          {schedule && (
            <div className="flex flex-col items-end text-xs font-normal text-gray-800 flex-shrink-0">
              <span>{formatDate(currentDateTime)}</span>
              <span>{getDayType(currentDateTime)}</span>
            </div>
          )}
        </div>

        <div className="bg-base-200 pb-1 px-4 sm:px-10 pt-1">
          <div className="flex gap-2">
            <button
              onClick={() => {
                // #region agent log
                fetch('http://127.0.0.1:7244/ingest/d1583780-0508-4307-9920-67e4adfcc8a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Home.jsx:97',message:'Tab button clicked',data:{newRoute:'533',currentRoute:routeNumber,scrollY:window.scrollY,contentHeight:document.querySelector('[data-cursor-element-id="cursor-el-14"]')?.offsetHeight},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                // #endregion
                setRouteNumber('533')
              }}
              className={`px-5 py-2 text-base font-normal rounded-full transition-colors border ${
                routeNumber === '533'
                  ? 'bg-white text-black border-transparent'
                  : 'bg-transparent text-black/70 hover:text-black border-black/20'
              }`}
            >
              533
            </button>
            <button
              onClick={() => {
                // #region agent log
                fetch('http://127.0.0.1:7244/ingest/d1583780-0508-4307-9920-67e4adfcc8a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Home.jsx:107',message:'Tab button clicked',data:{newRoute:'429',currentRoute:routeNumber,scrollY:window.scrollY,contentHeight:document.querySelector('[data-cursor-element-id="cursor-el-14"]')?.offsetHeight},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                // #endregion
                setRouteNumber('429')
              }}
              className={`px-5 py-2 text-base font-normal rounded-full transition-colors relative border ${
                routeNumber === '429'
                  ? 'bg-white text-black border-transparent'
                  : 'bg-transparent text-black/70 hover:text-black border-black/20'
              }`}
            >
              429
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
                new
              </span>
            </button>
          </div>
        </div>

        <div ref={scrollContainerRef} className="mt-4">
          <MarshrutkaWidget key={routeNumber} routeNumber={routeNumber} onScheduleChange={setSchedule} />
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
      </div>
    </div>
  )
}

export default Home




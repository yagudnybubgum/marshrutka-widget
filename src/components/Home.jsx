import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import MarshrutkaWidget from './MarshrutkaWidget'
import FromLadozhskaya from './FromLadozhskaya'
import Footer from './Footer'
import { ROUTES, isValidRouteId } from '../config/routes'
import { hasRouteGeo } from '../utils/routesGeo'
import { useNow } from '../context/TimeContext'
import { getDayType as getDayTypeUtil } from '../utils/holidays'
import { ArrowRightIcon } from './icons'
import { Chip, ChipGroup, PageShell, PromoCard, TextLink } from './ui'

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
    <PageShell
      contentClassName="space-y-3 sm:space-y-4"
      footer={<Footer className="mt-auto" />}
    >
      <div className="flex flex-wrap items-baseline gap-y-1">
        <h1 className="text-xl font-normal text-ink">
          Маршрутки Янино-1
        </h1>
        <span
          className="pointer-events-none h-0 basis-[60px] grow-[999]"
          aria-hidden="true"
        />
        <span className="text-sm font-normal text-ink">
          {formatDate(now)}, {getDayTypeUtil(now).toLowerCase()}
        </span>
      </div>

      <ChipGroup scroll>
        {ROUTES.map((route, i) => (
          <Chip
            key={route.id}
            onClick={() => setActiveTab(route.id)}
            active={activeTab === route.id}
            style={{ '--chip-i': i }}
            className="chip-enter"
          >
            {route.name}
          </Chip>
        ))}
        <Chip
          onClick={() => setActiveTab('ladozhskaya')}
          active={activeTab === 'ladozhskaya'}
          style={{ '--chip-i': ROUTES.length }}
          className="chip-enter"
        >
          С Ладожской
        </Chip>
      </ChipGroup>

      <div className="mt-3 flex-1">
        {activeTab !== 'ladozhskaya' ? (
          <>
            <MarshrutkaWidget routeNumber={routeNumber} onScheduleChange={setSchedule} />
            {schedule && (
              <div className="mt-6 flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
                <TextLink to={`/full/${routeNumber}`}>Полное расписание</TextLink>
                {hasRouteGeo(routeNumber) && (
                  <TextLink to={`/map/${routeNumber}`}>Карта маршрута</TextLink>
                )}
              </div>
            )}
          </>
        ) : (
          <FromLadozhskaya active />
        )}
        <PromoCard
          to="/homescreen"
          className="mt-6 md:max-w-[360px] md:mx-auto"
          title="Расписание всегда под рукой"
          subtitle="Добавьте его на главный экран"
          trailing={<ArrowRightIcon className="ml-2 h-5 w-5 flex-shrink-0 text-accent-ink/70" />}
        />
      </div>
    </PageShell>
  )
}

export default Home

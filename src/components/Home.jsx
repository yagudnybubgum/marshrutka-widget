import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import MarshrutkaWidget from './MarshrutkaWidget'
import FromLadozhskaya from './FromLadozhskaya'
import Footer from './Footer'
import { ROUTES, isValidRouteId } from '../config/routes'
import { copy } from '../config/copy'
import { hasRouteGeo } from '../utils/routesGeo'
import { useNow } from '../context/TimeContext'
import { getDayType as getDayTypeUtil } from '../utils/holidays'
import { ArrowRightIcon } from './icons'
import { Chip, ChipGroup, PageShell, PromoCard, TextLink } from './ui'

const DEFAULT_TAB = '533'

function isValidTab(tab) {
  return tab === 'ladozhskaya' || isValidRouteId(tab)
}

function formatDate(date) {
  const day = date.getDate()
  const month = copy.monthsGenitive[date.getMonth()]
  return `${day} ${month}`
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
          {copy.home.title}
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
          {copy.home.tabFromLadozhskaya}
        </Chip>
      </ChipGroup>

      <div className="mt-3 flex-1">
        {activeTab !== 'ladozhskaya' ? (
          <>
            <MarshrutkaWidget routeNumber={routeNumber} onScheduleChange={setSchedule} />
            {schedule && (
              <div className="mt-6 flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
                <TextLink to={`/full/${routeNumber}`}>{copy.nav.fullSchedule}</TextLink>
                {hasRouteGeo(routeNumber) && (
                  <TextLink to={`/map/${routeNumber}`}>{copy.nav.routeMap}</TextLink>
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
          title={copy.home.promoTitle}
          subtitle={copy.home.promoSubtitle}
          trailing={<ArrowRightIcon className="ml-2 h-5 w-5 flex-shrink-0 text-accent-ink/70" />}
        />
      </div>
    </PageShell>
  )
}

export default Home

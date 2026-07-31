import { ArrowRightIcon, MapPinIcon, XMarkIcon } from '../icons'
import { copy } from '../../config/copy'
import { ROUTES } from '../../config/routes'
import { getDayType } from '../../utils/holidays'
import { getRouteGeo } from '../../utils/routesGeo'
import StopLocationMap from '../StopLocationMap'

const CHIP_IDLE =
  'flex-shrink-0 px-4 py-2 text-base font-normal rounded-full bg-surface-chip text-ink/70'
const CHIP_ACTIVE =
  'flex-shrink-0 px-4 py-2 text-base font-normal rounded-full bg-accent-soft text-accent-ink'

function formatHeaderDate(date = new Date()) {
  return `${date.getDate()} ${copy.monthsGenitive[date.getMonth()]}, ${getDayType(date).toLowerCase()}`
}

const LADOZHSKAYA_STOP =
  getRouteGeo('533')?.directions
    ?.find((d) => d.id === 'from_ladozhskaya')
    ?.stops?.find((s) => s.id === 'ladozhskaya') ?? {
    name: 'м. Ладожская',
    lat: 59.93274,
    lng: 30.441484,
  }

/**
 * Frozen home UI for portfolio recording — no live clock / navigation.
 * data-block markers are measured by AnatomyPage for guides + skeleton sync.
 */
export default function AnatomyHomeMock() {
  return (
    <div
      className="pointer-events-none select-none bg-surface-muted flex flex-col px-2 pt-[78px] pb-6"
      aria-hidden
    >
      <div data-block="header" className="flex flex-col items-start gap-y-1 px-4">
        <h1 data-block="title" className="text-xl font-normal text-ink leading-7">
          {copy.home.title}
        </h1>
        <span data-block="date" className="text-sm font-normal text-ink leading-5">
          {formatHeaderDate()}
        </span>
      </div>

      <div data-block="chips" className="mt-4 -mx-2 overflow-hidden">
        <div className="flex w-max flex-nowrap gap-2 px-2 pb-1">
          {ROUTES.map((route) => (
            <span
              key={route.id}
              data-chip
              className={route.id === '533' ? CHIP_ACTIVE : CHIP_IDLE}
            >
              {route.name}
            </span>
          ))}
          <span data-chip className={CHIP_IDLE}>
            {copy.home.tabFromLadozhskaya}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-3 px-0">
        <div data-block="card1">
          <DirectionCard
            name={copy.direction.fromYanino}
            until="6 мин"
            time="17:09"
            following="17:28, 17:47, 18:06"
            previous="13 мин"
          />
        </div>
        <div data-block="card2">
          <DirectionCard
            name={copy.direction.fromLadozhskaya}
            until="17 мин"
            time="17:20"
            following="17:39, 17:58, 18:17"
            previous="2 мин"
            stopNotice
          />
        </div>
      </div>

      <div
        data-block="links"
        className="mt-6 flex flex-wrap justify-center items-center gap-x-6 gap-y-3"
      >
        <span className="text-base font-normal text-ink/70">{copy.nav.fullSchedule}</span>
        <span className="text-base font-normal text-ink/70">{copy.nav.routeMap}</span>
      </div>

      <div data-block="promo" className="mt-6 rounded-3xl bg-accent-soft text-accent-ink p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-base font-normal">{copy.home.promoTitle}</span>
            <span className="text-sm mt-0.5">{copy.home.promoSubtitle}</span>
          </div>
          <ArrowRightIcon className="ml-2 h-5 w-5 flex-shrink-0 text-accent-ink/70" />
        </div>
      </div>

      <div
        data-block="footer"
        className="mt-6 flex flex-col items-center gap-4 pb-2"
      >
        <span className="text-xs text-ink/70 text-center">{copy.nav.about}</span>
        <span className="text-xs text-ink/70 text-center">{copy.nav.privacy}</span>
      </div>
    </div>
  )
}

export function AnatomyStopSheet() {
  return (
    <>
      <div
        data-sheet-scrim
        className="pointer-events-none absolute inset-0 z-40 bg-ink/40 opacity-0"
      />
      <div
        data-sheet
        className="pointer-events-none absolute inset-0 z-50 flex flex-col overflow-hidden rounded-t-3xl bg-surface shadow-xl"
      >
        <div className="flex shrink-0 flex-col items-center pt-3 pb-2">
          <div className="h-1 w-10 rounded-full bg-ink/20" aria-hidden />
        </div>
        <div className="flex shrink-0 items-center justify-between gap-3 px-4 pb-3">
          <h2 className="min-w-0 text-lg font-normal text-ink">
            {copy.widget.stopLadozhskayaTitle}
          </h2>
          <span className="inline-flex shrink-0 rounded-md p-1.5 text-ink/70" aria-hidden>
            <XMarkIcon />
          </span>
        </div>
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <StopLocationMap
            lat={LADOZHSKAYA_STOP.lat}
            lng={LADOZHSKAYA_STOP.lng}
            name={LADOZHSKAYA_STOP.name}
            className="h-full w-full"
          />
        </div>
      </div>
    </>
  )
}

function DirectionCard({ name, until, time, following, previous, stopNotice = false }) {
  return (
    <div className="rounded-3xl overflow-hidden bg-surface">
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-xl font-normal text-ink">{name}</h3>
            <p className="text-sm text-ink/70">
              {copy.widget.inPrefix} {until}
            </p>
          </div>
          <p className="font-normal text-ink" style={{ fontSize: '40px', lineHeight: 1 }}>
            {time}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-ink/80">
            {copy.widget.followingPrefix} {following}
          </p>
          <p className="text-sm text-ink/80">{copy.widget.previousLeft(previous)}</p>
        </div>
      </div>
      {stopNotice ? (
        <div
          data-stop-notice
          className="relative z-0 w-full rounded-t-3xl bg-alert px-4 pb-4 pt-3 text-left text-alert-ink origin-center"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <p className="text-base font-normal">{copy.widget.stopMoved}</p>
            <span className="inline-flex items-center gap-1 text-sm font-normal">
              {copy.widget.viewOnMap}
              <MapPinIcon />
            </span>
          </div>
        </div>
      ) : null}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Drawer } from 'vaul'
import Footer from './Footer'
import { copy } from '../config/copy'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { ArrowRightIcon } from './icons'
import { BackLink, PageShell, PromoCard } from './ui'

const SNAP_MEDIUM = 0.55
const SNAP_LARGE = 0.92
const SNAP_POINTS = [SNAP_MEDIUM, SNAP_LARGE]

function HomeScreenBody({ compact = false }) {
  return (
    <div className={compact ? 'space-y-6' : 'space-y-8'}>
      <div>
        <h1
          className={
            compact
              ? 'text-xl font-normal text-ink mb-1'
              : 'text-2xl sm:text-3xl font-normal text-ink mb-2'
          }
        >
          {copy.homescreen.title}
        </h1>
        <p className={compact ? 'text-sm text-ink/70' : 'text-base text-ink/70'}>
          {copy.homescreen.subtitle}
        </p>
      </div>

      <div className={compact ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-1 md:grid-cols-2 gap-6'}>
        <PromoCard
          variant={compact ? 'muted' : 'surface'}
          external
          href="https://www.iphones.ru/iNotes/q/kak-v-ios-dobavit-yarlyk-lyubogo-sayta-na-rabochiy-stol"
          title={copy.homescreen.iphone}
          trailing={
            compact ? (
              <ArrowRightIcon className="ml-2 h-5 w-5 flex-shrink-0 text-ink/40" />
            ) : undefined
          }
        />
        <PromoCard
          variant={compact ? 'muted' : 'surface'}
          external
          href="https://androidinsider.ru/polezno-znat/kak-dobavit-yarlyk-sajta-na-rabochij-stol-android-smartfona.html"
          title={copy.homescreen.android}
          trailing={
            compact ? (
              <ArrowRightIcon className="ml-2 h-5 w-5 flex-shrink-0 text-ink/40" />
            ) : undefined
          }
        />
      </div>
    </div>
  )
}

const HomeScreen = () => {
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [snap, setSnap] = useState(SNAP_MEDIUM)
  const [open, setOpen] = useState(true)

  const onClose = () => navigate('/', { replace: true })

  useEffect(() => {
    setSnap(SNAP_MEDIUM)
    setOpen(true)
  }, [])

  if (!isDesktop) {
    return (
      <Drawer.Root
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen)
          if (!nextOpen) onClose()
        }}
        snapPoints={SNAP_POINTS}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
        fadeFromIndex={0}
        dismissible
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-ink/40" />
          <Drawer.Content
            aria-describedby={undefined}
            className="fixed inset-x-0 bottom-0 z-50 flex h-full flex-col rounded-t-3xl bg-surface shadow-xl outline-none pb-[env(safe-area-inset-bottom,0px)]"
          >
            <div className="flex shrink-0 flex-col items-center pt-3 pb-2">
              <div className="h-1 w-10 rounded-full bg-ink/20" aria-hidden />
            </div>
            <Drawer.Title className="sr-only">{copy.homescreen.title}</Drawer.Title>
            <div
              data-vaul-no-drag
              className="min-h-0 flex-1 overflow-y-auto px-4 pb-6"
            >
              <HomeScreenBody compact />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    )
  }

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <PageShell
        fullHeight="full"
        padClassName="pt-6 pb-2 px-4 sm:py-10"
        className="overflow-hidden"
        footer={
          <div className="w-full flex-shrink-0 mt-auto">
            <Footer />
          </div>
        }
      >
        <div className="flex-1 min-h-0 overflow-y-auto space-y-8">
          <div className="flex items-center gap-4 mb-8">
            <BackLink to="/" />
          </div>
          <HomeScreenBody />
        </div>
      </PageShell>
    </div>,
    document.body,
  )
}

export default HomeScreen

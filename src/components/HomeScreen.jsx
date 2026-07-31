import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Drawer } from 'vaul'
import Footer from './Footer'
import { copy } from '../config/copy'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { HomescreenPlatformCards } from './HomescreenPlatformCards'
import { XMarkIcon } from './icons'
import { BackLink, PageShell } from './ui'

const SNAP_MEDIUM = 0.55
const SNAP_LARGE = 0.92
const SNAP_POINTS = [SNAP_MEDIUM, SNAP_LARGE]

function HomeScreenBody({ compact = false, onClose }) {
  return (
    <div className={compact ? 'space-y-6' : 'space-y-8'}>
      <div>
        <div className={onClose ? 'mb-1 flex items-start justify-between gap-3' : undefined}>
          <h1
            className={
              compact
                ? `text-xl font-normal text-ink${onClose ? '' : ' mb-1'}`
                : 'text-2xl sm:text-3xl font-normal text-ink mb-2'
            }
          >
            {copy.homescreen.title}
          </h1>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="hover-darken inline-flex shrink-0 rounded-md p-1.5 text-ink/70"
              aria-label={copy.a11y.close}
            >
              <XMarkIcon />
            </button>
          ) : null}
        </div>
        <p className={compact ? 'text-sm text-ink/70' : 'text-base text-ink/70'}>
          {copy.homescreen.subtitle}
        </p>
      </div>

      <HomescreenPlatformCards
        className={
          compact ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-1 md:grid-cols-2 gap-3'
        }
      />
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
              <HomeScreenBody compact onClose={() => setOpen(false)} />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    )
  }

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <PageShell
        bg="surface"
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

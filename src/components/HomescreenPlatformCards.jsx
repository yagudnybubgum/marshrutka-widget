import { copy } from '../config/copy'
import { ArrowRightIcon } from './icons'
import { PromoCard } from './ui'

const IPHONE_GUIDE =
  'https://www.iphones.ru/iNotes/q/kak-v-ios-dobavit-yarlyk-lyubogo-sayta-na-rabochiy-stol'
const ANDROID_GUIDE =
  'https://androidinsider.ru/polezno-znat/kak-dobavit-yarlyk-sajta-na-rabochij-stol-android-smartfona.html'

const trailing = (
  <ArrowRightIcon className="ml-2 h-5 w-5 flex-shrink-0 text-ink/40" />
)

/**
 * Platform install cards on HomeScreen (muted on surface sheet/page).
 * Shared by HomeScreen + /ds so the gallery can't drift.
 */
export function HomescreenPlatformCards({ className = 'grid grid-cols-1 gap-3' }) {
  return (
    <div className={className}>
      <PromoCard
        variant="muted"
        external
        href={IPHONE_GUIDE}
        title={copy.homescreen.iphone}
        trailing={trailing}
      />
      <PromoCard
        variant="muted"
        external
        href={ANDROID_GUIDE}
        title={copy.homescreen.android}
        trailing={trailing}
      />
    </div>
  )
}

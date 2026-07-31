import { copy } from '../config/copy'
import { ArrowRightIcon } from './icons'
import { PromoCard } from './ui'

/** Home CTA → /homescreen. Shared by Home + /ds so the gallery can't drift. */
export function AddToHomescreenPromo({ className = '' }) {
  return (
    <PromoCard
      to="/homescreen"
      className={className}
      title={copy.home.promoTitle}
      subtitle={copy.home.promoSubtitle}
      trailing={
        <ArrowRightIcon className="ml-2 h-5 w-5 flex-shrink-0 text-accent-ink/70" />
      }
    />
  )
}

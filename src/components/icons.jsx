/** Material Symbols Outlined (weight 400) via @material-symbols/svg-400 */

import ChevronLeft from '@material-symbols/svg-400/outlined/chevron_left.svg?react'
import ArrowForward from '@material-symbols/svg-400/outlined/arrow_forward.svg?react'
import Close from '@material-symbols/svg-400/outlined/close.svg?react'
import LocationOn from '@material-symbols/svg-400/outlined/location_on.svg?react'

function withIconDefaults(Icon, defaultClassName) {
  return function MaterialSymbolIcon({ className = defaultClassName, ...props }) {
    return <Icon className={className} aria-hidden {...props} />
  }
}

export const ChevronLeftIcon = withIconDefaults(ChevronLeft, 'h-4 w-4')
export const ArrowRightIcon = withIconDefaults(ArrowForward, 'h-4 w-4')
export const XMarkIcon = withIconDefaults(Close, 'h-5 w-5')
export const MapPinIcon = withIconDefaults(LocationOn, 'h-4 w-4')

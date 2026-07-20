/** Material Symbols Outlined — единый набор иконок проекта */

function MaterialSymbol({ name, className = '', ...props }) {
  return (
    <span className={`material-symbols-outlined ${className}`.trim()} aria-hidden {...props}>
      {name}
    </span>
  )
}

export function ChevronLeftIcon({ className = 'text-[16px]', ...props }) {
  return <MaterialSymbol name="chevron_left" className={className} {...props} />
}

export function ArrowRightIcon({ className = 'text-[16px]', ...props }) {
  return <MaterialSymbol name="arrow_forward" className={className} {...props} />
}

export function XMarkIcon({ className = 'text-[20px]', ...props }) {
  return <MaterialSymbol name="close" className={className} {...props} />
}

export function MapPinIcon({ className = 'text-[16px]', ...props }) {
  return <MaterialSymbol name="location_on" className={className} {...props} />
}

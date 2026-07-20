/** Material-style outline icons — inline SVG (без Google Fonts) */

function OutlineIcon({ children, className = 'h-4 w-4', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  )
}

export function ChevronLeftIcon({ className = 'h-4 w-4', ...props }) {
  return (
    <OutlineIcon className={className} {...props}>
      <path d="M15.75 19.5 8.25 12l7.5-7.5" />
    </OutlineIcon>
  )
}

export function ArrowRightIcon({ className = 'h-4 w-4', ...props }) {
  return (
    <OutlineIcon className={className} {...props}>
      <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </OutlineIcon>
  )
}

export function XMarkIcon({ className = 'h-5 w-5', ...props }) {
  return (
    <OutlineIcon className={className} {...props}>
      <path d="M6 18 18 6M6 6l12 12" />
    </OutlineIcon>
  )
}

export function MapPinIcon({ className = 'h-4 w-4', ...props }) {
  return (
    <OutlineIcon className={className} {...props}>
      <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </OutlineIcon>
  )
}

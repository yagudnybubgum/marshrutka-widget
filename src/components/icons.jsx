/** Material Symbols Outlined — inline SVG (без Google Fonts) */

function MaterialIcon({ children, className = 'h-4 w-4', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
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
    <MaterialIcon className={className} {...props}>
      <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </MaterialIcon>
  )
}

export function ArrowRightIcon({ className = 'h-4 w-4', ...props }) {
  return (
    <MaterialIcon className={className} {...props}>
      <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
    </MaterialIcon>
  )
}

export function XMarkIcon({ className = 'h-5 w-5', ...props }) {
  return (
    <MaterialIcon className={className} {...props}>
      <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </MaterialIcon>
  )
}

export function MapPinIcon({ className = 'h-4 w-4', ...props }) {
  return (
    <MaterialIcon className={className} {...props}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5" />
    </MaterialIcon>
  )
}

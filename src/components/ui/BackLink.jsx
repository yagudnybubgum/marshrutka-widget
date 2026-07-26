import { Link } from 'react-router-dom'
import { ChevronLeftIcon } from '../icons'
import { copy } from '../../config/copy'

const baseClass =
  'text-ink hover:text-ink/70 transition-colors inline-flex items-center gap-1 text-sm font-normal'

export function BackLink({
  to,
  onClick,
  className = '',
  children = copy.nav.back,
  type = 'button',
  ...rest
}) {
  const classes = `${baseClass} ${className}`.trim()

  if (to != null) {
    return (
      <Link to={to} className={classes} {...rest}>
        <ChevronLeftIcon className="h-5 w-5" />
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes} {...rest}>
      <ChevronLeftIcon className="h-5 w-5" />
      {children}
    </button>
  )
}

import { Link } from 'react-router-dom'

const sizes = {
  base: 'text-base font-normal text-ink/70 hover:text-ink transition-colors',
  xs: 'text-xs text-ink/70 text-center hover:text-ink transition-colors',
  sm: 'text-sm font-normal text-ink/70 hover:text-ink transition-colors',
}

export function TextLink({
  to,
  href,
  external = false,
  size = 'base',
  className = '',
  children,
  ...rest
}) {
  const classes = `${sizes[size] ?? sizes.base} ${className}`.trim()

  if (to != null) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <a
      href={href}
      className={classes}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  )
}

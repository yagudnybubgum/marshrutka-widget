import { Link } from 'react-router-dom'

const variants = {
  accent: 'hover-darken bg-accent-soft text-accent-ink p-4',
  surface:
    'bg-surface border border-transparent hover:border-stroke transition-colors p-6',
}

export function PromoCard({
  to,
  href,
  external = false,
  title,
  subtitle,
  trailing,
  variant = 'accent',
  className = '',
  ...rest
}) {
  const chrome = variants[variant] ?? variants.accent
  const classes = `block rounded-xl cursor-pointer ${chrome} ${className}`.trim()

  const body = (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className={variant === 'surface' ? 'text-xl font-normal text-ink' : 'text-base font-normal'}>
          {title}
        </span>
        {subtitle ? (
          <span className="text-sm mt-0.5">{subtitle}</span>
        ) : null}
      </div>
      {trailing}
    </div>
  )

  if (to != null) {
    return (
      <Link to={to} className={classes} {...rest}>
        {body}
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
      {body}
    </a>
  )
}

import { Link } from 'react-router-dom'

const variants = {
  accent: 'hover-darken bg-accent-soft text-accent-ink p-4',
  // On bg-surface (e.g. HomeScreen sheet/page) — muted fill so cards don't disappear
  muted: 'hover-darken bg-surface-muted p-4',
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
  const classes = `block rounded-3xl cursor-pointer ${chrome} ${className}`.trim()

  const body = (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span
          className={
            variant === 'accent'
              ? 'text-base font-normal'
              : 'text-xl font-normal text-ink'
          }
        >
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

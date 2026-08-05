const chipBase =
  'relative inline-flex items-center flex-shrink-0 px-4 py-2 text-base font-normal rounded-full transition-colors'

export function Chip({
  active = false,
  variant = 'default',
  badge,
  onClick,
  className = '',
  style,
  type = 'button',
  children,
  ...rest
}) {
  const idle =
    variant === 'ghost'
      ? 'text-ink/70 hover:text-ink'
      : 'bg-surface-chip text-ink/70 hover:text-ink'
  const state = active ? 'bg-accent-soft text-accent-ink' : idle

  return (
    <button
      type={type}
      onClick={onClick}
      style={style}
      className={`${chipBase} ${state} ${className}`.trim()}
      {...rest}
    >
      {children}
      {badge ? (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
          {badge}
        </span>
      ) : null}
    </button>
  )
}

export function ChipGroup({ scroll = false, className = '', children }) {
  if (scroll) {
    // Bleed cancels Home page pad (px-2 / sm:px-4) so chips sit on the card outer edge
    return (
      <div className={`-mx-2 overflow-x-auto scrollbar-hide sm:-mx-4 ${className}`.trim()}>
        <div className="flex w-max flex-nowrap gap-2 px-2 pb-1 sm:px-4">{children}</div>
      </div>
    )
  }

  return <div className={`flex flex-wrap gap-2 ${className}`.trim()}>{children}</div>
}

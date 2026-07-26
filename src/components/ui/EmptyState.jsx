export function EmptyState({ children, className = '', ...rest }) {
  return (
    <div
      className={`rounded-lg bg-surface-sunken px-4 py-3 text-ink/70 ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  )
}

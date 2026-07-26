export function Alert({ children, className = '', variant = 'danger', ...rest }) {
  const variants = {
    danger: 'bg-danger text-danger-ink',
  }
  const tone = variants[variant] ?? variants.danger

  return (
    <div
      className={`rounded-lg px-4 py-3 ${tone} ${className}`.trim()}
      role="alert"
      {...rest}
    >
      {children}
    </div>
  )
}

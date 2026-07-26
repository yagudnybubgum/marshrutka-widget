const MAX_WIDTH = {
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '7xl': 'max-w-7xl',
}

const BG = {
  muted: 'bg-surface-muted',
  surface: 'bg-surface',
}

/**
 * @param {'min'|'full'} [fullHeight='min']
 * @param {'muted'|'surface'} [bg='muted']
 */
export function PageShell({
  children,
  footer,
  maxWidth = '5xl',
  bg = 'muted',
  fullHeight = 'min',
  padClassName = 'pt-5 pb-8 px-4 sm:py-10',
  className = '',
  contentClassName = '',
}) {
  const height = fullHeight === 'full' ? 'h-[100dvh]' : 'min-h-[100dvh]'
  const width = MAX_WIDTH[maxWidth] ?? MAX_WIDTH['5xl']
  const background = BG[bg] ?? BG.muted

  return (
    <div
      className={`${height} ${background} ${padClassName} flex flex-col ${className}`.trim()}
    >
      <div
        className={`${width} mx-auto w-full flex-1 flex flex-col min-h-0 ${contentClassName}`.trim()}
      >
        {children}
        {footer}
      </div>
    </div>
  )
}

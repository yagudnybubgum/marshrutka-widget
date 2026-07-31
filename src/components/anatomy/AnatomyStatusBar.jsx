/** iPhone-style status bar for anatomy mock (17:03 + signal/wifi/battery). */
export default function AnatomyStatusBar({ className = '' }) {
  return (
    <div
      data-status-bar
      className={`pointer-events-none absolute inset-x-0 top-0 z-30 flex h-[54px] items-end px-8 pb-2 text-ink ${className}`.trim()}
      aria-hidden
    >
      <span
        className="text-[15px] font-semibold leading-none tracking-[-0.02em]"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        17:03
      </span>
      <div className="ml-auto flex items-center gap-[6px] overflow-visible">
        <CellularIcon />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  )
}

function CellularIcon() {
  return (
    <svg
      width="17"
      height="12"
      viewBox="0 0 17 12"
      fill="currentColor"
      className="overflow-visible"
      aria-hidden
    >
      <rect x="0" y="7.5" width="3" height="4.5" rx="0.6" />
      <rect x="4.5" y="5" width="3" height="7" rx="0.6" />
      <rect x="9" y="2.5" width="3" height="9.5" rx="0.6" />
      <rect x="13.5" y="0.5" width="3" height="11.5" rx="0.6" />
    </svg>
  )
}

function WifiIcon() {
  return (
    <svg
      width="17"
      height="12"
      viewBox="0 0 16 12"
      fill="none"
      className="overflow-visible"
      aria-hidden
    >
      <path
        d="M8 9.4a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z"
        fill="currentColor"
      />
      <path
        d="M5.1 7.6a4.1 4.1 0 0 1 5.8 0"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path
        d="M3.1 5.5a6.9 6.9 0 0 1 9.8 0"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path
        d="M1.2 3.5a9.6 9.6 0 0 1 13.6 0"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BatteryIcon() {
  return (
    <svg
      width="25"
      height="12"
      viewBox="0 0 25 12"
      fill="none"
      className="overflow-visible"
      aria-hidden
    >
      <rect
        x="0.6"
        y="0.6"
        width="21"
        height="10.8"
        rx="2.2"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.4"
      />
      <rect x="2.2" y="2.2" width="17" height="7.6" rx="1.2" fill="currentColor" />
      <path
        d="M23 3.8v4.4c.9-.4 1.4-1 1.4-2.2S23.9 4.2 23 3.8Z"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  )
}

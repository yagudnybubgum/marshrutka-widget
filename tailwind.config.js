/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        full: 'var(--radius-full)',
      },
      colors: {
        surface: {
          DEFAULT: 'var(--surface)',
          muted: 'var(--surface-muted)',
          chip: 'var(--surface-chip)',
          sunken: 'var(--surface-sunken)',
        },
        // channels → text-ink/70, bg-ink/40, border-ink/10, …
        ink: 'rgb(var(--ink) / <alpha-value>)',
        accent: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-soft)',
          ink: 'rgb(var(--accent-ink) / <alpha-value>)',
        },
        alert: {
          DEFAULT: 'var(--alert)',
          ink: 'rgb(var(--alert-ink) / <alpha-value>)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          ink: 'var(--danger-ink)',
        },
        highlight: 'var(--highlight)',
        stroke: 'var(--stroke)',
        'map-line': 'var(--map-line)',
        route: {
          blue: 'var(--route-blue)',
          'blue-ink': 'var(--route-blue-ink)',
          green: 'var(--route-green)',
          'green-ink': 'var(--route-green-ink)',
          gray: 'var(--route-gray)',
          'gray-ink': 'var(--route-gray-ink)',
          purple: 'var(--route-purple)',
          'purple-ink': 'var(--route-purple-ink)',
          orange: 'var(--route-orange)',
          'orange-ink': 'var(--route-orange-ink)',
        },
      },
    },
  },
  plugins: [],
}

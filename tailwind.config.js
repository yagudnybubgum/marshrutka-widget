import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: 'var(--surface)',
          muted: 'var(--surface-muted)',
        },
        // channels → text-ink/70, bg-ink/40, border-ink/10, …
        ink: 'rgb(var(--ink) / <alpha-value>)',
        chip: {
          DEFAULT: 'var(--chip)',
          active: 'var(--chip-active)',
          'active-ink': 'rgb(var(--chip-active-ink) / <alpha-value>)',
          // companion to --chip-active (old blue-200), not a :root token
          'active-hover': '#bfdbfe',
        },
        alert: {
          DEFAULT: 'var(--alert)',
          hover: 'var(--alert-hover)',
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
  plugins: [daisyui],
}

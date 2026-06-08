import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#060606',
          surface: '#101010',
          elevated: '#161616',
          overlay: '#1f1f1f',
        },
        line: {
          DEFAULT: '#2b2b2b',
          light: '#1f1f1f',
          focus: '#C4A86A',
        },
        ink: {
          primary: '#F7F3EB',
          secondary: '#A69D8A',
          muted: '#7B7468',
        },
        gold: {
          DEFAULT: '#C4A86A',
          light: '#D9BC8C',
          dark: '#A58546',
          faint: '#C4A86A1A',
        },
        status: {
          waiting: '#4A4A4A',
          called: '#B45309',
          serving: '#15803D',
          done: '#1F2937',
          cancelled: '#7F1D1D',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        token: '0.2em',
        display: '0.25em',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fadeIn 0.3s ease-out both',
        'scale-in': 'scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        'number-enter': 'numberEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'blink': 'blink 1.2s step-end infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        numberEnter: {
          '0%': { opacity: '0', transform: 'translateY(24px) scale(0.88)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(200, 168, 106, 0.15)' },
          '50%': { opacity: '0.85', boxShadow: '0 0 0 8px rgba(200, 168, 106, 0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

export default config

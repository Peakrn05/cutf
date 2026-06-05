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
          base: '#090909',
          surface: '#111111',
          elevated: '#181818',
          overlay: '#222222',
        },
        line: {
          DEFAULT: '#222222',
          light: '#1a1a1a',
          focus: '#C8A86A',
        },
        ink: {
          primary: '#F0F0F0',
          secondary: '#7A7A7A',
          muted: '#4A4A4A',
        },
        gold: {
          DEFAULT: '#C8A86A',
          light: '#D4B87E',
          dark: '#A88848',
          faint: '#C8A86A1A',
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

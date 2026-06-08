'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Spinner } from './Spinner'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

const base =
  'inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-all duration-200 ease-spring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:pointer-events-none disabled:opacity-40 select-none'

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-gold-dark via-gold to-gold-light text-bg-base shadow-[0_20px_60px_-32px_rgba(196,168,106,0.40)] rounded-full hover:scale-[1.01] active:scale-100',
  secondary:
    'border border-line bg-bg-surface text-ink-primary hover:border-line-focus hover:text-gold active:bg-bg-elevated rounded-2xl',
  ghost:
    'text-ink-secondary hover:text-ink-primary hover:bg-bg-elevated active:bg-bg-overlay rounded-2xl',
  destructive:
    'border border-red-800 text-red-400 hover:bg-red-950 active:bg-red-900 rounded-2xl',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm rounded-md',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'button',
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      className,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        type={type}
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {loading && <Spinner size="sm" />}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

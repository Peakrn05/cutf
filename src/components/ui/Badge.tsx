import { cn } from '@/lib/utils'
import type { TokenStatus } from '@/types/queue'

type Variant = TokenStatus | 'neutral'

interface BadgeProps {
  variant?: Variant
  children: React.ReactNode
  className?: string
  dot?: boolean
}

const variants: Record<Variant, string> = {
  waiting:
    'bg-bg-elevated text-ink-secondary border border-line/40',
  called:
    'bg-[#FFF8F1] text-[#C07A2A] border border-[#F1E6D9]',
  serving:
    'bg-[#F1FBF6] text-emerald-700 border border-emerald-100',
  completed:
    'bg-bg-surface text-ink-muted border border-line-light',
  cancelled:
    'bg-[#FFF1F1] text-red-600 border border-red-100',
  skipped:
    'bg-bg-surface text-ink-muted border border-line-light',
  neutral:
    'bg-bg-elevated text-ink-secondary border border-line',
}

const dotColor: Record<Variant, string> = {
  waiting:   'bg-ink-muted',
  called:    'bg-amber-400',
  serving:   'bg-emerald-400',
  completed: 'bg-ink-muted',
  cancelled: 'bg-red-500',
  skipped:   'bg-ink-muted',
  neutral:   'bg-ink-secondary',
}

export function Badge({ variant = 'neutral', dot = false, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full',
        variants[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            dotColor[variant],
            variant === 'serving' && 'animate-pulse',
          )}
        />
      )}
      {children}
    </span>
  )
}

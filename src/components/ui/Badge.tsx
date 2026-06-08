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
    'bg-[#121212] text-ink-secondary border border-line/60',
  called:
    'bg-[#1b1408] text-[#D9BC8C] border border-[#5c4828]/50',
  serving:
    'bg-[#142116] text-emerald-300 border border-emerald-800/50',
  completed:
    'bg-[#111111] text-ink-muted border border-line-light',
  cancelled:
    'bg-red-950/40 text-red-400 border border-red-900/50',
  skipped:
    'bg-[#111111] text-ink-muted border border-line-light',
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

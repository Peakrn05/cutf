import { cn } from '@/lib/utils'
import type { TokenStatus } from '@/types/queue'

interface TokenDisplayProps {
  displayNumber: string
  status: TokenStatus
  animate?: boolean
}

const ringColors: Partial<Record<TokenStatus, string>> = {
  serving: 'border-emerald-600/50 ring-1 ring-emerald-600/20',
  called:  'border-amber-600/50 ring-1 ring-amber-600/20',
}

const numberColors: Partial<Record<TokenStatus, string>> = {
  serving: 'text-emerald-400',
  called:  'text-amber-400',
}

export function TokenDisplay({ displayNumber, status, animate = false }: TokenDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
        Your Token
      </p>
      <div
        className={cn(
          'flex items-center justify-center w-44 h-44 rounded-2xl border-2 bg-bg-surface',
          ringColors[status] ?? 'border-line',
          status === 'serving' && 'animate-pulse-gold',
          animate && 'animate-number-enter',
        )}
      >
        <span
          className={cn(
            'font-mono text-6xl font-bold tracking-token select-none',
            numberColors[status] ?? 'text-ink-primary',
          )}
        >
          {displayNumber}
        </span>
      </div>
    </div>
  )
}

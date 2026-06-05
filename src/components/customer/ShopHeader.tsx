import { cn } from '@/lib/utils'
import type { Shop } from '@/types/queue'

interface ShopHeaderProps {
  shop: Shop
  waitingCount: number
  estimatedWait: number
}

export function ShopHeader({ shop, waitingCount, estimatedWait }: ShopHeaderProps) {
  return (
    <header className="pt-8 pb-6 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-ink-primary">
        {shop.name}
      </h1>
      {shop.tagline && (
        <p className="mt-1 text-sm text-ink-muted">{shop.tagline}</p>
      )}

      <div className="mt-4 flex items-center justify-center gap-3">
        <StatusPill isOpen={shop.isOpen} />
        {shop.isOpen && waitingCount > 0 && (
          <>
            <span className="text-line">·</span>
            <span className="text-sm text-ink-secondary">
              {waitingCount} waiting
            </span>
            <span className="text-line">·</span>
            <span className="text-sm text-ink-secondary">
              ~{estimatedWait} min wait
            </span>
          </>
        )}
        {shop.isOpen && waitingCount === 0 && (
          <>
            <span className="text-line">·</span>
            <span className="text-sm text-emerald-500">No wait — walk right in</span>
          </>
        )}
      </div>
    </header>
  )
}

function StatusPill({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border',
        isOpen
          ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/40'
          : 'bg-bg-elevated text-ink-muted border-line',
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-ink-muted',
        )}
      />
      {isOpen ? 'Open' : 'Closed'}
    </span>
  )
}

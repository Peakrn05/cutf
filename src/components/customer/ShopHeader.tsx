import { cn } from '@/lib/utils'
import type { Shop } from '@/types/queue'

interface ShopHeaderProps {
  shop: Shop
  waitingCount: number
  estimatedWait: number
}

export function ShopHeader({ shop, waitingCount, estimatedWait }: ShopHeaderProps) {
  return (
    <header className="text-center">
      <p className="text-xs uppercase tracking-[0.35em] text-ink-muted">Premium barbershop</p>
      <div className="mt-4">
        <h1 className="text-4xl font-semibold tracking-tight text-ink-primary sm:text-5xl">
          {shop.name}
        </h1>
        {shop.tagline && (
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-ink-secondary sm:text-lg">
            {shop.tagline}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
        <StatusPill isOpen={shop.isOpen} />
        {shop.isOpen && waitingCount > 0 && (
          <> 
            <StatusDetail label="Waiting" value={`${waitingCount}`} />
            <StatusDetail label="Estimated" value={`${estimatedWait} min`} />
          </>
        )}
        {shop.isOpen && waitingCount === 0 && (
          <span className="text-sm text-emerald-400">No wait — walk right in</span>
        )}
      </div>
    </header>
  )
}

function StatusDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-line px-3 py-1 text-sm text-ink-secondary">
      <span className="font-semibold text-ink-primary">{value}</span> {label}
    </div>
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

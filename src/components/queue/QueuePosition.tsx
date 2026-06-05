import { cn, formatWait, statusLabel } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { QueueToken } from '@/types/queue'

interface QueuePositionProps {
  token: QueueToken
  currentServing: QueueToken | null
}

export function QueuePosition({ token, currentServing }: QueuePositionProps) {
  const isSelf = token.status === 'serving'
  const isCalled = token.status === 'called'

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <Badge variant={token.status} dot>
        {statusLabel(token.status)}
      </Badge>

      {(isCalled || isSelf) ? (
        <CallAlert isSelf={isSelf} />
      ) : token.status === 'waiting' ? (
        <WaitingInfo token={token} />
      ) : null}

      <div className="w-full rounded-xl bg-bg-elevated border border-line p-4 flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-ink-muted uppercase tracking-wider">Currently serving</span>
          <span
            className={cn(
              'font-mono text-2xl font-bold tracking-token',
              currentServing ? 'text-ink-primary' : 'text-ink-muted',
            )}
          >
            {currentServing ? currentServing.displayNumber : '---'}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 text-right">
          <span className="text-xs text-ink-muted uppercase tracking-wider">Service</span>
          <span className="text-sm text-ink-secondary">
            {token.serviceId.replace('-', ' + ').replace(/\b\w/g, c => c.toUpperCase())}
          </span>
        </div>
      </div>
    </div>
  )
}

function WaitingInfo({ token }: { token: QueueToken }) {
  const ahead = Math.max(0, token.position - 1)
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <p className="text-base text-ink-primary font-medium">
        {ahead === 0
          ? 'You are next'
          : `${ahead} ${ahead === 1 ? 'person' : 'people'} ahead of you`}
      </p>
      <p className="text-sm text-ink-secondary">
        Estimated wait{' '}
        <span className="text-ink-primary font-semibold">
          {formatWait(token.estimatedWait)}
        </span>
      </p>
    </div>
  )
}

function CallAlert({ isSelf }: { isSelf: boolean }) {
  return (
    <div
      className={cn(
        'w-full rounded-xl border p-4 text-center',
        isSelf
          ? 'bg-emerald-950/50 border-emerald-700/40 text-emerald-300'
          : 'bg-amber-950/50 border-amber-700/40 text-amber-300',
      )}
    >
      <p className="text-sm font-semibold">
        {isSelf
          ? 'You are being served now'
          : 'Please proceed to the barber — your turn is now'}
      </p>
    </div>
  )
}

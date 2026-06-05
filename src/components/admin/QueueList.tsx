'use client'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardSection } from '@/components/ui/Card'
import { formatWait, formatTime } from '@/lib/utils'
import type { QueueToken } from '@/types/queue'

interface QueueListProps {
  title: string
  tokens: QueueToken[]
  showActions?: boolean
  onSkip?: (id: string) => void
  isProcessing?: boolean
}

export function QueueList({
  title,
  tokens,
  showActions = false,
  onSkip,
  isProcessing = false,
}: QueueListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">
          {title}
        </h2>
        <span className="text-xs text-ink-muted font-mono">{tokens.length}</span>
      </div>

      {tokens.length === 0 ? (
        <Card>
          <CardSection className="py-8 text-center">
            <p className="text-sm text-ink-muted">None</p>
          </CardSection>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {tokens.map(token => (
            <TokenRow
              key={token.id}
              token={token}
              showActions={showActions}
              onSkip={onSkip}
              isProcessing={isProcessing}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function TokenRow({
  token,
  showActions,
  onSkip,
  isProcessing,
}: {
  token: QueueToken
  showActions: boolean
  onSkip?: (id: string) => void
  isProcessing?: boolean
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-surface border border-line">
      <span className="font-mono text-lg font-bold text-ink-primary tracking-token w-12 shrink-0">
        {token.displayNumber}
      </span>

      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-ink-secondary capitalize">
            {token.serviceId.replace('-', ' + ')}
          </span>
          {token.customerName && (
            <span className="text-xs text-ink-muted truncate">· {token.customerName}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {token.status === 'waiting' && (
            <span className="text-xs text-ink-muted">
              Wait {formatWait(token.estimatedWait)}
            </span>
          )}
          {(token.status === 'completed' || token.status === 'skipped') && token.completedAt && (
            <span className="text-xs text-ink-muted">
              {formatTime(token.completedAt)}
            </span>
          )}
          <Badge variant={token.status}>{token.status}</Badge>
        </div>
      </div>

      {showActions && token.status === 'waiting' && onSkip && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSkip(token.id)}
          disabled={isProcessing}
          className="shrink-0 text-xs"
        >
          Skip
        </Button>
      )}
    </div>
  )
}

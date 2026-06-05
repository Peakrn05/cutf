'use client'

import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardSection, CardDivider } from '@/components/ui/Card'
import { minutesSince } from '@/lib/utils'
import type { QueueToken } from '@/types/queue'

interface CurrentServingProps {
  token: QueueToken | null
  nextToken: QueueToken | null
  onComplete: () => void
  onCallNext: () => void
  isProcessing: boolean
}

export function CurrentServing({
  token,
  nextToken,
  onComplete,
  onCallNext,
  isProcessing,
}: CurrentServingProps) {
  return (
    <Card className="mb-6">
      <CardSection className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">
            Now Serving
          </h2>
          {token && (
            <Badge variant="serving" dot>In Service</Badge>
          )}
        </div>

        {token ? (
          <ServingCard token={token} onComplete={onComplete} isProcessing={isProcessing} />
        ) : (
          <EmptyServing nextToken={nextToken} onCallNext={onCallNext} isProcessing={isProcessing} />
        )}
      </CardSection>

      {token && nextToken && (
        <>
          <CardDivider />
          <CardSection className="px-5 py-3 flex items-center justify-between">
            <div>
              <span className="text-xs text-ink-muted">Next up </span>
              <span className="font-mono text-sm font-bold text-ink-secondary ml-1">
                {nextToken.displayNumber}
              </span>
              {nextToken.customerName && (
                <span className="text-xs text-ink-muted ml-1">· {nextToken.customerName}</span>
              )}
            </div>
          </CardSection>
        </>
      )}
    </Card>
  )
}

function ServingCard({
  token,
  onComplete,
  isProcessing,
}: {
  token: QueueToken
  onComplete: () => void
  isProcessing: boolean
}) {
  const elapsed = token.servingStartedAt ? minutesSince(token.servingStartedAt) : 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <span className="font-mono text-4xl font-bold text-gold tracking-token">
            {token.displayNumber}
          </span>
          {token.customerName && (
            <p className="text-sm text-ink-secondary mt-1">{token.customerName}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs text-ink-muted uppercase tracking-wider">Service</p>
          <p className="text-sm font-medium text-ink-primary mt-0.5">
            {token.serviceId.replace('-', ' + ').replace(/\b\w/g, c => c.toUpperCase())}
          </p>
          <p className="text-xs text-ink-muted mt-1">{elapsed} min elapsed</p>
        </div>
      </div>

      <Button
        onClick={onComplete}
        loading={isProcessing}
        size="lg"
        fullWidth
        className="mt-1"
      >
        Mark Complete &amp; Call Next
      </Button>
    </div>
  )
}

function EmptyServing({
  nextToken,
  onCallNext,
  isProcessing,
}: {
  nextToken: QueueToken | null
  onCallNext: () => void
  isProcessing: boolean
}) {
  if (!nextToken) {
    return (
      <p className="text-sm text-ink-muted py-4 text-center">
        No customers in queue.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-secondary">
        No one is currently being served.
      </p>
      <Button onClick={onCallNext} loading={isProcessing} size="lg" fullWidth>
        Call Token {nextToken.displayNumber}
      </Button>
    </div>
  )
}

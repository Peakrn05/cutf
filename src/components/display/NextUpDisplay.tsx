import type { QueueToken } from '@/types/queue'

interface NextUpDisplayProps {
  tokens: QueueToken[]
}

export function NextUpDisplay({ tokens }: NextUpDisplayProps) {
  if (tokens.length === 0) return null

  return (
    <div className="flex flex-col items-center gap-5 pb-8">
      <p className="text-xs font-semibold tracking-[0.35em] uppercase text-ink-muted">
        Next Up
      </p>
      <div className="flex gap-6">
        {tokens.map((token, i) => (
          <div
            key={token.id}
            className="flex flex-col items-center gap-1"
            style={{ opacity: 1 - i * 0.2 }}
          >
            <span className="font-mono text-[clamp(2rem,5vw,3.5rem)] font-bold text-ink-secondary leading-none tracking-display">
              {token.displayNumber}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

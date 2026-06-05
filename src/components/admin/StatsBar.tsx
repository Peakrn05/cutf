import type { Shop, QueueSummary } from '@/types/queue'

interface StatsBarProps {
  shop: Shop
  summary: QueueSummary
  completedToday: number
}

export function StatsBar({ shop, summary, completedToday }: StatsBarProps) {
  const stats = [
    { label: 'Waiting',        value: String(summary.waitingCount) },
    { label: 'Served Today',   value: String(completedToday) },
    { label: 'Avg. Time',      value: `${shop.averageServiceTime} min` },
    { label: 'Total Issued',   value: String(shop.dailyCount) },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map(stat => (
        <div
          key={stat.label}
          className="flex flex-col gap-0.5 rounded-xl bg-bg-surface border border-line px-4 py-3"
        >
          <span className="text-2xs uppercase tracking-widest text-ink-muted font-medium">
            {stat.label}
          </span>
          <span className="text-xl font-bold text-ink-primary font-mono">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  )
}

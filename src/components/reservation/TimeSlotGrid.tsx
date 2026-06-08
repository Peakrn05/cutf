'use client'

import { cn } from '@/lib/utils'
import type { TimeSlot } from '@/types/slot'

interface TimeSlotGridProps {
  slots: TimeSlot[]
  selected: string | null
  onSelect: (time: string) => void
}

function fmt(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${suffix}`
}

export function TimeSlotGrid({ slots, selected, onSelect }: TimeSlotGridProps) {
  if (slots.length === 0) {
    return (
      <p className="text-center text-sm text-ink-muted py-6">No slots available for this day.</p>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {slots.map(slot => (
        <button
          key={slot.time}
          type="button"
          disabled={!slot.available}
          onClick={() => slot.available && onSelect(slot.time)}
          className={cn(
            'py-2.5 rounded-xl border text-sm font-medium transition-colors duration-150',
            !slot.available && 'border-line bg-bg-elevated text-ink-muted opacity-40 cursor-not-allowed line-through',
            slot.available && selected === slot.time && 'border-gold/60 bg-gold/10 text-gold',
            slot.available && selected !== slot.time && 'border-line bg-bg-elevated text-ink-secondary hover:border-line-focus hover:text-ink-primary',
          )}
        >
          {fmt(slot.time)}
        </button>
      ))}
    </div>
  )
}

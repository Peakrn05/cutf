'use client'

import { cn, formatDuration, formatPrice } from '@/lib/utils'
import type { Service, ServiceId } from '@/types/queue'

interface ServiceSelectorProps {
  services: Service[]
  selected: ServiceId | null
  onSelect: (id: ServiceId) => void
}

export function ServiceSelector({ services, selected, onSelect }: ServiceSelectorProps) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-ink-secondary">Select a service</p>
      <div className="grid grid-cols-2 gap-2.5">
        {services.map(service => (
          <ServiceCard
            key={service.id}
            service={service}
            isSelected={selected === service.id}
            onSelect={() => onSelect(service.id)}
          />
        ))}
      </div>
    </div>
  )
}

interface ServiceCardProps {
  service: Service
  isSelected: boolean
  onSelect: () => void
}

function ServiceCard({ service, isSelected, onSelect }: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={cn(
        'relative flex flex-col items-start gap-1 p-3.5 rounded-xl border text-left transition-all duration-200 ease-spring',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1 focus-visible:ring-offset-bg-base',
        isSelected
          ? 'bg-gold/8 border-gold/60 ring-1 ring-gold/20'
          : 'bg-bg-surface border-line hover:border-line-focus hover:bg-bg-elevated',
      )}
    >
      {isSelected && (
        <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-gold" />
      )}
      <span
        className={cn(
          'text-sm font-semibold leading-tight',
          isSelected ? 'text-gold' : 'text-ink-primary',
        )}
      >
        {service.name}
      </span>
      <span className="text-xs text-ink-muted">{formatDuration(service.duration)}</span>
      <span
        className={cn(
          'text-sm font-bold mt-0.5',
          isSelected ? 'text-gold' : 'text-ink-secondary',
        )}
      >
        {formatPrice(service.price)}
      </span>
    </button>
  )
}

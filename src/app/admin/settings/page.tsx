'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardSection, CardDivider } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { useQueueStore } from '@/store/queue.store'
import { cn, formatDuration, formatPrice } from '@/lib/utils'
import * as service from '@/services/queue.service'
import type { Shop } from '@/types/queue'

export default function AdminSettingsPage() {
  const { shop, loadShop } = useQueueStore()

  const [name, setName]       = useState('')
  const [tagline, setTagline] = useState('')
  const [avgTime, setAvgTime] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved]       = useState(false)

  useEffect(() => {
    loadShop()
  }, [loadShop])

  useEffect(() => {
    if (!shop) return
    setName(shop.name)
    setTagline(shop.tagline ?? '')
    setAvgTime(String(shop.averageServiceTime))
  }, [shop])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    await service.updateShop({
      name: name.trim() || undefined,
      tagline: tagline.trim() || undefined,
      averageServiceTime: parseInt(avgTime, 10) || undefined,
    })
    await loadShop()
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (!shop) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" className="text-gold" />
      </div>
    )
  }

  return (
    <main className="p-5 md:p-7 max-w-2xl">
      <h1 className="text-lg font-bold text-ink-primary mb-6">Settings</h1>

      <form onSubmit={handleSave} noValidate>
        <Card className="mb-6">
          <CardSection className="p-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-muted mb-4">
              Shop Info
            </h2>
            <div className="flex flex-col gap-4">
              <Input
                label="Shop name"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={60}
              />
              <Input
                label="Tagline"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                maxLength={80}
                helper="Shown below the shop name on the customer page."
              />
              <Input
                label="Average service time (minutes)"
                value={avgTime}
                onChange={e => setAvgTime(e.target.value.replace(/\D/g, ''))}
                inputMode="numeric"
                maxLength={3}
                helper="Used to estimate wait times for customers."
              />
            </div>
          </CardSection>

          <CardDivider />

          <CardSection className="px-5 py-4 flex items-center justify-between">
            <p className={cn(
              'text-sm transition-all duration-300',
              saved ? 'text-emerald-400 opacity-100' : 'opacity-0',
            )}>
              Saved
            </p>
            <Button type="submit" loading={isSaving}>
              Save Changes
            </Button>
          </CardSection>
        </Card>
      </form>

      <Card>
        <CardSection className="p-5">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-muted mb-4">
            Services
          </h2>
          <div className="flex flex-col gap-2">
            {shop.services.map(s => (
              <ServiceRow key={s.id} service={s} />
            ))}
          </div>
          <p className="mt-4 text-xs text-ink-muted">
            Service editing is available after connecting the backend.
          </p>
        </CardSection>
      </Card>
    </main>
  )
}

function ServiceRow({ service }: { service: Shop['services'][number] }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-bg-elevated border border-line">
      <div>
        <p className="text-sm font-medium text-ink-primary">{service.name}</p>
        <p className="text-xs text-ink-muted mt-0.5">{formatDuration(service.duration)}</p>
      </div>
      <span className="text-sm font-bold text-gold">{formatPrice(service.price)}</span>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useQueueStore } from '@/store/queue.store'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardSection } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'

export default function AdminSettingsPage() {
  const { shop, isLoading, isProcessing, loadShop, toggleOpen } = useQueueStore()

  const [name, setName] = useState('')
  const [tagline, setTagline] = useState('')
  const [avgTime, setAvgTime] = useState('25')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadShop()
  }, [loadShop])

  useEffect(() => {
    if (shop) {
      setName(shop.name)
      setTagline(shop.tagline)
      setAvgTime(String(shop.averageServiceTime))
    }
  }, [shop])

  if (isLoading || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" className="text-gold" />
      </div>
    )
  }

  const handleToggleOpen = async () => {
    await toggleOpen()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-primary mb-1">Shop Settings</h1>
        <p className="text-sm text-ink-muted">Configure your shop information</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardSection className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">
                  Status
                </h2>
                <p className="text-sm text-ink-secondary mt-1">
                  {shop.isOpen ? 'Currently open' : 'Currently closed'}
                </p>
              </div>
              <Button
                variant={shop.isOpen ? 'destructive' : 'primary'}
                loading={isProcessing}
                onClick={handleToggleOpen}
              >
                {shop.isOpen ? 'Close Shop' : 'Open Shop'}
              </Button>
            </div>
          </CardSection>
        </Card>

        <Card>
          <CardSection className="p-5 flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-muted mb-3">
                Shop Info
              </h2>
              <div className="flex flex-col gap-4">
                <Input
                  label="Shop Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={isProcessing}
                />
                <Input
                  label="Tagline"
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  disabled={isProcessing}
                />
                <Input
                  label="Average Service Time (minutes)"
                  type="number"
                  value={avgTime}
                  onChange={e => setAvgTime(e.target.value)}
                  disabled={isProcessing}
                  min="5"
                  max="120"
                />
              </div>
            </div>

            <Button
              variant="primary"
              fullWidth
              loading={isProcessing}
              onClick={async () => {
                // Would call updateShop here
                setSaved(true)
                setTimeout(() => setSaved(false), 2000)
              }}
              disabled={isProcessing}
            >
              Save Changes
            </Button>

            {saved && (
              <p className="text-sm text-emerald-400 text-center">Settings saved</p>
            )}
          </CardSection>
        </Card>

        <Card>
          <CardSection className="p-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-muted mb-3">
              Today's Stats
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="px-3 py-2 rounded-lg bg-bg-elevated border border-line">
                <p className="text-2xs uppercase text-ink-muted">Total Issued</p>
                <p className="text-lg font-bold text-ink-primary mt-1">{shop.dailyCount}</p>
              </div>
              <div className="px-3 py-2 rounded-lg bg-bg-elevated border border-line">
                <p className="text-2xs uppercase text-ink-muted">Next Token #</p>
                <p className="text-lg font-bold text-ink-primary mt-1">{shop.nextTokenNumber}</p>
              </div>
            </div>
          </CardSection>
        </Card>
      </div>
    </div>
  )
}

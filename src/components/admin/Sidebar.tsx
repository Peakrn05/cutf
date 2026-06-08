'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  description: string
}

const NAV: NavItem[] = [
  { label: 'Queue',      href: '/admin',          description: 'Manage live queue' },
  { label: 'Reserve',    href: '/reserve',        description: 'Book a customer slot' },
  { label: 'Settings',   href: '/admin/settings', description: 'Shop configuration' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-line bg-bg-base min-h-screen sticky top-0">
        <div className="px-5 py-6 border-b border-line">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Admin</p>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {NAV.map(item => (
            <NavLink key={item.href} item={item} current={pathname === item.href} />
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-line">
          <Link
            href="/"
            className="text-xs text-ink-muted hover:text-ink-secondary transition-colors"
          >
            Back to customer view
          </Link>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t border-line bg-bg-base">
        {NAV.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex-1 flex flex-col items-center py-3 text-xs font-medium transition-colors',
              pathname === item.href
                ? 'text-gold'
                : 'text-ink-muted hover:text-ink-secondary',
            )}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/"
          className="flex-1 flex flex-col items-center py-3 text-xs font-medium text-ink-muted hover:text-ink-secondary transition-colors"
        >
          Customer
        </Link>
      </nav>
    </>
  )
}

function NavLink({ item, current }: { item: NavItem; current: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        'flex flex-col gap-0.5 px-3 py-2.5 rounded-lg transition-all duration-150',
        current
          ? 'bg-gold/10 text-gold'
          : 'text-ink-secondary hover:bg-bg-elevated hover:text-ink-primary',
      )}
    >
      <span className="text-sm font-medium">{item.label}</span>
      <span className={cn('text-xs', current ? 'text-gold/70' : 'text-ink-muted')}>
        {item.description}
      </span>
    </Link>
  )
}

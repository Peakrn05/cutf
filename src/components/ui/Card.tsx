import { cn } from '@/lib/utils'

type Variant = 'default' | 'elevated' | 'flat' | 'highlighted'

interface CardProps {
  variant?: Variant
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

const variants: Record<Variant, string> = {
  default:     'bg-bg-surface border border-line/70 rounded-[28px] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.48)]',
  elevated:    'bg-bg-elevated border border-line/70 rounded-[28px] shadow-[0_36px_100px_-48px_rgba(0,0,0,0.50)]',
  flat:        'bg-bg-surface rounded-[28px]',
  highlighted: 'bg-bg-surface border border-gold/30 rounded-[28px] ring-1 ring-gold/10 shadow-[0_20px_60px_-34px_rgba(196,168,106,0.25)]',
}

export function Card({ variant = 'default', className, children, onClick }: CardProps) {
  const isClickable = typeof onClick === 'function'
  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick() } : undefined}
      className={cn(
        variants[variant],
        isClickable && 'cursor-pointer hover:border-line-focus transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardSection({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('p-4', className)}>{children}</div>
}

export function CardDivider({ className }: { className?: string }) {
  return <div className={cn('h-px bg-line', className)} />
}

import { cn } from '@/lib/utils'

type Variant = 'default' | 'elevated' | 'flat' | 'highlighted'

interface CardProps {
  variant?: Variant
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

const variants: Record<Variant, string> = {
  default:     'bg-bg-surface border border-line rounded-2xl shadow-[0_12px_30px_rgba(38,34,30,0.06)]',
  elevated:    'bg-bg-elevated border border-line rounded-2xl shadow-[0_18px_50px_rgba(38,34,30,0.06)]',
  flat:        'bg-bg-surface rounded-2xl',
  highlighted: 'bg-bg-surface border border-gold/20 rounded-2xl ring-1 ring-gold/6 shadow-[0_10px_30px_rgba(196,168,106,0.06)]',
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

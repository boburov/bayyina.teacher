import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-brown-100 text-brown-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50  text-amber-700',
  danger:  'bg-red-50    text-red-600',
  info:    'bg-blue-50   text-blue-600',
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

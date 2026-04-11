import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brown-800 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-brown-100 text-brown-700',
        secondary:
          'border-transparent bg-brown-800 text-white',
        success:
          'border-transparent bg-emerald-50 text-emerald-700 border-emerald-100',
        destructive:
          'border-transparent bg-red-50 text-red-600 border-red-100',
        warning:
          'border-transparent bg-amber-50 text-amber-700 border-amber-100',
        outline:
          'border-brown-200 text-brown-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brown-800 text-white hover:bg-brown-900',
  secondary:
    'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200',
  ghost:
    'bg-transparent text-gray-600 hover:bg-gray-100',
  danger:
    'bg-white text-red-600 hover:bg-red-50 border border-red-200',
  outline:
    'bg-white text-brown-800 border border-brown-800 hover:bg-brown-50',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8  px-3   text-xs   gap-1.5',
  md: 'h-9  px-4   text-sm   gap-2',
  lg: 'h-10 px-5   text-sm   gap-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-sm',
          'transition-colors duration-100',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brown-800',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          'select-none',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Yuklanmoqda…</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'

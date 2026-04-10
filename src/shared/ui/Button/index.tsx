import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brown-800 text-white hover:bg-brown-900 active:bg-brown-900 shadow-soft',
  secondary:
    'bg-brown-100 text-brown-800 hover:bg-brown-200 active:bg-brown-200',
  ghost:
    'bg-transparent text-brown-700 hover:bg-brown-50 active:bg-brown-100',
  danger:
    'bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8  px-3   text-sm   rounded-xl  gap-1.5',
  md: 'h-10 px-4   text-sm   rounded-xl  gap-2',
  lg: 'h-12 px-6   text-base rounded-2xl gap-2',
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
          'inline-flex items-center justify-center font-medium',
          'transition-all duration-150 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-400 focus-visible:ring-offset-2',
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
            <span className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
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

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brown-800 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none',
  {
    variants: {
      variant: {
        default:
          'bg-brown-800 text-white hover:bg-brown-900',
        primary:
          'bg-brown-800 text-white hover:bg-brown-900',
        destructive:
          'bg-white text-red-600 border border-red-200 hover:bg-red-50',
        danger:
          'bg-white text-red-600 border border-red-200 hover:bg-red-50',
        outline:
          'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
        secondary:
          'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200',
        ghost:
          'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        link:
          'text-brown-800 underline-offset-4 hover:underline',
        success:
          'bg-emerald-600 text-white hover:bg-emerald-700',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm:      'h-8 px-3 text-xs gap-1.5',
        lg:      'h-10 px-5',
        icon:    'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading,
      fullWidth,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && 'w-full',
          className,
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }

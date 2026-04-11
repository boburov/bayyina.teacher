import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl border bg-white px-3 py-2 text-sm text-brown-900 shadow-sm',
          'placeholder:text-brown-300',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-800 focus-visible:ring-offset-0',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-red-400 focus-visible:ring-red-400'
            : 'border-brown-200 hover:border-brown-300',
          className,
        )}
        ref={ref}
        aria-invalid={!!error}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }

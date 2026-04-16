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
          'flex h-9 w-full rounded-sm border bg-white px-3 py-2 text-sm text-gray-900',
          'placeholder:text-gray-400',
          'transition-colors duration-100',
          'focus-visible:outline-none focus-visible:border-brown-800',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-red-400 focus-visible:border-red-500'
            : 'border-gray-300 hover:border-gray-400',
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

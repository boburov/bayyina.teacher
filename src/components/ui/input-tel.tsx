import { forwardRef, useRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/** Strips non-digit chars, strips leading 998/0 prefix */
function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

/** +998 (90) 123-45-67 */
export function applyPhoneMask(raw: string): string {
  const d = digitsOnly(raw)
  const n = (d.startsWith('998') ? d.slice(3) : d.startsWith('0') ? d.slice(1) : d).slice(0, 9)

  if (n.length === 0) return ''
  if (n.length <= 2) return `+998 (${n}`
  if (n.length <= 5) return `+998 (${n.slice(0, 2)}) ${n.slice(2)}`
  if (n.length <= 7) return `+998 (${n.slice(0, 2)}) ${n.slice(2, 5)}-${n.slice(5)}`
  return `+998 (${n.slice(0, 2)}) ${n.slice(2, 5)}-${n.slice(5, 7)}-${n.slice(7)}`
}

/** Returns 9-digit local number (no country code) */
export function phoneDigits(formatted: string): string {
  const d = digitsOnly(formatted)
  return d.startsWith('998') ? d.slice(3) : d
}

interface InputTelProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  value?:    string
  onChange?: (formatted: string) => void
  label?:    string
  error?:    string
}

export const InputTel = forwardRef<HTMLInputElement, InputTelProps>(
  ({ value = '', onChange, label, error, className, id, ...props }, ref) => {
    const inputId   = id ?? label?.toLowerCase().replace(/\s+/g, '-') ?? 'phone'
    const caretRef  = useRef<number | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = applyPhoneMask(e.target.value)
      caretRef.current = formatted.length
      onChange?.(formatted)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow only: digits, Backspace, Delete, arrows, Tab, Home, End
      const allowed = /^[0-9]$/.test(e.key) ||
        ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'].includes(e.key)
      if (!allowed && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
      }
    }

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="+998 (XX) XXX-XX-XX"
          className={cn(
            'w-full h-9 rounded-sm border bg-white px-3 text-sm text-gray-900',
            'placeholder:text-gray-400 transition-colors duration-100',
            'focus:outline-none focus:border-brown-800',
            error
              ? 'border-red-400 focus:border-red-500'
              : 'border-gray-300 hover:border-gray-400',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  },
)

InputTel.displayName = 'InputTel'

import { Check } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked?:   boolean
  onChange?:  (checked: boolean) => void
  label?:     string
  className?: string
}

export function Checkbox({ checked = false, onChange, label, disabled, className }: CheckboxProps) {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-2 cursor-pointer select-none',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className={cn(
          'flex items-center justify-center w-4 h-4 rounded border transition-colors shrink-0',
          checked
            ? 'bg-brown-800 border-brown-800'
            : 'bg-white border-gray-300 hover:border-gray-500',
        )}
      >
        {checked && <Check size={10} strokeWidth={3} className="text-white" />}
      </button>
      {label && (
        <span className="text-sm text-gray-700">{label}</span>
      )}
    </label>
  )
}

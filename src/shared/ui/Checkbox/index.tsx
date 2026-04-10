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
          'flex items-center justify-center w-5 h-5 rounded-md border-2 transition-all duration-150 shrink-0',
          checked
            ? 'bg-brown-800 border-brown-800'
            : 'bg-white border-brown-300 hover:border-brown-500',
        )}
      >
        {checked && <Check size={11} strokeWidth={3} className="text-white" />}
      </button>
      {label && (
        <span className="text-sm text-brown-700">{label}</span>
      )}
    </label>
  )
}

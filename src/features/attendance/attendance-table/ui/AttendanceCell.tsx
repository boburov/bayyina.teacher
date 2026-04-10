import { Check, X, Minus } from 'lucide-react'
import type { AttendanceStatus } from '@/entities/attendance/model/types'
import { cn } from '@/shared/lib/cn'

interface AttendanceCellProps {
  status:   AttendanceStatus | null
  isToday:  boolean
  onChange?: (status: AttendanceStatus) => void
}

export function AttendanceCell({ status, isToday, onChange }: AttendanceCellProps) {
  const disabled = !isToday

  // null only happens for past days with missing data → show a neutral dash
  if (status === null) {
    return (
      <td
        className={cn(
          'border-b border-r border-brown-50 px-2 py-2.5 text-center',
          isToday ? 'bg-amber-50/40' : 'bg-white',
        )}
      >
        <span className="flex justify-center text-brown-300">
          <Minus size={14} />
        </span>
      </td>
    )
  }

  const isPresent = status === 'present'

  return (
    <td
      className={cn(
        'border-b border-r border-brown-50 px-2 py-2.5 text-center transition-colors',
        isToday ? 'bg-amber-50/40' : 'bg-white',
      )}
    >
      <div className="flex justify-center">
        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            !disabled && onChange?.(isPresent ? 'absent' : 'present')
          }
          title={isPresent ? 'Keldi — bosib o\'zgartirish' : 'Kelmadi — bosib o\'zgartirish'}
          aria-label={isPresent ? 'Keldi' : 'Kelmadi'}
          aria-pressed={isPresent}
          className={cn(
            'flex items-center justify-center w-7 h-7 rounded-lg border-2 transition-all duration-150',
            isPresent
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'bg-rose-400   border-rose-400   text-white',
            // past cells: muted + no-cursor
            disabled && 'opacity-50 cursor-not-allowed',
            // today cells: interactive feedback
            !disabled && isPresent  && 'hover:bg-emerald-600 hover:border-emerald-600 active:scale-90',
            !disabled && !isPresent && 'hover:bg-rose-500   hover:border-rose-500   active:scale-90',
          )}
        >
          {isPresent
            ? <Check size={13} strokeWidth={3} />
            : <X     size={13} strokeWidth={3} />
          }
        </button>
      </div>
    </td>
  )
}

import { Check, X, CheckSquare, XSquare, CheckCircle } from 'lucide-react'
import { useAttendanceForm } from '../model/useAttendance'
import type { Student } from '@/entities/group/model/types'
import { Button }  from '@/shared/ui/Button'
import { Badge }   from '@/shared/ui/Badge'
import { cn }      from '@/shared/lib/cn'

interface AttendanceFormProps {
  groupId: string
  students: Student[]
  onBack?: () => void
}

export function AttendanceForm({ groupId, students, onBack }: AttendanceFormProps) {
  const {
    statuses,
    toggle,
    markAll,
    submit,
    isSubmitting,
    isError,
    submitted,
    today,
    presentCount,
    absentCount,
  } = useAttendanceForm(groupId, students)

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50">
          <CheckCircle size={32} className="text-emerald-500" />
        </div>
        <h3 className="text-lg font-semibold text-brown-900">Davomat saqlandi!</h3>
        <p className="text-sm text-brown-500">
          {today} — {presentCount} nafar keldi, {absentCount} nafar kelmadi
        </p>
        {onBack && (
          <Button variant="secondary" onClick={onBack} className="mt-2">
            Orqaga qaytish
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-sm text-brown-500">
          <span className="font-medium text-emerald-600">{presentCount}</span> keldi
          <span className="mx-1 text-brown-200">·</span>
          <span className="font-medium text-red-500">{absentCount}</span> kelmadi
        </div>
        <div className="ml-auto flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAll('present')}
            className="text-emerald-600 hover:bg-emerald-50"
          >
            <CheckSquare size={14} />
            Barchasi keldi
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAll('absent')}
            className="text-red-500 hover:bg-red-50"
          >
            <XSquare size={14} />
            Barchasi kelmadi
          </Button>
        </div>
      </div>

      {/* Student list */}
      <div className="flex flex-col gap-2">
        {students.map((student, idx) => {
          const status  = statuses[student.id]
          const present = status === 'present'
          return (
            <button
              key={student.id}
              onClick={() => toggle(student.id)}
              className={cn(
                'flex items-center gap-4 px-4 py-3 rounded-xl border transition-all duration-150 text-left w-full group',
                present
                  ? 'bg-emerald-50/60 border-emerald-200 hover:border-emerald-300'
                  : 'bg-red-50/40 border-red-200 hover:border-red-300',
              )}
            >
              <span className="text-sm text-brown-400 w-5 text-right shrink-0">{idx + 1}</span>
              <span className="flex-1 text-sm font-medium text-brown-900">{student.name}</span>
              {student.phone && (
                <span className="hidden sm:block text-xs text-brown-400 font-mono">{student.phone}</span>
              )}
              <span
                className={cn(
                  'flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-colors',
                  present
                    ? 'bg-emerald-500 text-white'
                    : 'bg-red-400 text-white',
                )}
              >
                {present ? <Check size={14} strokeWidth={2.5} /> : <X size={14} strokeWidth={2.5} />}
              </span>
              <Badge variant={present ? 'success' : 'danger'}>
                {present ? 'Keldi' : 'Kelmadi'}
              </Badge>
            </button>
          )
        })}
      </div>

      {isError && (
        <p className="text-sm text-red-500 text-center">
          Xatolik yuz berdi. Qayta urinib ko'ring.
        </p>
      )}

      <div className="flex gap-3 pt-2">
        {onBack && (
          <Button variant="secondary" onClick={onBack} disabled={isSubmitting}>
            Bekor qilish
          </Button>
        )}
        <Button
          variant="primary"
          onClick={() => submit()}
          loading={isSubmitting}
          fullWidth
          size="lg"
        >
          Davomatni saqlash
        </Button>
      </div>
    </div>
  )
}

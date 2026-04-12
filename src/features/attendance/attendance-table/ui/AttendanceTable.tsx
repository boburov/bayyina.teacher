import { Check, X, CheckSquare, XSquare, Save, Users } from 'lucide-react'
import type { Group } from '@/entities/group/model/types'
import { useAttendanceTable } from '../model/useAttendanceTable'
import { AttendanceCell } from './AttendanceCell'
import { Button }   from '@/shared/ui/Button'
import { Skeleton } from '@/shared/ui/Skeleton'
import { cn }       from '@/shared/lib/cn'
import { parseColumnHeader } from '@/shared/lib/dates'

interface AttendanceTableProps {
  group: Group
}

// ─── Skeleton while loading ────────────────────────────────────────────────────

function AttendanceTableSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex border-b border-gray-100 last:border-0">
            <Skeleton className="h-11 w-44 m-2 rounded shrink-0" />
            {Array.from({ length: 10 }).map((__, j) => (
              <Skeleton key={j} className="h-7 w-7 m-2 rounded shrink-0" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex items-center gap-4 text-xs text-gray-500">
      <span className="flex items-center gap-1.5">
        <span className="flex items-center justify-center w-5 h-5 rounded bg-emerald-500">
          <Check size={10} strokeWidth={3} className="text-white" />
        </span>
        Keldi
      </span>
      <span className="flex items-center gap-1.5">
        <span className="flex items-center justify-center w-5 h-5 rounded bg-rose-500">
          <X size={10} strokeWidth={3} className="text-white" />
        </span>
        Kelmadi
      </span>
      <span className="flex items-center gap-1.5 ml-2 text-gray-400 border-l border-gray-200 pl-4">
        <span className="inline-block w-3 h-3 rounded-sm bg-amber-200 border border-amber-300" />
        Bugun (tahrirlash mumkin)
      </span>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export function AttendanceTable({ group }: AttendanceTableProps) {
  const {
    dates,
    historyRecords,
    todayStatuses,
    today,
    isLoading,
    isSubmitting,
    setStudentStatus,
    markAll,
    submit,
    presentCount,
    absentCount,
  } = useAttendanceTable(group)

  if (isLoading) return <AttendanceTableSkeleton />

  if (group.students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
        <Users size={36} className="opacity-40" />
        <p className="text-sm font-medium">Ushbu guruhda o'quvchilar yo'q</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* ── Top bar: stats + bulk actions ───────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Today summary */}
        <div className="flex items-center gap-2 text-sm">
          <span className="flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md text-xs">
            <Check size={12} strokeWidth={2.5} />
            {presentCount} keldi
          </span>
          <span className="flex items-center gap-1.5 font-medium text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md text-xs">
            <X size={12} strokeWidth={2.5} />
            {absentCount} kelmadi
          </span>
        </div>

        {/* Bulk mark buttons */}
        <div className="ml-auto flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAll('present')}
            className="text-emerald-700 hover:bg-emerald-50 gap-1.5"
          >
            <CheckSquare size={13} />
            Barchasi keldi
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAll('absent')}
            className="text-rose-600 hover:bg-rose-50 gap-1.5"
          >
            <XSquare size={13} />
            Barchasi kelmadi
          </Button>
        </div>
      </div>

      {/* ── The table ────────────────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 scrollbar-thin">
        <table
          className="border-separate border-spacing-0"
          style={{ width: 'max-content', minWidth: '100%' }}
        >
          {/* ── Header ────────────────────────────────────────────── */}
          <thead>
            <tr>
              {/* Corner — sticky left + top */}
              <th
                className={cn(
                  'sticky left-0 top-0 z-30',
                  'bg-gray-50 border-b border-r border-gray-200',
                  'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider',
                  'min-w-[200px]',
                )}
              >
                O'quvchi
              </th>

              {/* Date columns */}
              {dates.map((date) => {
                const isT   = date === today
                const hdr   = parseColumnHeader(date)
                return (
                  <th
                    key={date}
                    className={cn(
                      'sticky top-0 z-20',
                      'border-b border-r border-gray-200',
                      'px-1 py-2 text-center w-[60px] min-w-[60px]',
                      isT
                        ? 'bg-amber-50 border-b-amber-300'
                        : 'bg-gray-50',
                    )}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span
                        className={cn(
                          'text-[10px] font-medium',
                          isT ? 'text-amber-600' : 'text-gray-400',
                        )}
                      >
                        {hdr.abbr}
                      </span>
                      <span
                        className={cn(
                          'text-sm font-bold leading-none',
                          isT ? 'text-amber-800' : 'text-gray-700',
                        )}
                      >
                        {hdr.day}
                      </span>
                      {isT && (
                        <span className="text-[8px] font-extrabold tracking-widest text-amber-600 uppercase mt-0.5">
                          Bugun
                        </span>
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>

          {/* ── Body ──────────────────────────────────────────────── */}
          <tbody>
            {group.students.map((student, rowIdx) => {
              const isEven = rowIdx % 2 === 0
              const rowBg  = isEven ? 'bg-white' : 'bg-gray-50/50'

              return (
                <tr key={student.id} className={cn('group/row', rowBg)}>
                  {/* Sticky name cell */}
                  <td
                    className={cn(
                      'sticky left-0 z-10',
                      'border-b border-r border-gray-100',
                      'px-4 py-2.5 min-w-[200px]',
                      'group-hover/row:bg-gray-50 transition-colors',
                      rowBg,
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                        {student.name}
                      </span>
                    </div>
                  </td>

                  {/* Attendance cells */}
                  {dates.map((date) => {
                    const isT = date === today
                    const status = isT
                      ? (todayStatuses[student.id] ?? 'present')
                      : (historyRecords[student.id]?.[date] ?? null)

                    return (
                      <AttendanceCell
                        key={date}
                        status={status}
                        isToday={isT}
                        onChange={isT
                          ? (s) => setStudentStatus(student.id, s)
                          : undefined
                        }
                      />
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── Legend + Submit row ──────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <Legend />
        <Button
          variant="primary"
          size="md"
          onClick={() => submit()}
          loading={isSubmitting}
          className="gap-2"
        >
          <Save size={14} />
          Bugungi davomatni saqlash
        </Button>
      </div>
    </div>
  )
}

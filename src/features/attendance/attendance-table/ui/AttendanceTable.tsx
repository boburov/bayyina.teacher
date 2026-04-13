import {
  Check, X, CheckSquare, XSquare, Save,
  Users, ChevronLeft, ChevronRight, AlertCircle,
} from 'lucide-react'
import { useAttendanceTable } from '../model/useAttendanceTable'
import type { AttendanceStatus } from '@/entities/attendance/model/types'
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table'
import { Badge }     from '@/components/ui/badge'
import { Button }    from '@/components/ui/button'
import { Skeleton }  from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { cn }        from '@/lib/utils'

interface AttendanceTableProps {
  groupId: string
  date:    string
}

// ─── Status toggle button ─────────────────────────────────────────────────────

interface StatusToggleProps {
  status:   AttendanceStatus
  onChange: (s: AttendanceStatus) => void
}

function StatusToggle({ status, onChange }: StatusToggleProps) {
  const isPresent = status === 'present'
  return (
    <button
      type="button"
      onClick={() => onChange(isPresent ? 'absent' : 'present')}
      aria-label={isPresent ? 'Keldi' : 'Kelmadi'}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold',
        'border transition-all duration-150 active:scale-95',
        isPresent
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
          : 'bg-rose-50   border-rose-200   text-rose-600   hover:bg-rose-100',
      )}
    >
      {isPresent
        ? <Check size={11} strokeWidth={3} />
        : <X     size={11} strokeWidth={3} />
      }
      {isPresent ? 'Keldi' : 'Kelmadi'}
    </button>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableRow key={i} className="hover:bg-transparent">
          <TableCell><Skeleton className="w-5 h-4" /></TableCell>
          <TableCell>
            <div className="flex items-center gap-2.5">
              <Skeleton className="w-7 h-7 rounded-full" />
              <Skeleton className="w-36 h-4" />
            </div>
          </TableCell>
          <TableCell className="hidden sm:table-cell"><Skeleton className="w-28 h-4" /></TableCell>
          <TableCell><Skeleton className="w-20 h-7 rounded-md" /></TableCell>
          <TableCell className="hidden md:table-cell"><Skeleton className="w-32 h-4" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

// ─── Pagination ────────────────────────────────────────────────────────────────

interface PaginationProps {
  page:       number
  totalPages: number
  totalRows:  number
  onPrev:     () => void
  onNext:     () => void
}

function Pagination({ page, totalPages, totalRows, onPrev, onNext }: PaginationProps) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between px-6 py-3">
      <span className="text-xs text-gray-500">
        Jami {totalRows} o'quvchi · {page}/{totalPages}-sahifa
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={page === 1}
          className="w-8 h-8 p-0"
        >
          <ChevronLeft size={14} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={page === totalPages}
          className="w-8 h-8 p-0"
        >
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function AttendanceTable({ groupId, date }: AttendanceTableProps) {
  const {
    session,
    isLoading,
    isError,
    pagedRows,
    statuses,
    notes,
    setStatus,
    setNote,
    markAll,
    submit,
    isSubmitting,
    presentCount,
    absentCount,
    totalRows,
    page,
    totalPages,
    setPage,
  } = useAttendanceTable(groupId, date)

  return (
    <div className="space-y-0 rounded-lg border border-gray-200 overflow-hidden">

      {/* ── Stats + bulk actions ────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
            <Check size={11} strokeWidth={3} />
            {presentCount} keldi
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md">
            <X size={11} strokeWidth={3} />
            {absentCount} kelmadi
          </span>
          {session && (
            <Badge variant="outline" className="text-xs">
              {totalRows} nafar
            </Badge>
          )}
        </div>

        <div className="ml-auto flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAll('present')}
            disabled={isLoading || totalRows === 0}
            className="text-emerald-700 hover:bg-emerald-50 gap-1.5 text-xs"
          >
            <CheckSquare size={13} />
            Barchasi keldi
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAll('absent')}
            disabled={isLoading || totalRows === 0}
            className="text-rose-600 hover:bg-rose-50 gap-1.5 text-xs"
          >
            <XSquare size={13} />
            Barchasi kelmadi
          </Button>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="w-12 pl-6">#</TableHead>
            <TableHead>Ism Familiya</TableHead>
            <TableHead className="hidden sm:table-cell">Telefon</TableHead>
            <TableHead>Holat</TableHead>
            <TableHead className="hidden md:table-cell w-48">Izoh</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableSkeleton />
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={5} className="py-12">
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <AlertCircle size={20} className="text-gray-400" />
                  <p className="text-sm font-medium">Davomat ma'lumotlari yuklanmadi</p>
                  <p className="text-xs text-gray-400">Sahifani yangilab ko'ring</p>
                </div>
              </TableCell>
            </TableRow>
          ) : totalRows === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-12">
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <Users size={20} className="text-gray-400" />
                  <p className="text-sm font-medium">Ushbu guruhda o'quvchilar yo'q</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            pagedRows.map((row, idx) => {
              const globalIdx = (page - 1) * 10 + idx + 1
              const name      = `${row.student.firstName} ${row.student.lastName}`
              const phone     = String(row.student.phone)
              const status    = statuses[row.enrollment] ?? 'present'

              return (
                <TableRow key={row.enrollment}>
                  <TableCell className="pl-6 text-gray-400 text-xs font-mono">
                    {globalIdx}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold shrink-0">
                        {row.student.firstName.charAt(0)}
                      </span>
                      <span className="font-medium text-gray-900 text-sm">{name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="hidden sm:table-cell text-gray-500 font-mono text-xs">
                    {phone}
                  </TableCell>

                  <TableCell>
                    <StatusToggle
                      status={status}
                      onChange={(s) => setStatus(row.enrollment, s)}
                    />
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    <input
                      type="text"
                      value={notes[row.enrollment] ?? ''}
                      onChange={(e) => setNote(row.enrollment, e.target.value)}
                      placeholder="Izoh..."
                      className="w-full text-xs text-gray-600 bg-transparent border-b border-gray-200 focus:border-gray-400 focus:outline-none py-1 placeholder:text-gray-300"
                    />
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      {/* ── Pagination ──────────────────────────────────────────────── */}
      {!isLoading && !isError && totalPages > 1 && (
        <>
          <Separator />
          <Pagination
            page={page}
            totalPages={totalPages}
            totalRows={totalRows}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </>
      )}

      {/* ── Submit ──────────────────────────────────────────────────── */}
      <Separator />
      <div className="px-6 py-4 flex items-center justify-between bg-white">
        {session?.isValidSchedule === false && (
          <span className="text-xs text-amber-600 flex items-center gap-1.5">
            <AlertCircle size={13} />
            Bu kun jadvalda yo'q
          </span>
        )}
        <div className="ml-auto">
          <Button
            onClick={() => submit()}
            disabled={isLoading || totalRows === 0}
            className="gap-2"
            size="default"
          >
            {isSubmitting
              ? <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full" />
              : <Save size={14} />
            }
            Davomatni saqlash
          </Button>
        </div>
      </div>
    </div>
  )
}

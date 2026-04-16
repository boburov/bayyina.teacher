import { useState, useEffect }           from 'react'
import { useSearchParams }               from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ChevronLeft, ChevronRight,
  AlertTriangle, Users, RefreshCw,
} from 'lucide-react'
import { fetchAttendanceSession, submitBulkAttendance } from '@/entities/attendance/model/api'
import type { AttendanceStatus } from '@/entities/attendance/model/types'
import { useAuth }           from '@/app/providers/AuthProvider'
import { ROUTES, groupDetailsPath } from '@/shared/config/routes'
import { DashboardLayout }   from '@/widgets/dashboard-layout/ui/DashboardLayout'
import { Header }            from '@/widgets/header/ui/Header'
import { Card }              from '@/components/ui/card'
import { Badge }             from '@/components/ui/badge'
import { Button }            from '@/components/ui/button'
import { Skeleton }          from '@/components/ui/skeleton'
import { Separator }         from '@/components/ui/separator'
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { getLocalDateString } from '@/shared/lib/dates'
import { useToast }           from '@/shared/lib/toast'
import { cn }                 from '@/lib/utils'

// ─── Date helpers ─────────────────────────────────────────────────────────────

function toDateStr(d: Date): string {
  const y  = d.getFullYear()
  const m  = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function getMondayOf(dateStr: string): string {
  const d   = new Date(dateStr + 'T00:00:00')
  const day = d.getDay()             // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return toDateStr(d)
}

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return toDateStr(d)
}

/** Returns 0–6 offset from Monday (Mon=0 … Sun=6) */
function getDayIndex(dateStr: string): number {
  const day = new Date(dateStr + 'T00:00:00').getDay()
  return day === 0 ? 6 : day - 1
}

const UZ_ABBR       = ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh']   // Sun–Sat
const EN_DAY_NAMES  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

function weekdayAbbr(dateStr: string): string {
  return UZ_ABBR[new Date(dateStr + 'T00:00:00').getDay()]
}

function dayNumber(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00').getDate()
}

function isScheduleDay(dateStr: string, scheduleDays: string[]): boolean {
  return scheduleDays.includes(EN_DAY_NAMES[new Date(dateStr + 'T00:00:00').getDay()])
}

const PAGE_SIZE = 10

// ─── Week navigator ───────────────────────────────────────────────────────────

interface WeekNavigatorProps {
  weekStart:    string
  selectedDate: string
  scheduleDays: string[]
  onDaySelect:  (date: string) => void
  onPrev:       () => void
  onNext:       () => void
}

function WeekNavigator({
  weekStart, selectedDate, scheduleDays, onDaySelect, onPrev, onNext,
}: WeekNavigatorProps) {
  const today = getLocalDateString()
  const days  = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div className="flex items-center gap-2 mb-4 bg-white border border-gray-200 p-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onPrev}
        className="w-8 h-8 p-0 shrink-0"
      >
        <ChevronLeft size={16} />
      </Button>

      <div className="flex flex-1 justify-between gap-1">
        {days.map((date) => {
          const isSelected  = date === selectedDate
          const isToday     = date === today
          const inSchedule  = scheduleDays.length === 0 || isScheduleDay(date, scheduleDays)

          return (
            <button
              key={date}
              type="button"
              onClick={() => onDaySelect(date)}
              className={cn(
                'flex flex-col items-center gap-0.5 px-1 py-2 flex-1 min-w-0 transition-colors',
                isSelected
                  ? 'bg-brown-800 text-white'
                  : isToday
                    ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    : 'hover:bg-gray-50 text-gray-600',
                !inSchedule && !isSelected && 'opacity-40',
              )}
            >
              <span className="text-[10px] font-medium uppercase tracking-wide">
                {weekdayAbbr(date)}
              </span>
              <span className={cn(
                'text-base font-bold leading-none',
                isSelected ? 'text-white' : 'text-inherit',
              )}>
                {dayNumber(date)}
              </span>
              {/* today dot */}
              <span className={cn(
                'w-1 h-1 rounded-full',
                isSelected && isToday  ? 'bg-white/50'  :
                !isSelected && isToday ? 'bg-gray-400'  :
                'bg-transparent',
              )} />
            </button>
          )
        })}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onNext}
        className="w-8 h-8 p-0 shrink-0"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  )
}

// ─── Status display ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AttendanceStatus | null }) {
  if (!status)               return <Badge variant="outline" className="text-gray-400 border-gray-200">Belgilanmagan</Badge>
  if (status === 'present')  return <Badge variant="success">Keldi</Badge>
  return                            <Badge variant="destructive">Kelmadi</Badge>
}

interface StatusToggleProps {
  status:   AttendanceStatus | null
  onChange: (s: AttendanceStatus) => void
}

function StatusToggle({ status, onChange }: StatusToggleProps) {
  return (
    <div className="inline-flex border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => onChange('present')}
        className={cn(
          'px-3 py-1.5 text-xs font-semibold transition-all',
          status === 'present'
            ? 'bg-emerald-600 text-white border-r border-emerald-700'
            : 'text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 border-r border-gray-200',
        )}
      >
        Keldi
      </button>
      <button
        type="button"
        onClick={() => onChange('absent')}
        className={cn(
          'px-3 py-1.5 text-xs font-semibold transition-all',
          status === 'absent'
            ? 'bg-rose-500 text-white'
            : 'text-gray-500 hover:text-rose-600 hover:bg-rose-50',
        )}
      >
        Kelmadi
      </button>
    </div>
  )
}

// ─── Table skeleton ───────────────────────────────────────────────────────────

function TableSkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} className="hover:bg-transparent">
          <TableCell><Skeleton className="w-5 h-4" /></TableCell>
          <TableCell>
            <div className="flex items-center gap-2.5">
              <Skeleton className="w-7 h-7 rounded-full" />
              <Skeleton className="w-32 h-4" />
            </div>
          </TableCell>
          <TableCell className="hidden sm:table-cell"><Skeleton className="w-28 h-4" /></TableCell>
          <TableCell><Skeleton className="w-28 h-7 rounded-md" /></TableCell>
          <TableCell className="hidden md:table-cell"><Skeleton className="w-20 h-4" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  page:       number
  totalPages: number
  totalRows:  number
  onPrev:     () => void
  onNext:     () => void
}

function Pagination({ page, totalPages, totalRows, onPrev, onNext }: PaginationProps) {
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AttendancePage() {
  const { token }       = useAuth()
  const [searchParams]  = useSearchParams()
  const queryClient     = useQueryClient()
  const toast           = useToast()

  const groupId = searchParams.get('groupId') ?? ''
  const today   = getLocalDateString()

  const [selectedDate, setSelectedDate] = useState(today)
  const [weekStart,    setWeekStart]    = useState(() => getMondayOf(today))
  const [page,         setPage]         = useState(1)

  // ── Local draft statuses (not saved until "Saqlash" pressed) ─────────────
  const [draftStatuses,  setDraftStatuses]  = useState<Record<string, AttendanceStatus | null>>({})
  const [lastSessionKey, setLastSessionKey] = useState('')

  const queryKey = ['attendance', groupId, selectedDate]

  const { data: session, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn:  () => fetchAttendanceSession(groupId, selectedDate, token!),
    enabled:  !!token && !!groupId,
  })

  // Sync draft from server when session loads for a new date/group
  useEffect(() => {
    const key = `${groupId}_${selectedDate}`
    if (session && lastSessionKey !== key) {
      const init: Record<string, AttendanceStatus | null> = {}
      session.rows.forEach((r) => { init[r.enrollment] = r.status })
      setDraftStatuses(init)
      setLastSessionKey(key)
    }
  }, [session, groupId, selectedDate, lastSessionKey])

  // ── Save bulk mutation ────────────────────────────────────────────────────
  const { mutate: saveBulk, isPending: isSaving } = useMutation({
    mutationFn: () => {
      const entries = (session?.rows ?? [])
        .map((r) => ({ enrollment: r.enrollment, status: draftStatuses[r.enrollment] ?? r.status }))
        .filter((e): e is { enrollment: string; status: AttendanceStatus } => e.status !== null)
      return submitBulkAttendance({ group: groupId, date: selectedDate, entries }, token!)
    },
    onSuccess: () => {
      toast.success("Davomat saqlandi")
      queryClient.invalidateQueries({ queryKey })
    },
    onError: () => {
      toast.error("Xatolik yuz berdi. Qayta urinib ko'ring.")
    },
  })

  // ── Week navigation ───────────────────────────────────────────────────────
  function prevWeek() {
    const newStart = addDays(weekStart, -7)
    setWeekStart(newStart)
    setSelectedDate(addDays(newStart, getDayIndex(selectedDate)))
    setPage(1)
  }

  function nextWeek() {
    const newStart = addDays(weekStart, 7)
    setWeekStart(newStart)
    setSelectedDate(addDays(newStart, getDayIndex(selectedDate)))
    setPage(1)
  }

  function selectDay(date: string) {
    setSelectedDate(date)
    setPage(1)
  }

  // ── Derived data ──────────────────────────────────────────────────────────
  // Editable only when selected date is today AND it's a valid schedule day
  const isEditable   = selectedDate === today && (session?.isValidSchedule ?? false)
  const rows         = session?.rows ?? []
  const totalPages   = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const pagedRows    = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const scheduleDays = session?.group.schedule.days ?? []
  const backPath     = groupId ? groupDetailsPath(groupId) : ROUTES.GROUPS

  return (
    <DashboardLayout>
      <Header
        title={session?.group.name ?? 'Davomat'}
        subtitle="Davomat jadvali"
        backPath={backPath}
      />

      {/* Week navigator */}
      <WeekNavigator
        weekStart={weekStart}
        selectedDate={selectedDate}
        scheduleDays={scheduleDays}
        onDaySelect={selectDay}
        onPrev={prevWeek}
        onNext={nextWeek}
      />

      {/* Off-schedule warning */}
      {!isLoading && session?.isValidSchedule === false && (
        <div className="flex items-center gap-2.5 text-sm text-amber-700 bg-amber-50 border border-amber-200 px-4 py-3 mb-4">
          <AlertTriangle size={15} className="shrink-0" />
          Bu kun guruh dars jadvali bo'yicha dars kuni emas.
        </div>
      )}

      {/* Attendance table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-12 pl-6">#</TableHead>
              <TableHead>Ism Familiya</TableHead>
              <TableHead className="hidden sm:table-cell">Telefon</TableHead>
              <TableHead>Holat</TableHead>
              <TableHead className="hidden md:table-cell">Izoh</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableSkeletonRows />
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12">
                  <div className="flex flex-col items-center gap-3 text-gray-500">
                    <p className="text-sm font-medium">Davomat ma'lumotlari yuklanmadi</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetch()}
                      className="gap-1.5"
                    >
                      <RefreshCw size={13} />
                      Qayta yuklash
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Users size={20} />
                    <p className="text-sm">Ushbu guruhda o'quvchilar yo'q</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              pagedRows.map((row, idx) => {
                const globalIdx   = (page - 1) * PAGE_SIZE + idx + 1
                const name        = `${row.student.firstName} ${row.student.lastName}`
                const phone       = String(row.student.phone)
                const draftStatus = draftStatuses[row.enrollment] ?? row.status

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
                      {isEditable ? (
                        <StatusToggle
                          status={draftStatus}
                          onChange={(s) =>
                            setDraftStatuses((prev) => ({ ...prev, [row.enrollment]: s }))
                          }
                        />
                      ) : (
                        <StatusBadge status={draftStatus} />
                      )}
                    </TableCell>

                    <TableCell className="hidden md:table-cell text-sm text-gray-500">
                      {row.note ?? <span className="text-gray-300">—</span>}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        {!isLoading && !isError && totalPages > 1 && (
          <>
            <Separator />
            <Pagination
              page={page}
              totalPages={totalPages}
              totalRows={rows.length}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          </>
        )}

        {/* Save button — only shown when today is a valid schedule day */}
        {isEditable && !isLoading && !isError && rows.length > 0 && (
          <>
            <Separator />
            <div className="flex justify-end px-6 py-4">
              <Button
                onClick={() => saveBulk()}
                disabled={isSaving}
                className="min-w-[120px]"
              >
                {isSaving ? 'Saqlanmoqda…' : 'Saqlash'}
              </Button>
            </div>
          </>
        )}
      </Card>
    </DashboardLayout>
  )
}

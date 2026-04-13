import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAttendanceSession, submitBulkAttendance } from '@/entities/attendance/model/api'
import type { AttendanceStatus, AttendanceBulkEntry } from '@/entities/attendance/model/types'
import { useAuth } from '@/app/providers/AuthProvider'
import { useToast } from '@/shared/lib/toast'

const PAGE_SIZE = 10

export function useAttendanceTable(groupId: string, date: string) {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const toast       = useToast()

  // ── server state ──────────────────────────────────────────────────────────
  const { data: session, isLoading, isError } = useQuery({
    queryKey: ['attendance-session', groupId, date],
    queryFn:  () => fetchAttendanceSession(groupId, date, token!),
    enabled:  !!token && !!groupId && !!date,
  })

  // ── local editable statuses: enrollment → status ──────────────────────────
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({})
  const [notes, setNotes]       = useState<Record<string, string>>({})

  // Seed local state from session data whenever it loads or date changes
  useEffect(() => {
    if (!session) return
    const s: Record<string, AttendanceStatus> = {}
    const n: Record<string, string> = {}
    for (const row of session.rows) {
      s[row.enrollment] = row.status ?? 'present'
      n[row.enrollment] = row.note  ?? ''
    }
    setStatuses(s)
    setNotes(n)
  }, [session])

  function setStatus(enrollmentId: string, status: AttendanceStatus) {
    setStatuses((prev) => ({ ...prev, [enrollmentId]: status }))
  }

  function setNote(enrollmentId: string, note: string) {
    setNotes((prev) => ({ ...prev, [enrollmentId]: note }))
  }

  function markAll(status: AttendanceStatus) {
    if (!session) return
    setStatuses(Object.fromEntries(session.rows.map((r) => [r.enrollment, status])))
  }

  // ── pagination ────────────────────────────────────────────────────────────
  const [page, setPage] = useState(1)

  // Reset to page 1 when date or group changes
  useEffect(() => { setPage(1) }, [groupId, date])

  const rows        = session?.rows ?? []
  const totalPages  = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const pagedRows   = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // ── submit ────────────────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: () => {
      const entries: AttendanceBulkEntry[] = rows.map((r) => ({
        enrollment: r.enrollment,
        status:     statuses[r.enrollment] ?? 'present',
        ...(notes[r.enrollment] ? { note: notes[r.enrollment] } : {}),
      }))
      return submitBulkAttendance({ group: groupId, date, entries }, token!)
    },
    onSuccess: () => {
      toast.success('Davomat muvaffaqiyatli saqlandi!')
      queryClient.invalidateQueries({ queryKey: ['attendance-session', groupId, date] })
    },
    onError: () => {
      toast.error("Xatolik yuz berdi. Qayta urinib ko'ring.")
    },
  })

  // ── derived stats ─────────────────────────────────────────────────────────
  const presentCount = Object.values(statuses).filter((s) => s === 'present').length
  const absentCount  = rows.length - presentCount

  return {
    session,
    isLoading,
    isError,
    pagedRows,
    statuses,
    notes,
    setStatus,
    setNote,
    markAll,
    submit:       mutation.mutate,
    isSubmitting: mutation.isPending,
    presentCount,
    absentCount,
    totalRows:    rows.length,
    page,
    totalPages,
    setPage,
  }
}

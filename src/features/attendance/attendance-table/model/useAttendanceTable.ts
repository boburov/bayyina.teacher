import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchGroupAttendanceHistory,
  submitAttendance,
} from '@/entities/attendance/model/api'
import type { AttendanceStatus } from '@/entities/attendance/model/types'
import type { Group } from '@/entities/group/model/types'
import { getLocalDateString } from '@/shared/lib/dates'
import { useToast } from '@/shared/lib/toast'

export function useAttendanceTable(group: Group) {
  const queryClient = useQueryClient()
  const toast       = useToast()
  const today       = getLocalDateString()

  // ── server state ──────────────────────────────────────────────────────────
  const { data: history, isLoading } = useQuery({
    queryKey: ['attendance-history', group.id],
    queryFn:  () => fetchGroupAttendanceHistory(group.id),
    staleTime: 0,
  })

  // ── local state for today's column ────────────────────────────────────────
  const initializedRef = useRef(false)

  const defaultStatuses = (): Record<string, AttendanceStatus> =>
    Object.fromEntries(group.students.map((s) => [s.id, 'present' as AttendanceStatus]))

  const [todayStatuses, setTodayStatuses] = useState<Record<string, AttendanceStatus>>(defaultStatuses)

  // Once history loads, seed today's statuses from any previously submitted data
  useEffect(() => {
    if (history && !initializedRef.current) {
      initializedRef.current = true
      const seeded: Record<string, AttendanceStatus> = {}
      for (const student of group.students) {
        const fromHistory = history.records[student.id]?.[today]
        seeded[student.id] = fromHistory ?? 'present'
      }
      setTodayStatuses(seeded)
    }
  }, [history, group.students, today])

  function setStudentStatus(studentId: string, status: AttendanceStatus) {
    setTodayStatuses((prev) => ({ ...prev, [studentId]: status }))
  }

  function markAll(status: AttendanceStatus) {
    setTodayStatuses(Object.fromEntries(group.students.map((s) => [s.id, status])))
  }

  // ── submit mutation ───────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: () =>
      submitAttendance({
        groupId: group.id,
        date:    today,
        entries: group.students.map((s) => ({
          studentId: s.id,
          status:    todayStatuses[s.id],
        })),
      }),
    onSuccess: () => {
      toast.success('Davomat muvaffaqiyatli saqlandi!')
      queryClient.invalidateQueries({ queryKey: ['attendance-history', group.id] })
    },
    onError: () => {
      toast.error("Xatolik yuz berdi. Qayta urinib ko'ring.")
    },
  })

  // ── derived stats ─────────────────────────────────────────────────────────
  const presentCount = Object.values(todayStatuses).filter((s) => s === 'present').length
  const absentCount  = group.students.length - presentCount

  return {
    dates:         history?.dates ?? [],
    historyRecords: history?.records ?? {},
    todayStatuses,
    today,
    isLoading,
    isSubmitting:  mutation.isPending,
    setStudentStatus,
    markAll,
    submit:        mutation.mutate,
    presentCount,
    absentCount,
  }
}

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { submitBulkAttendance } from '@/entities/attendance/model/api'
import type { AttendanceStatus } from '@/entities/attendance/model/types'
import type { Student } from '@/entities/group/model/types'

export function useAttendanceForm(groupId: string, students: Student[]) {
  const queryClient = useQueryClient()

  const today = new Date().toISOString().split('T')[0]

  // Initialize all as 'present'
  const initialStatuses = Object.fromEntries(
    students.map((s) => [s.id, 'present' as AttendanceStatus]),
  )
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>(initialStatuses)
  const [submitted, setSubmitted] = useState(false)

  function toggle(studentId: string) {
    setStatuses((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
    }))
  }

  function markAll(status: AttendanceStatus) {
    setStatuses(Object.fromEntries(students.map((s) => [s.id, status])))
  }

  const mutation = useMutation({
    mutationFn: () =>
      submitBulkAttendance(
        {
          group:   groupId,
          date:    today,
          entries: students.map((s) => ({ enrollment: s.id, status: statuses[s.id] })),
        },
        '',
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', groupId] })
      setSubmitted(true)
    },
  })

  const presentCount = Object.values(statuses).filter((s) => s === 'present').length
  const absentCount  = students.length - presentCount

  return {
    statuses,
    toggle,
    markAll,
    submit: mutation.mutate,
    isSubmitting: mutation.isPending,
    isError:      mutation.isError,
    submitted,
    today,
    presentCount,
    absentCount,
  }
}

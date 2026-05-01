import { http } from '@/shared/api/http'
import type {
  AttendanceSession,
  AttendanceBulkPayload,
  AttendanceStatus,
} from './types'

export async function fetchAttendanceSession(
  groupId: string,
  date: string,
): Promise<AttendanceSession> {
  return http.get<AttendanceSession>(
    `attendance/session?group=${groupId}&date=${date}`,
  )
}

export async function markAttendance(
  groupId: string,
  enrollmentId: string,
  date: string,
  status: AttendanceStatus,
): Promise<unknown> {
  return http.post<unknown>(
    'attendance/bulk',
    { group: groupId, date, entries: [{ enrollment: enrollmentId, status }] },
  )
}

export async function submitBulkAttendance(
  payload: AttendanceBulkPayload,
): Promise<unknown> {
  return http.post<unknown>('attendance/bulk', payload)
}

export interface AttendanceSummary {
  totalSessions: number
  perEnrollment: Record<string, number>
}

export async function fetchAttendanceSummary(
  groupId: string,
  month: string, // YYYY-MM
): Promise<AttendanceSummary> {
  return http.get<AttendanceSummary>(
    `attendance/summary?group=${groupId}&month=${month}`,
  )
}

export async function fetchDerStats(params: {
  group?: string
  from?: string
  to?: string
}): Promise<import('./types').DerStatsResponse> {
  const q = new URLSearchParams()
  if (params.group) q.set('group', params.group)
  if (params.from)  q.set('from', params.from)
  if (params.to)    q.set('to',   params.to)
  return http.get(`attendance/der/stats?${q.toString()}`)
}

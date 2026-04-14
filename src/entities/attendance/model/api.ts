import { http } from '@/shared/api/http'
import type {
  AttendanceSession,
  AttendanceBulkPayload,
  AttendanceStatus,
} from './types'

export async function fetchAttendanceSession(
  groupId: string,
  date: string,
  token: string,
): Promise<AttendanceSession> {
  return http.get<AttendanceSession>(
    `attendance/session?group=${groupId}&date=${date}`,
    token,
  )
}

/**
 * Mark a single enrollment for a session.
 * Internally uses POST /attendance/bulk with one entry (upsert by enrollment+date).
 */
export async function markAttendance(
  groupId: string,
  enrollmentId: string,
  date: string,
  status: AttendanceStatus,
  token: string,
): Promise<unknown> {
  return http.post<unknown>(
    'attendance/bulk',
    { group: groupId, date, entries: [{ enrollment: enrollmentId, status }] },
    token,
  )
}

export async function submitBulkAttendance(
  payload: AttendanceBulkPayload,
  token: string,
): Promise<unknown> {
  return http.post<unknown>('attendance/bulk', payload, token)
}

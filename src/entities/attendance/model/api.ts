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

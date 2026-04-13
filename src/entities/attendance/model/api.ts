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
    `attendance/session?groupId=${groupId}&date=${date}`,
    token,
  )
}

export async function markAttendance(
  enrollmentId: string,
  date: string,
  status: AttendanceStatus,
  token: string,
): Promise<unknown> {
  return http.post<unknown>('attendance/mark', { enrollmentId, date, status }, token)
}

export async function submitBulkAttendance(
  payload: AttendanceBulkPayload,
  token: string,
): Promise<unknown> {
  return http.post<unknown>('attendance/bulk', payload, token)
}

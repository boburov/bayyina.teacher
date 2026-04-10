import {
  MOCK_ATTENDANCE,
  getMockAttendanceHistory,
  simulateDelay,
} from '@/shared/api/mock-data'
import { getLastNDays, getLocalDateString } from '@/shared/lib/dates'
import type {
  AttendanceHistory,
  AttendanceRecord,
  AttendanceSubmitPayload,
} from './types'

export async function fetchGroupAttendanceHistory(groupId: string): Promise<AttendanceHistory> {
  const dates = getLastNDays(20)
  const today = getLocalDateString()
  const records = getMockAttendanceHistory(groupId, dates, today)
  return simulateDelay({ dates, records }, 700)
}

export async function submitAttendance(payload: AttendanceSubmitPayload): Promise<AttendanceRecord> {
  // Replace existing record for same group+date or append
  const existingIdx = MOCK_ATTENDANCE.findIndex(
    (r) => r.groupId === payload.groupId && r.date === payload.date,
  )
  const record: AttendanceRecord = { id: `att_${Date.now()}`, ...payload }

  if (existingIdx >= 0) {
    MOCK_ATTENDANCE[existingIdx] = record
  } else {
    MOCK_ATTENDANCE.push(record)
  }

  return simulateDelay(record, 900)
}

export async function fetchTodayAttendance(groupId: string): Promise<AttendanceRecord | null> {
  const today = getLocalDateString()
  const record = MOCK_ATTENDANCE.find(
    (r) => r.groupId === groupId && r.date === today,
  ) ?? null
  return simulateDelay(record, 300)
}

import { getLastNDays, getLocalDateString } from '@/shared/lib/dates'
import type {
  AttendanceHistory,
  AttendanceRecord,
  AttendanceStatus,
  AttendanceSubmitPayload,
} from './types'

// ─── In-memory store (session only) ──────────────────────────────────────────

const submittedRecords: AttendanceRecord[] = []

// ─── Deterministic mock history ───────────────────────────────────────────────

function deterministicHash(studentId: string, date: string): number {
  const s = studentId + '|' + date
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i)
  }
  return Math.abs(h >>> 0)
}

function mockStatus(studentId: string, date: string): AttendanceStatus {
  return deterministicHash(studentId, date) % 100 < 85 ? 'present' : 'absent'
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function fetchGroupAttendanceHistory(groupId: string): Promise<AttendanceHistory> {
  const dates = getLastNDays(20)
  const today = getLocalDateString()

  const submitted = submittedRecords.find(
    (r) => r.groupId === groupId && r.date === today,
  )
  const todayIndex: Record<string, AttendanceStatus> = {}
  if (submitted) {
    for (const entry of submitted.entries) {
      todayIndex[entry.studentId] = entry.status
    }
  }

  // Collect all student IDs seen in any submitted record for this group
  const studentIds = Array.from(
    new Set(
      submittedRecords
        .filter((r) => r.groupId === groupId)
        .flatMap((r) => r.entries.map((e) => e.studentId)),
    ),
  )

  const records: Record<string, Record<string, AttendanceStatus | null>> = {}
  for (const studentId of studentIds) {
    records[studentId] = {}
    for (const date of dates) {
      if (date === today) {
        records[studentId][date] = todayIndex[studentId] ?? null
      } else {
        records[studentId][date] = mockStatus(studentId, date)
      }
    }
  }

  return { dates, records }
}

export async function submitAttendance(payload: AttendanceSubmitPayload): Promise<AttendanceRecord> {
  const record: AttendanceRecord = { id: `att_${Date.now()}`, ...payload }
  const idx = submittedRecords.findIndex(
    (r) => r.groupId === payload.groupId && r.date === payload.date,
  )
  if (idx >= 0) {
    submittedRecords[idx] = record
  } else {
    submittedRecords.push(record)
  }
  return record
}

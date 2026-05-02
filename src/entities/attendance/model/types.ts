export type AttendanceStatus = 'present' | 'absent'

// ─── Session API ──────────────────────────────────────────────────────────────

export interface AttendanceSessionStudent {
  _id:       string
  firstName: string
  lastName:  string
  phone:     number
}

export interface AttendanceSessionRow {
  enrollment:   string
  student:      AttendanceSessionStudent
  status:       AttendanceStatus | null
  grade:        number | null
  note:         string | null
  attendanceId: string | null
  markedAt:     string | null
}

export interface AttendanceSession {
  group: {
    _id:      string
    name:     string
    schedule: { days: string[]; time: string }
  }
  date:            string
  weekday:         string
  isValidSchedule: boolean
  rows:            AttendanceSessionRow[]
  code:            string
  message:         string
}

// ─── Mark attendance API ──────────────────────────────────────────────────────

export interface MarkAttendancePayload {
  enrollmentId: string
  date:         string
  status:       AttendanceStatus
}

// ─── Bulk submit API (kept for compatibility) ─────────────────────────────────

export interface AttendanceBulkEntry {
  enrollment: string
  status:     AttendanceStatus
  grade?:     number | null
  note?:      string
}

// ─── DER Stats ────────────────────────────────────────────────────────────────

export interface DerStudentStat {
  student:       { _id: string; firstName: string; lastName: string }
  group:         { _id: string; name: string } | null
  totalPresent:  number
  totalAbsent:   number
  totalSessions: number
  avgGrade:      number | null
  rankGlobal:    number
  rankInGroup:   number
}

export interface DerStatsResponse {
  stats: DerStudentStat[]
  from:  string
  to:    string
}

export interface AttendanceBulkPayload {
  group:   string
  date:    string
  entries: AttendanceBulkEntry[]
}

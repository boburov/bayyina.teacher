export type AttendanceStatus = 'present' | 'absent'

export interface AttendanceEntry {
  studentId: string
  status:    AttendanceStatus
}

export interface AttendanceRecord {
  id:       string
  groupId:  string
  date:     string  // ISO date "YYYY-MM-DD"
  entries:  AttendanceEntry[]
}

export interface AttendanceSubmitPayload {
  groupId: string
  date:    string
  entries: AttendanceEntry[]
}

/**
 * dates:   ordered array of ISO date strings (e.g. last 20 days)
 * records: { [studentId]: { [isoDate]: AttendanceStatus | null } }
 *          null means no record exists (today not yet submitted)
 */
export interface AttendanceHistory {
  dates:   string[]
  records: Record<string, Record<string, AttendanceStatus | null>>
}

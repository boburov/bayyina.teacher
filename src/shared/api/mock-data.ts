import type { Group } from '@/entities/group/model/types'
import type { AttendanceRecord, AttendanceStatus } from '@/entities/attendance/model/types'

export const MOCK_TEACHER = {
  id:     '1',
  name:   'Aziz Karimov',
  email:  'aziz@bayyina.uz',
  phone:  '+998901234567',
  avatar: null as string | null,
}

export const MOCK_GROUPS: Group[] = [
  {
    id: '1',
    name: 'Boshlang\'ich guruh A',
    studentCount: 12,
    schedule: { days: ['Dushanba', 'Chorshanba', 'Juma'], time: '09:00–10:30' },
    students: [
      { id: 's1',  name: 'Abdullayev Jasur',      phone: '+998 90 123 45 67' },
      { id: 's2',  name: 'Toshmatova Nilufar',    phone: '+998 91 234 56 78' },
      { id: 's3',  name: 'Mirzayev Sardor',       phone: '+998 93 345 67 89' },
      { id: 's4',  name: 'Xoliqova Feruza',       phone: '+998 94 456 78 90' },
      { id: 's5',  name: 'Qodirov Bobur',         phone: '+998 90 567 89 01' },
      { id: 's6',  name: 'Rahimova Dilnoza',      phone: '+998 91 678 90 12' },
      { id: 's7',  name: 'Yunusov Ulugbek',       phone: '+998 93 789 01 23' },
      { id: 's8',  name: 'Nazarova Malika',       phone: '+998 94 890 12 34' },
      { id: 's9',  name: 'Ergashev Sherzod',      phone: null },
      { id: 's10', name: 'Ismoilova Shahnoza',    phone: '+998 90 901 23 45' },
      { id: 's11', name: 'Norqo\'ziyev Ibrohim',  phone: '+998 91 012 34 56' },
      { id: 's12', name: 'Tursunova Zulfiya',     phone: '+998 93 123 45 67' },
    ],
  },
  {
    id: '2',
    name: 'O\'rta guruh B',
    studentCount: 9,
    schedule: { days: ['Seshanba', 'Payshanba'], time: '11:00–12:30' },
    students: [
      { id: 's13', name: 'Hasanov Javlon',        phone: '+998 94 234 56 78' },
      { id: 's14', name: 'Sobirov Akbar',         phone: '+998 90 345 67 89' },
      { id: 's15', name: 'Mamatova Kamola',       phone: '+998 91 456 78 90' },
      { id: 's16', name: 'Aliyev Doniyor',        phone: '+998 93 567 89 01' },
      { id: 's17', name: 'Umarova Sabohat',       phone: '+998 94 678 90 12' },
      { id: 's18', name: 'Botirov Mansur',        phone: null },
      { id: 's19', name: 'Qosimova Oydin',        phone: '+998 90 789 01 23' },
      { id: 's20', name: 'Raximov Firdavs',       phone: '+998 91 890 12 34' },
      { id: 's21', name: 'Jalolov Mirzo',         phone: '+998 93 901 23 45' },
    ],
  },
  {
    id: '3',
    name: 'Ilg\'or guruh C',
    studentCount: 7,
    schedule: { days: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma'], time: '14:00–15:00' },
    students: [
      { id: 's22', name: 'Kalandarov Sanjar',     phone: '+998 94 012 34 56' },
      { id: 's23', name: 'Holmatova Gulnora',     phone: '+998 90 123 45 68' },
      { id: 's24', name: 'Nazarov Oybek',         phone: '+998 91 234 56 79' },
      { id: 's25', name: 'Salimova Barno',        phone: '+998 93 345 67 80' },
      { id: 's26', name: 'Turayev Rustam',        phone: null },
      { id: 's27', name: 'Xoshimova Nargiza',     phone: '+998 94 456 78 91' },
      { id: 's28', name: 'Qoraboyev Laziz',       phone: '+998 90 567 89 02' },
    ],
  },
]

// Mutable store — submitted records accumulate here during the session
export const MOCK_ATTENDANCE: AttendanceRecord[] = []

export function simulateDelay<T>(data: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

// ─── Deterministic mock history ───────────────────────────────────────────────

/**
 * djb2-style hash — deterministic, same value every call for the same inputs.
 * Used to generate realistic-looking past attendance without a real backend.
 */
function deterministicHash(studentId: string, date: string): number {
  const s = studentId + '|' + date
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i)
  }
  return Math.abs(h >>> 0)     // unsigned right-shift to keep positive
}

/** Returns 'present' ~85% of the time, 'absent' ~15%, deterministically */
export function getMockAttendanceStatus(studentId: string, date: string): AttendanceStatus {
  return deterministicHash(studentId, date) % 100 < 85 ? 'present' : 'absent'
}

/**
 * Returns a map { [studentId]: { [isoDate]: AttendanceStatus } } for past days.
 * Today is excluded — it should come from MOCK_ATTENDANCE (submitted by teacher).
 */
export function getMockAttendanceHistory(
  groupId: string,
  dates:   string[],
  today:   string,
): Record<string, Record<string, AttendanceStatus | null>> {
  const group = MOCK_GROUPS.find((g) => g.id === groupId)
  if (!group) return {}

  // Index today's submitted records (if any)
  const submittedToday = MOCK_ATTENDANCE.find(
    (r) => r.groupId === groupId && r.date === today,
  )
  const todayIndex: Record<string, AttendanceStatus> = {}
  if (submittedToday) {
    for (const entry of submittedToday.entries) {
      todayIndex[entry.studentId] = entry.status
    }
  }

  const result: Record<string, Record<string, AttendanceStatus | null>> = {}

  for (const student of group.students) {
    result[student.id] = {}
    for (const date of dates) {
      if (date === today) {
        // null if not yet submitted, or the submitted value
        result[student.id][date] = todayIndex[student.id] ?? null
      } else {
        result[student.id][date] = getMockAttendanceStatus(student.id, date)
      }
    }
  }

  return result
}

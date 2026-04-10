export interface Student {
  id: string
  name: string
  phone: string | null
}

export interface GroupSchedule {
  days: string[]
  time: string
}

export interface Group {
  id: string
  name: string
  studentCount: number
  schedule: GroupSchedule
  students: Student[]
}

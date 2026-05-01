export interface Student {
  id: string
  name: string
  phone: string | null
}

export interface GroupSchedule {
  days: string[]
  time: string
}

export interface GroupTeacher {
  _id:       string
  firstName: string
  lastName:  string
  phone:     number
}

export interface Group {
  id:                   string
  name:                 string
  description:          string
  price?:               number
  teacher:              GroupTeacher
  schedule:             GroupSchedule
  room:                 string
  createdBy:            string
  createdAt:            string
  updatedAt:            string
  showPaymentsToTeacher: boolean
  studentCount:         number
  students:             Student[]
}

export interface GroupDetailResponse {
  group:   ApiGroup
  code:    string
  message: string
}

export interface GroupsResponse {
  groups:     ApiGroup[]
  total:      number
  page:       number
  limit:      number
  totalPages: number
  code:       string
  message:    string
}

export interface ApiGroup {
  _id:                  string
  name:                 string
  description:          string
  price?:               number
  teacher:              GroupTeacher
  schedule:             GroupSchedule
  room:                 string
  createdBy:            string
  createdAt:            string
  updatedAt:            string
  showPaymentsToTeacher: boolean
}

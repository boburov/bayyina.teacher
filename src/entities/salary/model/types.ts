export interface SalaryGroup {
  group:             string
  groupName:         string
  salaryType:        'percentage' | 'per_student' | 'fixed' | string
  salaryValue:       number
  minSalary:         number
  studentCount:      number
  paidStudentsCount: number
  groupRevenue:      number
  amount:            number
}

export interface Salary {
  _id:         string
  teacher:     string
  month:       string
  groups:      SalaryGroup[]
  totalAmount: number
  bonus:       number
  deduction:   number
  netAmount:   number
  status:      'pending' | 'paid' | string
  paidAt:      string | null
  note:        string
  createdBy:   string
  createdAt:   string
  updatedAt:   string
}

export interface SalariesResponse {
  salaries:    Salary[]
  total:       number
  page:        number
  limit:       number
  totalPages:  number
  hasNextPage: boolean
  hasPrevPage: boolean
  code:        string
  message:     string
}

export interface SalaryResponse {
  salary:  Salary
  code:    string
  message: string
}

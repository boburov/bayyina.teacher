export interface PaymentStudent {
  _id:       string
  firstName: string
  lastName:  string
  phone:     string
}

export interface PaymentEnrollment {
  _id:   string
  group: string
  status: string
}

export interface Payment {
  _id:        string
  student:    PaymentStudent
  enrollment: PaymentEnrollment
  amount:     number
  month:      string
  status:     'pending' | 'paid' | 'overdue' | string
  note?:      string
  paidAt?:    string | null
  createdAt:  string
}

export interface PaymentsResponse {
  payments:    Payment[]
  total:       number
  page:        number
  limit:       number
  totalPages:  number
  hasNextPage: boolean
  hasPrevPage: boolean
  code:        string
  message:     string
}

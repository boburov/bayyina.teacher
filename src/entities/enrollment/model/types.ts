export interface EnrollmentStudent {
  _id:       string
  firstName: string
  lastName:  string
  phone:     number
}

export interface EnrollmentGroup {
  _id:     string
  name:    string
  price:   number
  teacher: {
    _id:       string
    firstName: string
    lastName:  string
  }
}

export interface Enrollment {
  _id:             string
  student:         EnrollmentStudent
  group:           EnrollmentGroup
  status:          'active' | 'inactive' | string
  enrolledAt:      string
  monthlyFee:      number
  discount:        number
  discountReason:  string
  paymentDay:      number
  lastPaymentDate: string | null
  nextPaymentDate: string | null
  debt:            number
  balance:         number
  createdAt:       string
  updatedAt:       string
}

/** Response shape for GET /enrollments/{groupId} */
export interface EnrollmentsResponse {
  enrollments?: Enrollment[]
  enrollment?:  Enrollment
  total?:       number
  page?:        number
  limit?:       number
  totalPages?:  number
  code:         string
  message:      string
}

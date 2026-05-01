import { http } from '@/shared/api/http'
import type { Enrollment, EnrollmentsResponse } from './types'

export async function fetchEnrollmentsByGroup(groupId: string): Promise<Enrollment[]> {
  const res = await http.get<EnrollmentsResponse>(`enrollments?group=${groupId}`)
  return res.enrollments ?? []
}

/**
 * Transfer student to another group.
 *
 * NOTE: Backend does not have a dedicated transfer endpoint.
 * This is implemented client-side using two existing calls:
 *   1. PUT /enrollments/:id  → status: "dropped"
 *   2. POST /enrollments     → student + new group
 */
export async function transferEnrollment(
  enrollmentId: string,
  targetGroup:  string,
  studentId:    string,
  enrollmentData?: {
    discount?: number
    discountReason?: string
    paymentDay?: number
    debt?: number
    balance?: number
  },
): Promise<Enrollment> {
  await http.put<EnrollmentsResponse>(
    `enrollments/${enrollmentId}`,
    { status: 'dropped' },
  )

  const res = await http.post<EnrollmentsResponse>(
    'enrollments',
    {
      student: studentId,
      group:   targetGroup,
      ...(enrollmentData?.discount    != null && { discount:       enrollmentData.discount }),
      ...(enrollmentData?.discountReason      && { discountReason: enrollmentData.discountReason }),
      ...(enrollmentData?.paymentDay  != null && { paymentDay:     enrollmentData.paymentDay }),
      ...(enrollmentData?.debt        != null && { debt:           enrollmentData.debt }),
      ...(enrollmentData?.balance     != null && { balance:        enrollmentData.balance }),
    },
  )
  return (res.enrollment ?? res.enrollments?.[0]) as Enrollment
}

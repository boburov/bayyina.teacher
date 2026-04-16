import { http } from '@/shared/api/http'
import type { Enrollment, EnrollmentsResponse } from './types'

/** GET /enrollments?group=groupId — returns all enrollments for a group */
export async function fetchEnrollmentsByGroup(
  groupId: string,
  token:   string,
): Promise<Enrollment[]> {
  const res = await http.get<EnrollmentsResponse>(`enrollments?group=${groupId}`, token)
  return res.enrollments ?? []
}

/**
 * Transfer student to another group.
 *
 * NOTE: Backend does not have a dedicated transfer endpoint.
 * This is implemented client-side using two existing calls:
 *   1. PUT /enrollments/:id  → status: "dropped"
 *   2. POST /enrollments     → student + new group
 *
 * Missing backend endpoint:
 *   PUT /enrollments/:id/transfer { targetGroup }
 *   Would atomically drop old + create new enrollment.
 */
export async function transferEnrollment(
  enrollmentId: string,
  targetGroup:  string,
  token:        string,
  studentId:    string,
  enrollmentData?: {
    discount?: number
    discountReason?: string
    paymentDay?: number
    debt?: number
    balance?: number
  },
): Promise<Enrollment> {
  // Step 1: Drop current enrollment
  await http.put<EnrollmentsResponse>(
    `enrollments/${enrollmentId}`,
    { status: 'dropped' },
    token,
  )

  // Step 2: Create new enrollment in target group
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
    token,
  )
  return (res.enrollment ?? res.enrollments?.[0]) as Enrollment
}

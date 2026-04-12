import { http } from '@/shared/api/http'
import type { Enrollment, EnrollmentsResponse } from './types'

/** GET /enrollments/{groupId} — returns all enrollments for a group */
export async function fetchEnrollmentsByGroup(
  groupId: string,
  token:   string,
): Promise<Enrollment[]> {
  const res = await http.get<EnrollmentsResponse>(`enrollments/${groupId}`, token)
  // API may return array or single object
  if (Array.isArray(res.enrollments)) return res.enrollments
  if (res.enrollment) return [res.enrollment]
  return []
}

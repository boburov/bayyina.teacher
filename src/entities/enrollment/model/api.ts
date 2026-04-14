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

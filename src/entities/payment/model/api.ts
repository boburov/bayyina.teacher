import { http } from '@/shared/api/http'
import type { PaymentsResponse } from './types'

export interface FetchPaymentsParams {
  group?:  string
  student?: string
  status?: string
  page?:   number
  limit?:  number
}

function buildQuery(params: FetchPaymentsParams): string {
  const q = new URLSearchParams()
  if (params.group)   q.set('group',   params.group)
  if (params.student) q.set('student', params.student)
  if (params.status)  q.set('status',  params.status)
  if (params.page)    q.set('page',    String(params.page))
  if (params.limit)   q.set('limit',   String(params.limit))
  const qs = q.toString()
  return qs ? `?${qs}` : ''
}

export async function fetchPayments(
  token: string,
  params: FetchPaymentsParams = {},
): Promise<PaymentsResponse> {
  return http.get<PaymentsResponse>(`payments${buildQuery(params)}`, token)
}

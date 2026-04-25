import { http } from '@/shared/api/http'
import type { SalariesResponse, SalaryResponse, Salary } from './types'

export interface FetchSalariesParams {
  month?:  string
  from?:   string
  to?:     string
  status?: 'pending' | 'paid'
  page?:   number
  limit?:  number
}

function buildQuery(params: FetchSalariesParams): string {
  const q = new URLSearchParams()
  if (params.month)  q.set('month',  params.month)
  if (params.from)   q.set('from',   params.from)
  if (params.to)     q.set('to',     params.to)
  if (params.status) q.set('status', params.status)
  if (params.page)   q.set('page',   String(params.page))
  if (params.limit)  q.set('limit',  String(params.limit))
  const qs = q.toString()
  return qs ? `?${qs}` : ''
}

export async function fetchSalaries(
  token: string,
  params: FetchSalariesParams = {},
): Promise<SalariesResponse> {
  return http.get<SalariesResponse>(`salaries${buildQuery(params)}`, token)
}

export async function fetchSalaryById(id: string, token: string): Promise<Salary> {
  const res = await http.get<SalaryResponse>(`salaries/${id}`, token)
  return res.salary
}

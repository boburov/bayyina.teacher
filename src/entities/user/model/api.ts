import { http } from '@/shared/api/http'
import type { User } from './types'

// ─── Request / response shapes ────────────────────────────────────────────────

interface LoginPayload {
  phone:    number
  password: string
}

/** Flexible — handle both { token } and { accessToken } */
interface LoginResponse {
  token?:       string
  accessToken?: string
  [key: string]: unknown
}

interface ApiUser {
  _id:        string
  firstName:  string
  lastName:   string
  phone:      number
  role:       string
  telegramId?: string
  gender?:    string
  age?:       number
  source?:    string
  createdAt:  string
  updatedAt:  string
}

interface ProfileResponse {
  user:    ApiUser
  code:    string
  message: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapApiUser(u: ApiUser): User {
  return {
    id:        u._id,
    firstName: u.firstName,
    lastName:  u.lastName,
    name:      `${u.firstName} ${u.lastName}`,
    phone:     String(u.phone),
    email:     '',
    role:      u.role,
    gender:    u.gender,
    age:       u.age,
    avatar:    null,
  }
}

// ─── API calls ────────────────────────────────────────────────────────────────

/** POST /auth/login — returns JWT token string */
export async function loginApi(phone: number, password: string): Promise<string> {
  const payload: LoginPayload = { phone, password }
  const res = await http.post<LoginResponse>('auth/login', payload)
  const token = res.token ?? res.accessToken
  if (!token) throw new Error('Token not found in login response')
  return token
}

/** GET /auth/profile — returns mapped User */
export async function fetchProfile(token: string): Promise<User> {
  const res = await http.get<ProfileResponse>('auth/profile', token)
  return mapApiUser(res.user)
}

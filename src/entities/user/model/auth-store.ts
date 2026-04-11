import type { User } from './types'

const TOKEN_KEY = 'bayyina_token'
const USER_KEY  = 'bayyina_user'

// ─── Token ────────────────────────────────────────────────────────────────────

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

// ─── User ─────────────────────────────────────────────────────────────────────

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function setStoredUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// ─── Clear ────────────────────────────────────────────────────────────────────

export function clearStoredAuth(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// ─── Legacy compat (used in useLogin previously) ─────────────────────────────

/** @deprecated Use setStoredToken + setStoredUser separately */
export function setStoredAuth(user: User, token: string): void {
  setStoredToken(token)
  setStoredUser(user)
}

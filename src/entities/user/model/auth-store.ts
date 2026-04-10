import type { User } from './types'

const STORAGE_KEY = 'bayyina_auth'

interface StoredAuth {
  user: User
  token: string
}

export function getStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredAuth) : null
  } catch {
    return null
  }
}

export function setStoredAuth(user: User, token: string): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }))
}

export function clearStoredAuth(): void {
  localStorage.removeItem(STORAGE_KEY)
}

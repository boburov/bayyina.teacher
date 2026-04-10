import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@/entities/user/model/types'
import { getStoredAuth, clearStoredAuth } from '@/entities/user/model/auth-store'

interface AuthContextValue {
  user:            User | null
  isAuthenticated: boolean
  login:           (user: User, token: string) => void
  logout:          () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = getStoredAuth()

  const [user,  setUser]  = useState<User | null>(stored?.user ?? null)
  const [_token, setToken] = useState<string | null>(stored?.token ?? null)

  const login = useCallback((u: User, t: string) => {
    setUser(u)
    setToken(t)
  }, [])

  const logout = useCallback(() => {
    clearStoredAuth()
    setUser(null)
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

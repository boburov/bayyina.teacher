import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'
import type { ReactNode } from 'react'
import type { User } from '@/entities/user/model/types'
import {
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
  clearStoredAuth,
} from '@/entities/user/model/auth-store'
import { fetchProfile } from '@/entities/user/model/api'

interface AuthContextValue {
  user:            User | null
  token:           string | null
  isAuthenticated: boolean
  /** Call after a successful login — saves to storage and sets state */
  login:           (user: User, token: string) => void
  logout:          () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getStoredToken)
  const [user,  setUser]  = useState<User | null>(getStoredUser)

  // On mount, if we have a token, refresh the profile from the API.
  // This keeps the stored user in sync with server-side changes.
  useEffect(() => {
    const storedToken = getStoredToken()
    if (!storedToken) return

    fetchProfile()
      .then((freshUser) => {
        setUser(freshUser)
        setStoredUser(freshUser)
      })
      .catch(() => {
        // Token is invalid / expired — force logout
        clearStoredAuth()
        setUser(null)
        setToken(null)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = useCallback((u: User, t: string) => {
    setStoredToken(t)
    setStoredUser(u)
    setToken(t)
    setUser(u)
  }, [])

  const logout = useCallback(() => {
    clearStoredAuth()
    setUser(null)
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

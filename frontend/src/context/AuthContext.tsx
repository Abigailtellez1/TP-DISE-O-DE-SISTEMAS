import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

type UserRole = 'guest' | 'landlord'

interface JwtPayload {
  sub: string // userId
  email: string
  role: string // STUDENT or LANDLORD
  name: string
}

interface AuthContextValue {
  token: string | null
  userId: string | null
  email: string | null
  name: string | null
  role: UserRole
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const STORAGE_KEY = 'aeu:currentUser'

const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token)
  } catch {
    return null
  }
}

const mapRoleToUserRole = (role: string): UserRole => {
  return role === 'LANDLORD' ? 'landlord' : 'guest'
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [role, setRole] = useState<UserRole>('guest')

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return
    try {
      const parsed = JSON.parse(saved) as { token: string }
      const decoded = decodeToken(parsed.token)
      if (decoded) {
        setToken(parsed.token)
        setUserId(decoded.sub)
        setEmail(decoded.email)
        setName(decoded.name)
        setRole(mapRoleToUserRole(decoded.role))
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  const login = (newToken: string) => {
    const decoded = decodeToken(newToken)
    if (!decoded) {
      console.error('Invalid token')
      return
    }

    setToken(newToken)
    setUserId(decoded.sub)
    setEmail(decoded.email)
    setName(decoded.name)
    setRole(mapRoleToUserRole(decoded.role))
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: newToken }))
  }

  const logout = () => {
    setToken(null)
    setUserId(null)
    setEmail(null)
    setName(null)
    setRole('guest')
    window.localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(
    () => ({ token, userId, email, name, role, login, logout }),
    [token, userId, email, name, role]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

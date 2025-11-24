import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type UserRole = 'guest' | 'landlord'

interface AuthContextValue {
  userId: string | null
  role: UserRole
  login: (userId: string, role: UserRole) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const STORAGE_KEY = 'aeu:currentUser'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null)
  const [role, setRole] = useState<UserRole>('guest')

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return
    try {
      const parsed = JSON.parse(saved) as { userId: string; role: UserRole }
      setUserId(parsed.userId)
      setRole(parsed.role ?? 'guest')
    } catch {
      // ignore parse errors
    }
  }, [])

  const login = (id: string, userRole: UserRole) => {
    setUserId(id)
    setRole(userRole)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ userId: id, role: userRole }))
  }

  const logout = () => {
    setUserId(null)
    setRole('guest')
    window.localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(() => ({ userId, role, login, logout }), [userId, role])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

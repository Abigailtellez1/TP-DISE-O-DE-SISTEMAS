import { createContext, useContext, useEffect, useMemo, useState } from 'react'

interface AuthContextValue {
  userId: string | null
  login: (userId: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const STORAGE_KEY = 'aeu:currentUserId'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setUserId(saved)
    }
  }, [])

  const login = (id: string) => {
    setUserId(id)
    window.localStorage.setItem(STORAGE_KEY, id)
  }

  const logout = () => {
    setUserId(null)
    window.localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(() => ({ userId, login, logout }), [userId])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

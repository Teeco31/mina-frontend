'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import {
  getStoredToken,
  setStoredTokens,
  clearStoredTokens,
  login as apiLogin,
  logout as apiLogout,
} from '@/lib/api'
import { getMe, registerMember, type MemberUser } from '@/lib/memberApi'

interface AuthContextType {
  user: MemberUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    phone?: string
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  setUser: (user: MemberUser | null) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function setMemberCookie(token: string) {
  if (typeof document === 'undefined') return
  const maxAge = 7 * 24 * 60 * 60 // 7 days
  document.cookie = `mina_member_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`
}

function clearMemberCookie() {
  if (typeof document === 'undefined') return
  document.cookie = 'mina_member_token=; path=/; max-age=0'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MemberUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const token = getStoredToken()
    if (!token) {
      setLoading(false)
      return
    }
    const { user: me } = await getMe()
    if (me) {
      setUser(me)
      setMemberCookie(token)
    } else {
      clearStoredTokens()
      clearMemberCookie()
      setUser(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password)
    if (!res.success) return { success: false, error: res.error }
    const token = getStoredToken()
    if (token) setMemberCookie(token)
    await refreshUser()
    return { success: true }
  }

  const register = async (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    phone?: string
  }) => {
    const { data: res, error } = await registerMember(data)
    if (error || !res?.success) return { success: false, error: error || 'Registration failed' }
    setStoredTokens(res.accessToken, res.refreshToken)
    setMemberCookie(res.accessToken)
    await refreshUser()
    return { success: true }
  }

  const logout = async () => {
    await apiLogout()
    clearMemberCookie()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be called inside <AuthProvider>')
  return ctx
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User } from '@/shared/domain/entities'
import { useData } from '@/shared/infrastructure/store'

const SESSION_KEY = 'bordersync.session'
const INACTIVITY_MS = 15 * 60 * 1000 // RNF21: cierre por 15 min de inactividad

interface SessionContextValue {
  user: User | null
  startSession: (userId: string) => void
  logout: () => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const data = useData()
  const [userId, setUserId] = useState<string | null>(() => localStorage.getItem(SESSION_KEY))

  // Resolvemos el usuario desde el store. Si fue bloqueado, la sesión cae.
  const user = useMemo(
    () => data.users.find((u) => u.id === userId && u.estado === 'activo') ?? null,
    [data.users, userId],
  )

  const startSession = useCallback((id: string) => {
    localStorage.setItem(SESSION_KEY, id)
    setUserId(id)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setUserId(null)
  }, [])

  // Cierre automático por inactividad (RNF21).
  useEffect(() => {
    if (!userId) return
    let timer: number
    const reset = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(logout, INACTIVITY_MS)
    }
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'] as const
    events.forEach((e) => window.addEventListener(e, reset))
    reset()
    return () => {
      window.clearTimeout(timer)
      events.forEach((e) => window.removeEventListener(e, reset))
    }
  }, [userId, logout])

  const value = useMemo(() => ({ user, startSession, logout }), [user, startSession, logout])

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession debe usarse dentro de <SessionProvider>')
  return ctx
}

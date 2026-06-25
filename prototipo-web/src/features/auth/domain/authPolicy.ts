import type { User } from '@/shared/domain/entities'

/** Reglas de autenticación (RNF20 / RNF 3.3.2). Funciones puras, sin estado. */

export const MAX_ATTEMPTS = 5
export const LOCK_MINUTES = 15

export type LoginResult =
  | { kind: 'success'; user: User; updatedUser: User }
  | { kind: 'invalid'; updatedUser?: User; remaining?: number }
  | { kind: 'blocked-admin' }
  | { kind: 'locked-temp'; until: string }
  | { kind: 'locked-now'; updatedUser: User; until: string }

export function isTemporarilyLocked(user: User, now: Date): boolean {
  return user.lockedUntil != null && new Date(user.lockedUntil) > now
}

/**
 * Evalúa un intento de inicio de sesión y devuelve tanto el resultado como el
 * nuevo estado del usuario (intentos fallidos / bloqueo) que debe persistirse.
 */
export function attemptLogin(user: User | undefined, password: string, now: Date): LoginResult {
  // Por seguridad, un email inexistente devuelve el mismo error genérico.
  if (!user) return { kind: 'invalid' }

  if (user.estado === 'bloqueado') return { kind: 'blocked-admin' }

  if (isTemporarilyLocked(user, now)) {
    return { kind: 'locked-temp', until: user.lockedUntil as string }
  }

  if (user.password !== password) {
    const attempts = user.failedAttempts + 1
    if (attempts >= MAX_ATTEMPTS) {
      const until = new Date(now.getTime() + LOCK_MINUTES * 60_000).toISOString()
      return {
        kind: 'locked-now',
        until,
        updatedUser: { ...user, failedAttempts: attempts, lockedUntil: until },
      }
    }
    return {
      kind: 'invalid',
      remaining: MAX_ATTEMPTS - attempts,
      updatedUser: { ...user, failedAttempts: attempts },
    }
  }

  // Credenciales correctas: se reinicia el contador de intentos.
  const updatedUser: User = { ...user, failedAttempts: 0, lockedUntil: null }
  return { kind: 'success', user: updatedUser, updatedUser }
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '@/shared/infrastructure/store'
import { usersRepository } from '@/shared/infrastructure/usersRepository'
import { activityRepository } from '@/shared/infrastructure/activityRepository'
import { useSession } from '@/shared/session/SessionProvider'
import { ROLE_HOME } from '@/shared/session/roleHome'
import { attemptLogin, LOCK_MINUTES } from '../domain/authPolicy'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Caso de uso de inicio de sesión (RF02 / RNF20). */
export function useLogin() {
  const data = useData()
  const navigate = useNavigate()
  const { startSession } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function login(email: string, password: string) {
    setError(null)
    setIsSubmitting(true)
    await delay(400) // simula la latencia de validación (RNF20: < 1s)

    const now = new Date()
    const user = data.users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
    )
    const result = attemptLogin(user, password, now)

    switch (result.kind) {
      case 'success':
        usersRepository.mutate(result.updatedUser.id, () => result.updatedUser)
        activityRepository.log(result.user, 'Inició sesión')
        startSession(result.user.id)
        navigate(ROLE_HOME[result.user.rol])
        break
      case 'invalid':
        if (result.updatedUser) {
          usersRepository.mutate(result.updatedUser.id, () => result.updatedUser!)
        }
        setError(
          result.remaining != null
            ? `Usuario o contraseña incorrectos. Te quedan ${result.remaining} intento(s).`
            : 'Usuario o contraseña incorrectos.',
        )
        break
      case 'locked-now':
        usersRepository.mutate(result.updatedUser.id, () => result.updatedUser)
        setError(
          `Cuenta bloqueada temporalmente por ${LOCK_MINUTES} minutos tras 5 intentos fallidos.`,
        )
        break
      case 'locked-temp':
        setError(
          `Cuenta bloqueada temporalmente. Intenta nuevamente más tarde (bloqueo de ${LOCK_MINUTES} min).`,
        )
        break
      case 'blocked-admin':
        setError('Tu cuenta está bloqueada por el administrador. Contacta a soporte.')
        break
    }

    setIsSubmitting(false)
  }

  return { login, error, isSubmitting }
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from '@/shared/domain/entities'
import { useData } from '@/shared/infrastructure/store'
import { usersRepository } from '@/shared/infrastructure/usersRepository'
import { activityRepository } from '@/shared/infrastructure/activityRepository'
import { useSession } from '@/shared/session/SessionProvider'
import { ROLE_HOME } from '@/shared/session/roleHome'
import { validateRegistration, type RegisterInput, type RegisterErrors } from '../domain/registration'

const empty: RegisterInput = {
  nombre: '',
  nacionalidad: '',
  documento: '',
  email: '',
  password: '',
  confirm: '',
}

/** Caso de uso de registro de viajero (RF01). */
export function useRegister() {
  const data = useData()
  const navigate = useNavigate()
  const { startSession } = useSession()
  const [input, setInput] = useState<RegisterInput>(empty)
  const [errors, setErrors] = useState<RegisterErrors>({})

  function setField<K extends keyof RegisterInput>(field: K, value: string) {
    setInput((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function submit() {
    const existing = data.users.map((u) => u.email.toLowerCase())
    const found = validateRegistration(input, existing)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      return
    }

    const user: User = {
      id: `u-${Date.now()}`,
      nombre: input.nombre.trim(),
      nacionalidad: input.nacionalidad,
      documento: input.documento.trim(),
      email: input.email.trim().toLowerCase(),
      password: input.password,
      rol: 'viajero',
      estado: 'activo',
      failedAttempts: 0,
      lockedUntil: null,
    }
    usersRepository.add(user)
    activityRepository.log(user, 'Registró su cuenta e inició sesión')
    startSession(user.id)
    navigate(ROLE_HOME.viajero)
  }

  return { input, errors, setField, submit }
}

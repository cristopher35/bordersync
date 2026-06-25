import type { ActorRef } from '@/shared/domain/entities'
import { usersRepository } from '@/shared/infrastructure/usersRepository'
import { activityRepository } from '@/shared/infrastructure/activityRepository'

/** HU12: bloquea un usuario activo (control de acceso RBAC). */
export function bloquearUsuario(id: string, nombre: string, actor: ActorRef) {
  usersRepository.mutate(id, (u) => ({ ...u, estado: 'bloqueado' }))
  activityRepository.log(actor, `Bloqueó al usuario ${nombre}`)
}

/** HU12: reactiva un usuario bloqueado y reinicia su contador de intentos. */
export function reactivarUsuario(id: string, nombre: string, actor: ActorRef) {
  usersRepository.mutate(id, (u) => ({
    ...u,
    estado: 'activo',
    failedAttempts: 0,
    lockedUntil: null,
  }))
  activityRepository.log(actor, `Reactivó al usuario ${nombre}`)
}

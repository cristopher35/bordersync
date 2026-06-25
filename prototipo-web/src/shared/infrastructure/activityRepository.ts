import type { ActorRef, ActivityEntry } from '@/shared/domain/entities'
import { store } from './store'

function newId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return `a-${Date.now()}-${Math.round(Math.random() * 1e6)}`
  }
}

/**
 * Registro de actividad global del sistema. Cada acción relevante (login,
 * creación o validación de trámites, revisiones, gestión de usuarios) deja una
 * entrada con su actor, rol y fecha, alimentando los historiales por rol y la
 * auditoría del administrador.
 */
export const activityRepository = {
  log(actor: ActorRef, accion: string, opts: { tramiteId?: string; resultado?: string } = {}) {
    const entry: ActivityEntry = {
      id: newId(),
      fecha: new Date().toISOString(),
      actorId: actor.id,
      actorNombre: actor.nombre,
      actorRol: actor.rol,
      accion,
      tramiteId: opts.tramiteId,
      resultado: opts.resultado,
    }
    store.update((data) => ({ ...data, actividad: [entry, ...(data.actividad ?? [])] }))
  },
}

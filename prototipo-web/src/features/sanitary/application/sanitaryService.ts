import type { ActorRef } from '@/shared/domain/entities'
import { tramitesRepository } from '@/shared/infrastructure/tramitesRepository'
import { activityRepository } from '@/shared/infrastructure/activityRepository'

const now = () => new Date().toISOString()

/** HU11: aprueba la declaración SAG de un trámite. */
export function aprobarSag(id: string, actor: ActorRef) {
  const ts = now()
  tramitesRepository.mutate(id, (t) =>
    t.declaracionSag
      ? {
          ...t,
          declaracionSag: { ...t.declaracionSag, estadoRevision: 'aprobada', motivoRechazo: undefined },
          updatedAt: ts,
          historial: [...t.historial, { fecha: ts, actor: actor.nombre, accion: 'Aprobó declaración SAG' }],
        }
      : t,
  )
  activityRepository.log(actor, `Aprobó la declaración SAG del trámite ${id}`, {
    tramiteId: id,
    resultado: 'aprobada',
  })
}

/** HU11: rechaza la declaración SAG, registrando el motivo. */
export function rechazarSag(id: string, actor: ActorRef, motivo: string) {
  const ts = now()
  tramitesRepository.mutate(id, (t) =>
    t.declaracionSag
      ? {
          ...t,
          declaracionSag: { ...t.declaracionSag, estadoRevision: 'rechazada', motivoRechazo: motivo },
          updatedAt: ts,
          historial: [
            ...t.historial,
            { fecha: ts, actor: actor.nombre, accion: 'Rechazó declaración SAG', resultado: motivo },
          ],
        }
      : t,
  )
  activityRepository.log(actor, `Rechazó la declaración SAG del trámite ${id}`, {
    tramiteId: id,
    resultado: motivo,
  })
}

/** HU11: aprueba la declaración de mascota. */
export function aprobarMascota(id: string, actor: ActorRef) {
  const ts = now()
  tramitesRepository.mutate(id, (t) =>
    t.declaracionMascota
      ? {
          ...t,
          declaracionMascota: { ...t.declaracionMascota, estadoRevision: 'aprobada', motivoRechazo: undefined },
          updatedAt: ts,
          historial: [...t.historial, { fecha: ts, actor: actor.nombre, accion: 'Aprobó declaración de mascota' }],
        }
      : t,
  )
  activityRepository.log(actor, `Aprobó la declaración de mascota del trámite ${id}`, {
    tramiteId: id,
    resultado: 'aprobada',
  })
}

/** HU11: rechaza la declaración de mascota, registrando el motivo. */
export function rechazarMascota(id: string, actor: ActorRef, motivo: string) {
  const ts = now()
  tramitesRepository.mutate(id, (t) =>
    t.declaracionMascota
      ? {
          ...t,
          declaracionMascota: { ...t.declaracionMascota, estadoRevision: 'rechazada', motivoRechazo: motivo },
          updatedAt: ts,
          historial: [
            ...t.historial,
            { fecha: ts, actor: actor.nombre, accion: 'Rechazó declaración de mascota', resultado: motivo },
          ],
        }
      : t,
  )
  activityRepository.log(actor, `Rechazó la declaración de mascota del trámite ${id}`, {
    tramiteId: id,
    resultado: motivo,
  })
}

import type { ActorRef } from '@/shared/domain/entities'
import { tramitesRepository } from '@/shared/infrastructure/tramitesRepository'
import { activityRepository } from '@/shared/infrastructure/activityRepository'

const now = () => new Date().toISOString()

/** Control migratorio PDI: aprueba el ingreso/salida de la persona. */
export function aprobarMigratorio(id: string, actor: ActorRef) {
  const ts = now()
  tramitesRepository.mutate(id, (t) => ({
    ...t,
    controlMigratorio: { estado: 'aprobado', revisadoPor: actor.nombre, motivo: null },
    updatedAt: ts,
    historial: [...t.historial, { fecha: ts, actor: actor.nombre, accion: 'Aprobó control migratorio' }],
  }))
  activityRepository.log(actor, `Aprobó el control migratorio del trámite ${id}`, {
    tramiteId: id,
    resultado: 'aprobado',
  })
}

/** Control migratorio PDI: rechaza, registrando el motivo. */
export function rechazarMigratorio(id: string, actor: ActorRef, motivo: string) {
  const ts = now()
  tramitesRepository.mutate(id, (t) => ({
    ...t,
    controlMigratorio: { estado: 'rechazado', revisadoPor: actor.nombre, motivo },
    updatedAt: ts,
    historial: [
      ...t.historial,
      { fecha: ts, actor: actor.nombre, accion: 'Rechazó control migratorio', resultado: motivo },
    ],
  }))
  activityRepository.log(actor, `Rechazó el control migratorio del trámite ${id}`, {
    tramiteId: id,
    resultado: motivo,
  })
}

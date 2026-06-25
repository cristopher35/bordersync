import type { ActorRef } from '@/shared/domain/entities'
import { tramitesRepository } from '@/shared/infrastructure/tramitesRepository'
import { activityRepository } from '@/shared/infrastructure/activityRepository'

const now = () => new Date().toISOString()

/** RF06/HU08: el funcionario de Aduanas aprueba los documentos del trámite. */
export function validarTramite(id: string, actor: ActorRef) {
  const ts = now()
  tramitesRepository.mutate(id, (t) => ({
    ...t,
    estadoValidacion: 'aprobado',
    updatedAt: ts,
    historial: [
      ...t.historial,
      { fecha: ts, actor: actor.nombre, accion: 'Validó documentos', resultado: 'aprobado' },
    ],
  }))
  activityRepository.log(actor, `Validó documentos del trámite ${id}`, {
    tramiteId: id,
    resultado: 'aprobado',
  })
}

/** HU08: rechaza el trámite por inconsistencias, dejando trazabilidad. */
export function rechazarTramite(id: string, actor: ActorRef, motivo: string) {
  const ts = now()
  tramitesRepository.mutate(id, (t) => ({
    ...t,
    estadoValidacion: 'rechazado',
    updatedAt: ts,
    historial: [
      ...t.historial,
      { fecha: ts, actor: actor.nombre, accion: 'Rechazó documentos', resultado: motivo || 'rechazado' },
    ],
  }))
  activityRepository.log(actor, `Rechazó el trámite ${id}`, {
    tramiteId: id,
    resultado: motivo || 'rechazado',
  })
}

/** Dispara la descarga de un archivo en el navegador (export de reportes). */
export function descargarArchivo(nombre: string, contenido: string, mime: string) {
  const blob = new Blob([contenido], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombre
  a.click()
  URL.revokeObjectURL(url)
}

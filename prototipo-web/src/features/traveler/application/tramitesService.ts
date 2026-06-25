import type {
  Tramite,
  Vehiculo,
  DeclaracionMascota,
  Producto,
  User,
  ActorRef,
} from '@/shared/domain/entities'
import { tramitesRepository } from '@/shared/infrastructure/tramitesRepository'
import { activityRepository } from '@/shared/infrastructure/activityRepository'
import { evaluarDeclaracionSag } from '../domain/sagPolicy'

export interface DocumentacionInput {
  destino: string
  fechaViaje: string
  motivo: string
}

const now = () => new Date().toISOString()

/** RF03: crea un trámite con la documentación de viaje precargada. */
export function createTramite(user: User, doc: DocumentacionInput, allTramites: Tramite[]): string {
  const id = tramitesRepository.nextId(allTramites)
  const ts = now()
  const tramite: Tramite = {
    id,
    travelerUserId: user.id,
    viajero: {
      nombre: user.nombre,
      documento: user.documento,
      nacionalidad: user.nacionalidad || 'No especificada',
    },
    documentacion: {
      destino: doc.destino.trim(),
      fechaViaje: doc.fechaViaje,
      motivo: doc.motivo.trim(),
    },
    vehiculo: null,
    declaracionSag: null,
    declaracionMascota: null,
    controlMigratorio: { estado: 'pendiente', revisadoPor: null, motivo: null },
    estadoValidacion: 'pendiente',
    createdAt: ts,
    updatedAt: ts,
    historial: [{ fecha: ts, actor: user.nombre, accion: 'Creó el trámite y precargó documentación' }],
  }
  tramitesRepository.add(tramite)
  activityRepository.log(user, `Creó el trámite ${id}`, { tramiteId: id })
  return id
}

/** RF04: adjunta el vehículo y su documento al trámite. */
export function setVehiculo(id: string, vehiculo: Vehiculo, actor: ActorRef) {
  const ts = now()
  tramitesRepository.mutate(id, (t) => ({
    ...t,
    vehiculo,
    estadoValidacion: 'pendiente',
    updatedAt: ts,
    historial: [
      ...t.historial,
      { fecha: ts, actor: actor.nombre, accion: 'Registró vehículo', resultado: vehiculo.documentoGenerado },
    ],
  }))
  activityRepository.log(actor, `Registró vehículo en ${id}`, {
    tramiteId: id,
    resultado: vehiculo.documentoGenerado,
  })
}

/** RF05: registra la declaración SAG calculando advertencia y nivel de riesgo. */
export function setSagDeclaration(id: string, productos: Producto[], actor: ActorRef) {
  const ts = now()
  const { advertencia, nivelRiesgo } = evaluarDeclaracionSag(productos)
  tramitesRepository.mutate(id, (t) => ({
    ...t,
    declaracionSag: { productos, advertencia, nivelRiesgo, estadoRevision: 'pendiente' },
    estadoValidacion: 'pendiente',
    updatedAt: ts,
    historial: [
      ...t.historial,
      {
        fecha: ts,
        actor: actor.nombre,
        accion: 'Registró declaración SAG',
        resultado: advertencia ? `Advertencia · riesgo ${nivelRiesgo}` : 'Sin advertencias',
      },
    ],
  }))
  activityRepository.log(actor, `Registró declaración SAG en ${id}`, {
    tramiteId: id,
    resultado: `riesgo ${nivelRiesgo}`,
  })
}

/** RF09: registra la declaración de mascota. */
export function setMascota(id: string, mascota: DeclaracionMascota, actor: ActorRef) {
  const ts = now()
  tramitesRepository.mutate(id, (t) => ({
    ...t,
    declaracionMascota: mascota,
    estadoValidacion: 'pendiente',
    updatedAt: ts,
    historial: [
      ...t.historial,
      {
        fecha: ts,
        actor: actor.nombre,
        accion: 'Registró declaración de mascota',
        resultado: `${mascota.cantidad} ${mascota.tipoAnimal}`,
      },
    ],
  }))
  activityRepository.log(actor, `Registró declaración de mascota en ${id}`, { tramiteId: id })
}

/**
 * Elimina un componente del trámite (vehículo o una declaración) para poder
 * corregirlo. Al cambiar los datos, el trámite vuelve a quedar pendiente de
 * validación y se deja constancia en el historial.
 */
export type ComponenteTramite = 'vehiculo' | 'declaracionSag' | 'declaracionMascota'

const ACCION_ELIMINAR: Record<ComponenteTramite, string> = {
  vehiculo: 'Eliminó el vehículo',
  declaracionSag: 'Eliminó la declaración SAG',
  declaracionMascota: 'Eliminó la declaración de mascota',
}

export function removeComponente(id: string, componente: ComponenteTramite, actor: ActorRef) {
  const ts = now()
  tramitesRepository.mutate(id, (t) => ({
    ...t,
    [componente]: null,
    estadoValidacion: 'pendiente',
    updatedAt: ts,
    historial: [...t.historial, { fecha: ts, actor: actor.nombre, accion: ACCION_ELIMINAR[componente] }],
  }))
  activityRepository.log(actor, `${ACCION_ELIMINAR[componente]} del trámite ${id}`, { tramiteId: id })
}

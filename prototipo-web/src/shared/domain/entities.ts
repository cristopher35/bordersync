/**
 * Shared kernel (DDD): entidades persistidas que cruzan varias features.
 * Estas son las formas que viven en data.json / localStorage. Las reglas de
 * negocio sobre ellas viven en los domain services de cada feature.
 */

export type Role = 'viajero' | 'aduanas' | 'sag' | 'pdi' | 'admin'

export const ROLE_LABELS: Record<Role, string> = {
  viajero: 'Viajero / Turista',
  aduanas: 'Funcionario de Aduanas',
  sag: 'Funcionario SAG',
  pdi: 'Funcionario PDI',
  admin: 'Administrador del Sistema',
}

export type EstadoValidacion = 'pendiente' | 'aprobado' | 'rechazado'

/** Estado de la revisión de una declaración por parte de SAG. */
export type EstadoRevision = 'pendiente' | 'aprobada' | 'rechazada'
export type NivelRiesgo = 'alto' | 'medio' | 'bajo'
export type CategoriaProducto = 'permitido' | 'restringido' | 'prohibido'
export type TipoVehiculo = 'particular' | 'diplomatico'
export type PlacaDiplomatica = 'CD' | 'CC' | 'OI' | 'PAT'

export interface User {
  id: string
  nombre: string
  documento: string // RUN (chilenos) o pasaporte / documento (extranjeros)
  nacionalidad: string
  email: string
  /** Solo maqueta: en producción se guardaría como hash bcrypt (RNF 3.3.2). */
  password: string
  rol: Role
  estado: 'activo' | 'bloqueado'
  failedAttempts: number
  /** ISO datetime hasta el cual la cuenta está bloqueada por intentos fallidos. */
  lockedUntil: string | null
}

export interface Producto {
  nombre: string
  categoria: CategoriaProducto
  cantidad: number
}

export interface Vehiculo {
  tipo: TipoVehiculo
  patente: string
  modelo: string
  propietario: string
  tipoPlaca: PlacaDiplomatica | null
  documentoGenerado: string
  vigenciaDias: number
  vencimiento: string // ISO date
}

export interface DeclaracionSag {
  productos: Producto[]
  advertencia: boolean
  nivelRiesgo: NivelRiesgo
  estadoRevision: EstadoRevision
  motivoRechazo?: string
}

export interface DeclaracionMascota {
  tipoAnimal: string
  cantidad: number
  declaranteEsMenor: boolean
  representanteLegal: string | null
  nivelRiesgo: NivelRiesgo
  estadoRevision: EstadoRevision
  motivoRechazo?: string
}

/** Control migratorio de personas a cargo de la PDI. */
export interface ControlMigratorio {
  estado: 'pendiente' | 'aprobado' | 'rechazado'
  revisadoPor: string | null
  motivo: string | null
}

export interface HistorialEntry {
  fecha: string // ISO datetime
  actor: string
  accion: string
  resultado?: string
}

export interface Tramite {
  id: string
  travelerUserId: string
  viajero: { nombre: string; documento: string; nacionalidad: string }
  documentacion: { destino: string; fechaViaje: string; motivo: string }
  vehiculo: Vehiculo | null
  declaracionSag: DeclaracionSag | null
  declaracionMascota: DeclaracionMascota | null
  controlMigratorio: ControlMigratorio
  estadoValidacion: EstadoValidacion
  createdAt: string // ISO datetime
  updatedAt: string // ISO datetime
  historial: HistorialEntry[]
}

/** Referencia mínima del actor que ejecuta una acción (para el registro). */
export type ActorRef = Pick<User, 'id' | 'nombre' | 'rol'>

/** Entrada del registro de actividad global del sistema (auditoría/trazabilidad). */
export interface ActivityEntry {
  id: string
  fecha: string // ISO datetime
  actorId: string
  actorNombre: string
  actorRol: Role
  accion: string
  tramiteId?: string
  resultado?: string
}

export interface Integracion {
  nombre: string
  estado: 'operativa' | 'degradada' | 'caida'
  latenciaMs: number
}

export interface Parametro {
  clave: string
  descripcion: string
  activo: boolean
}

/** Documento raíz persistido. */
export interface BorderSyncData {
  users: User[]
  tramites: Tramite[]
  actividad: ActivityEntry[]
  integraciones: Integracion[]
  parametros: Parametro[]
}

import type { Tramite } from './entities'

/**
 * Flujo de trabajo (workflow) de un trámite de cruce fronterizo. Deriva, a
 * partir de los controles independientes (PDI, SAG, Aduanas), una secuencia de
 * etapas con su estado, para mostrar a viajeros y funcionarios en qué punto del
 * proceso está cada trámite.
 */
export type EtapaEstado = 'completada' | 'actual' | 'pendiente' | 'rechazada'

export interface Etapa {
  clave: string
  titulo: string
  estado: EtapaEstado
}

export type EstadoGlobal = 'en_proceso' | 'autorizado' | 'rechazado'

export interface Workflow {
  etapas: Etapa[]
  estadoGlobal: EstadoGlobal
  resumen: string
}

function estadoMigratorio(t: Tramite): EtapaEstado {
  if (t.controlMigratorio.estado === 'aprobado') return 'completada'
  if (t.controlMigratorio.estado === 'rechazado') return 'rechazada'
  return 'pendiente'
}

function estadoSanitario(t: Tramite): EtapaEstado {
  const decls = [t.declaracionSag, t.declaracionMascota].filter(
    (d): d is NonNullable<typeof d> => d != null,
  )
  if (decls.length === 0) return 'completada' // sin declaraciones: nada que revisar
  if (decls.some((d) => d.estadoRevision === 'rechazada')) return 'rechazada'
  if (decls.every((d) => d.estadoRevision === 'aprobada')) return 'completada'
  return 'pendiente'
}

function estadoAduanas(t: Tramite): EtapaEstado {
  if (t.estadoValidacion === 'aprobado') return 'completada'
  if (t.estadoValidacion === 'rechazado') return 'rechazada'
  return 'pendiente'
}

export interface ValidacionAduana {
  permitido: boolean
  faltaMigratorio: boolean
  faltaSanitario: boolean
  razon?: string
}

/**
 * Regla de negocio: Aduanas solo puede APROBAR un trámite cuando el control
 * migratorio (PDI) y el control sanitario (SAG) están aprobados. Si alguno está
 * pendiente o rechazado, no se permite la aprobación (sí el rechazo).
 */
export function puedeValidarAduana(t: Tramite): ValidacionAduana {
  const faltaMigratorio = estadoMigratorio(t) !== 'completada'
  const faltaSanitario = estadoSanitario(t) !== 'completada'
  const permitido = !faltaMigratorio && !faltaSanitario

  let razon: string | undefined
  if (!permitido) {
    const partes: string[] = []
    if (faltaMigratorio) partes.push('control migratorio (PDI)')
    if (faltaSanitario) partes.push('control sanitario (SAG)')
    razon = `Requiere ${partes.join(' y ')} aprobado${partes.length > 1 ? 's' : ''} antes de validar.`
  }

  return { permitido, faltaMigratorio, faltaSanitario, razon }
}

export function calcularWorkflow(t: Tramite): Workflow {
  const etapas: Etapa[] = [
    { clave: 'doc', titulo: 'Documentación', estado: 'completada' },
    { clave: 'pdi', titulo: 'Control migratorio', estado: estadoMigratorio(t) },
    { clave: 'sag', titulo: 'Control sanitario', estado: estadoSanitario(t) },
    { clave: 'aduana', titulo: 'Validación Aduanas', estado: estadoAduanas(t) },
    { clave: 'final', titulo: 'Autorizado', estado: 'pendiente' },
  ]

  const controles = [etapas[1], etapas[2], etapas[3]]
  const algunoRechazado = controles.some((e) => e.estado === 'rechazada')
  const todosCompletados = controles.every((e) => e.estado === 'completada')
  if (todosCompletados) etapas[4].estado = 'completada'

  // La etapa "actual" es la primera pendiente (salvo que el proceso esté detenido por un rechazo).
  if (!algunoRechazado) {
    const idx = etapas.findIndex((e) => e.estado === 'pendiente')
    if (idx >= 0) etapas[idx].estado = 'actual'
  }

  const estadoGlobal: EstadoGlobal = algunoRechazado
    ? 'rechazado'
    : etapas[4].estado === 'completada'
      ? 'autorizado'
      : 'en_proceso'

  const rechazada = etapas.find((e) => e.estado === 'rechazada')
  const actual = etapas.find((e) => e.estado === 'actual')
  const resumen =
    estadoGlobal === 'autorizado'
      ? 'Autorizado a cruzar'
      : estadoGlobal === 'rechazado'
        ? `Rechazado en ${rechazada?.titulo ?? 'un control'}`
        : `En etapa: ${actual?.titulo ?? '—'}`

  return { etapas, estadoGlobal, resumen }
}

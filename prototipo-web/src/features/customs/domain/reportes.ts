import type { Tramite } from '@/shared/domain/entities'

/** Cálculo de estadísticas de flujo para reportes de Aduanas (RF08). Puro. */
export interface ReporteStats {
  total: number
  pendientes: number
  aprobados: number
  rechazados: number
  vehiculosParticulares: number
  vehiculosDiplomaticos: number
  declaracionesSag: number
  riesgoAlto: number
  mascotas: number
}

export function calcularReporte(tramites: Tramite[]): ReporteStats {
  return {
    total: tramites.length,
    pendientes: tramites.filter((t) => t.estadoValidacion === 'pendiente').length,
    aprobados: tramites.filter((t) => t.estadoValidacion === 'aprobado').length,
    rechazados: tramites.filter((t) => t.estadoValidacion === 'rechazado').length,
    vehiculosParticulares: tramites.filter((t) => t.vehiculo?.tipo === 'particular').length,
    vehiculosDiplomaticos: tramites.filter((t) => t.vehiculo?.tipo === 'diplomatico').length,
    declaracionesSag: tramites.filter((t) => t.declaracionSag).length,
    riesgoAlto: tramites.filter((t) => t.declaracionSag?.nivelRiesgo === 'alto').length,
    mascotas: tramites.filter((t) => t.declaracionMascota).length,
  }
}

/** Construye el contenido CSV (compatible con Excel) del listado de trámites. */
export function construirCsv(tramites: Tramite[]): string {
  const headers = ['ID', 'Viajero', 'Documento', 'Destino', 'Fecha viaje', 'Estado', 'Vehículo', 'SAG', 'Riesgo SAG', 'Mascota']
  const rows = tramites.map((t) => [
    t.id,
    t.viajero.nombre,
    t.viajero.documento,
    t.documentacion.destino,
    t.documentacion.fechaViaje,
    t.estadoValidacion,
    t.vehiculo?.tipo ?? '',
    t.declaracionSag ? 'sí' : 'no',
    t.declaracionSag?.nivelRiesgo ?? '',
    t.declaracionMascota ? `${t.declaracionMascota.cantidad} ${t.declaracionMascota.tipoAnimal}` : '',
  ])
  return [headers, ...rows]
    .map((cols) => cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n')
}

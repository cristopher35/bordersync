import type { Tramite } from '@/shared/domain/entities'

/**
 * Estima el tiempo de espera y el carril sugerido según el estado del trámite y
 * el riesgo de sus declaraciones. Materializa el objetivo del sistema: precargar
 * y aprobar en línea habilita el carril preferente y reduce el tiempo en frontera.
 */
export interface WaitEstimate {
  minutos: number
  etiqueta: string
  tono: 'green' | 'amber' | 'red'
}

function tieneRiesgoAlto(t: Tramite): boolean {
  return t.declaracionSag?.nivelRiesgo === 'alto'
}

export function estimarEspera(t: Tramite): WaitEstimate {
  if (t.estadoValidacion === 'aprobado') {
    return { minutos: 2, etiqueta: 'Carril preferente (pre-autorizado)', tono: 'green' }
  }
  if (t.estadoValidacion === 'rechazado') {
    return { minutos: 30, etiqueta: 'Requiere atención presencial', tono: 'red' }
  }
  // Pendiente de validación
  if (tieneRiesgoAlto(t)) {
    return { minutos: 25, etiqueta: 'Inspección SAG probable', tono: 'red' }
  }
  if (t.declaracionSag || t.declaracionMascota || t.vehiculo) {
    return { minutos: 15, etiqueta: 'Validación en curso', tono: 'amber' }
  }
  return { minutos: 10, etiqueta: 'Documentación básica', tono: 'amber' }
}

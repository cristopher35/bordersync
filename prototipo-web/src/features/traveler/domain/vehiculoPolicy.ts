import { type Result, ok, err } from '@/shared/domain/Result'
import type { Vehiculo, PlacaDiplomatica, TipoVehiculo } from '@/shared/domain/entities'
import { isBlank, isValidPatente } from '@/shared/lib/validation'

/** Reglas de negocio para la gestión de vehículos (RF04). */

export const PLACAS_DIPLOMATICAS: PlacaDiplomatica[] = ['CD', 'CC', 'OI', 'PAT']

const DOC_PARTICULAR = 'Salida y Admisión Temporal de Vehículos Acuerdo Chileno-Argentino'
const DOC_DIPLOMATICO = 'Título de Salida Temporal de Vehículos'
const DIAS_PARTICULAR = 180
const DIAS_DIPLOMATICO = 90

export interface VehiculoInput {
  tipo: TipoVehiculo
  patente: string
  modelo: string
  propietario: string
  tipoPlaca: PlacaDiplomatica | ''
}

function addDays(from: Date, days: number): string {
  const d = new Date(from)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

/**
 * Genera el documento de vehículo según su tipo:
 * - Particular → "Salida y Admisión Temporal..." con 180 días.
 * - Diplomático con placa válida (CD/CC/OI/PAT) → "Título de Salida..." con 90 días.
 * - Placa diplomática no reconocida → rechazo (RF04 excepción).
 */
export function buildVehiculo(input: VehiculoInput, now: Date): Result<Vehiculo> {
  if (isBlank(input.patente) || isBlank(input.modelo) || isBlank(input.propietario)) {
    return err('Patente, modelo y propietario son obligatorios.')
  }
  if (!isValidPatente(input.patente)) {
    return err('Patente inválida (letras y números, ej. BBBB-12, AB-1234 o AB 123 CD).')
  }

  if (input.tipo === 'diplomatico') {
    if (!input.tipoPlaca || !PLACAS_DIPLOMATICAS.includes(input.tipoPlaca)) {
      return err('Tipo de placa diplomática no reconocido (debe ser CD, CC, OI o PAT).')
    }
    return ok({
      tipo: 'diplomatico',
      patente: input.patente.trim().toUpperCase(),
      modelo: input.modelo.trim(),
      propietario: input.propietario.trim(),
      tipoPlaca: input.tipoPlaca,
      documentoGenerado: DOC_DIPLOMATICO,
      vigenciaDias: DIAS_DIPLOMATICO,
      vencimiento: addDays(now, DIAS_DIPLOMATICO),
    })
  }

  return ok({
    tipo: 'particular',
    patente: input.patente.trim().toUpperCase(),
    modelo: input.modelo.trim(),
    propietario: input.propietario.trim(),
    tipoPlaca: null,
    documentoGenerado: DOC_PARTICULAR,
    vigenciaDias: DIAS_PARTICULAR,
    vencimiento: addDays(now, DIAS_PARTICULAR),
  })
}

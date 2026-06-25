import { type Result, ok, err } from '@/shared/domain/Result'
import type { DeclaracionMascota } from '@/shared/domain/entities'
import { isBlank, inRange } from '@/shared/lib/validation'

/** Reglas de la declaración de mascotas (RF09 / HU06). */

export interface MascotaInput {
  tipoAnimal: string
  cantidad: number
  declaranteEsMenor: boolean
  representanteLegal: string
}

/**
 * Construye la declaración de mascota. Si el declarante es menor de 18 años,
 * exige los datos de un representante legal antes de permitir el envío.
 */
export function buildMascota(input: MascotaInput): Result<DeclaracionMascota> {
  if (isBlank(input.tipoAnimal)) return err('Indica el tipo de animal.')
  if (!inRange(input.cantidad, 1, 20)) return err('La cantidad debe estar entre 1 y 20.')

  if (input.declaranteEsMenor && input.representanteLegal.trim().length < 3) {
    return err('Como eres menor de edad, debes registrar un representante legal válido.')
  }

  return ok({
    tipoAnimal: input.tipoAnimal.trim(),
    cantidad: input.cantidad,
    declaranteEsMenor: input.declaranteEsMenor,
    representanteLegal: input.declaranteEsMenor ? input.representanteLegal.trim() : null,
    nivelRiesgo: 'medio',
    estadoRevision: 'pendiente',
  })
}

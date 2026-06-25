import { isEmail, isValidRut, isValidDocumento, isBlank } from '@/shared/lib/validation'

/** Nacionalidades disponibles en el registro. "Chilena" activa la validación de RUT. */
export const NACIONALIDADES = [
  'Chilena',
  'Argentina',
  'Peruana',
  'Boliviana',
  'Brasileña',
  'Paraguaya',
  'Uruguaya',
  'Colombiana',
  'Venezolana',
  'Ecuatoriana',
  'Otra',
] as const

export interface RegisterInput {
  nombre: string
  nacionalidad: string
  documento: string
  email: string
  password: string
  confirm: string
}

export type RegisterErrors = Partial<Record<keyof RegisterInput, string>>

/** Validación de registro de viajero (RF01). */
export function validateRegistration(input: RegisterInput, existingEmails: string[]): RegisterErrors {
  const errors: RegisterErrors = {}

  if (isBlank(input.nombre)) {
    errors.nombre = 'El nombre es obligatorio.'
  } else if (input.nombre.trim().length < 3) {
    errors.nombre = 'Ingresa tu nombre completo.'
  }

  if (isBlank(input.nacionalidad)) {
    errors.nacionalidad = 'Selecciona tu nacionalidad.'
  }

  // El RUT es una norma chilena: solo se valida cuando la nacionalidad es chilena.
  // Para extranjeros se acepta el pasaporte / documento de identidad genérico.
  const esChileno = input.nacionalidad === 'Chilena'
  if (isBlank(input.documento)) {
    errors.documento = 'El documento es obligatorio.'
  } else if (esChileno && !isValidRut(input.documento)) {
    errors.documento = 'RUT inválido (revisa el dígito verificador).'
  } else if (!esChileno && !isValidDocumento(input.documento)) {
    errors.documento = 'Documento inválido (pasaporte o identificación).'
  }

  if (isBlank(input.email)) {
    errors.email = 'El correo es obligatorio.'
  } else if (!isEmail(input.email)) {
    errors.email = 'Correo con formato inválido.'
  } else if (existingEmails.includes(input.email.trim().toLowerCase())) {
    errors.email = 'Ya existe una cuenta con este correo.'
  }

  if (input.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres.'
  } else if (!/[a-zA-Z]/.test(input.password) || !/\d/.test(input.password)) {
    errors.password = 'Debe incluir al menos una letra y un número.'
  }

  if (input.confirm !== input.password) {
    errors.confirm = 'Las contraseñas no coinciden.'
  }

  return errors
}

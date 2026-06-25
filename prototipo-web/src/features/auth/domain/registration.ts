import { isEmail, isValidRut, isBlank } from '@/shared/lib/validation'

export interface RegisterInput {
  nombre: string
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

  if (isBlank(input.documento)) {
    errors.documento = 'El documento es obligatorio.'
  } else if (!isValidRut(input.documento)) {
    errors.documento = 'RUT inválido (revisa el dígito verificador).'
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

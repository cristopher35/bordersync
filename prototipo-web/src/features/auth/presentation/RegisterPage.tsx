import { type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { TextField } from '@/shared/ui/TextField'
import { SelectField } from '@/shared/ui/SelectField'
import { PasswordField } from '@/shared/ui/PasswordField'
import { Button } from '@/shared/ui/Button'
import { formatRut, cleanRut } from '@/shared/lib/validation'
import { NACIONALIDADES } from '../domain/registration'
import { useRegister } from '../application/useRegister'

export function RegisterPage() {
  const { input, errors, setField, submit } = useRegister()
  const esChileno = input.nacionalidad === 'Chilena'

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    submit()
  }

  return (
    <main className="flex min-h-full items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="text-lg font-bold text-gov-800">BorderSync · SGAI</span>
          <h2 className="mt-4 text-2xl font-bold text-slate-900">Crear cuenta de viajero</h2>
          <p className="mt-1 text-sm text-slate-500">
            Regístrate para precargar tus trámites de cruce fronterizo.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
        >
          <TextField
            label="Nombre completo"
            name="nombre"
            value={input.nombre}
            onChange={(e) => setField('nombre', e.target.value)}
            error={errors.nombre}
            required
          />
          <SelectField
            label="Nacionalidad"
            name="nacionalidad"
            placeholder="Selecciona…"
            value={input.nacionalidad}
            onChange={(e) => setField('nacionalidad', e.target.value)}
            error={errors.nacionalidad}
            options={NACIONALIDADES.map((n) => ({ value: n, label: n }))}
            required
          />
          <TextField
            label={esChileno ? 'RUN' : 'Pasaporte o documento de identidad'}
            name="documento"
            placeholder={esChileno ? '12.345.678-9' : 'Ej. AB123456'}
            value={input.documento}
            onChange={(e) => setField('documento', e.target.value)}
            onBlur={(e) =>
              esChileno &&
              cleanRut(e.target.value).length >= 2 &&
              setField('documento', formatRut(e.target.value))
            }
            error={errors.documento}
            hint={esChileno ? 'Se valida el dígito verificador del RUN.' : undefined}
            required
          />
          <TextField
            label="Correo electrónico"
            name="email"
            type="email"
            value={input.email}
            onChange={(e) => setField('email', e.target.value)}
            error={errors.email}
            required
          />
          <PasswordField
            label="Contraseña"
            name="password"
            value={input.password}
            onChange={(e) => setField('password', e.target.value)}
            error={errors.password}
            hint="Mínimo 6 caracteres, con al menos una letra y un número."
            required
          />
          <PasswordField
            label="Confirmar contraseña"
            name="confirm"
            value={input.confirm}
            onChange={(e) => setField('confirm', e.target.value)}
            error={errors.confirm}
            required
          />

          <Button type="submit" fullWidth>
            Registrarme
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-gov-700 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  )
}

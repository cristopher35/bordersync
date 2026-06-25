import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { TextField } from '@/shared/ui/TextField'
import { PasswordField } from '@/shared/ui/PasswordField'
import { Button } from '@/shared/ui/Button'
import { useLogin } from '../application/useLogin'
import { DemoAccounts } from './components/DemoAccounts'

export function LoginPage() {
  const { login, error, isSubmitting } = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    void login(email, password)
  }

  return (
    <main className="grid min-h-full lg:grid-cols-2">
      {/* Panel institucional */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-gov-800 p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-linear-to-br from-gov-700 via-gov-800 to-gov-900" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500 text-lg font-bold">
            B
          </div>
          <div className="leading-tight">
            <p className="font-semibold">BorderSync</p>
            <p className="text-xs text-gov-200">Servicio Nacional de Aduanas</p>
          </div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold leading-tight">
            Cruza la frontera
            <br /> sin esperas.
          </h1>
          <p className="mt-4 max-w-md text-gov-100">
            Sistema de Gestión Aduanera Inteligente: precarga tus documentos, vehículo y
            declaraciones antes de llegar al control y reduce tu tiempo de espera en el paso
            fronterizo.
          </p>
        </div>
        <p className="relative z-10 text-xs text-gov-300">
          Prototipo funcional · datos simulados en el navegador
        </p>
      </aside>

      {/* Formulario */}
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <span className="text-lg font-bold text-gov-800">BorderSync · SGAI</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Iniciar sesión</h2>
          <p className="mt-1 text-sm text-slate-500">Accede con tus credenciales institucionales.</p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <TextField
              label="Usuario (correo)"
              name="email"
              type="email"
              placeholder="tucorreo@bordersync.cl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <PasswordField
              label="Contraseña"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>
            )}

            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Validando…' : 'Iniciar sesión'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-500">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="font-semibold text-gov-700 hover:underline">
              Regístrate
            </Link>
          </p>

          <DemoAccounts
            onPick={(e) => {
              setEmail(e)
              setPassword('123456')
            }}
          />
        </div>
      </section>
    </main>
  )
}

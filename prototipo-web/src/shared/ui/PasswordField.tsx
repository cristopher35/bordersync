import { useState, type InputHTMLAttributes } from 'react'
import { IconEye, IconEyeOff } from './icons'

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  name: string
  error?: string
  hint?: string
}

/** Campo de contraseña con botón para mostrar/ocultar el contenido. */
export function PasswordField({ label, name, error, hint, ...rest }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
        {rest.required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={visible ? 'text' : 'password'}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 pr-11 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-gov-500 focus:ring-2 focus:ring-gov-200 ${
            error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : 'border-slate-200'
          }`}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition hover:text-slate-600"
        >
          {visible ? <IconEyeOff /> : <IconEye />}
        </button>
      </div>
      {error ? (
        <span className="text-xs text-rose-500">{error}</span>
      ) : hint ? (
        <span className="text-xs text-slate-400">{hint}</span>
      ) : null}
    </div>
  )
}

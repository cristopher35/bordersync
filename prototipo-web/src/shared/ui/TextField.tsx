import type { InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
  error?: string
  hint?: string
}

export function TextField({ label, name, error, hint, ...rest }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
        {rest.required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-gov-500 focus:ring-2 focus:ring-gov-200 ${
          error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : 'border-slate-200'
        }`}
        {...rest}
      />
      {error ? (
        <span className="text-xs text-rose-500">{error}</span>
      ) : hint ? (
        <span className="text-xs text-slate-400">{hint}</span>
      ) : null}
    </div>
  )
}

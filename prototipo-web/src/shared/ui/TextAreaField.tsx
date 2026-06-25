import type { TextareaHTMLAttributes } from 'react'

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  name: string
  error?: string
}

export function TextAreaField({ label, name, error, ...rest }: TextAreaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
        {rest.required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        rows={3}
        className={`w-full resize-y rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-gov-500 focus:ring-2 focus:ring-gov-200 ${
          error ? 'border-rose-400' : 'border-slate-200'
        }`}
        {...rest}
      />
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  )
}

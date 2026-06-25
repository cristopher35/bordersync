import type { SelectHTMLAttributes } from 'react'

interface Option {
  value: string
  label: string
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  name: string
  options: Option[]
  error?: string
  placeholder?: string
}

export function SelectField({
  label,
  name,
  options,
  error,
  placeholder,
  ...rest
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
        {rest.required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        className={`w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-gov-500 focus:ring-2 focus:ring-gov-200 ${
          error ? 'border-rose-400' : 'border-slate-200'
        }`}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  )
}

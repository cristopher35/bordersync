import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'success'
  fullWidth?: boolean
}

const variants = {
  primary: 'bg-gov-700 text-white shadow-sm hover:bg-gov-800 focus:ring-gov-400',
  ghost: 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 focus:ring-slate-300',
  danger: 'bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus:ring-rose-400',
  success: 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus:ring-emerald-400',
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

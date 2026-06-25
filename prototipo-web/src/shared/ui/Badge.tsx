import type { ReactNode } from 'react'
import type { EstadoValidacion, NivelRiesgo } from '@/shared/domain/entities'

type Tone = 'gray' | 'blue' | 'green' | 'amber' | 'red' | 'teal'

const tones: Record<Tone, string> = {
  gray: 'bg-slate-100 text-slate-600 ring-slate-200',
  blue: 'bg-gov-50 text-gov-700 ring-gov-200',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  red: 'bg-rose-50 text-rose-700 ring-rose-200',
  teal: 'bg-teal-50 text-teal-700 ring-teal-200',
}

export function Badge({ tone = 'gray', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

const estadoTone: Record<EstadoValidacion, Tone> = {
  pendiente: 'amber',
  aprobado: 'green',
  rechazado: 'red',
}
const estadoLabel: Record<EstadoValidacion, string> = {
  pendiente: 'Pendiente',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
}

export function StatusBadge({ estado }: { estado: EstadoValidacion }) {
  return <Badge tone={estadoTone[estado]}>{estadoLabel[estado]}</Badge>
}

const riesgoTone: Record<NivelRiesgo, Tone> = {
  alto: 'red',
  medio: 'amber',
  bajo: 'green',
}

export function RiskBadge({ nivel }: { nivel: NivelRiesgo }) {
  return <Badge tone={riesgoTone[nivel]}>Riesgo {nivel}</Badge>
}

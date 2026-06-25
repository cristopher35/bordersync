import type { Tramite } from '@/shared/domain/entities'
import { estimarEspera } from '../../domain/waitEstimate'

const tonos = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  red: 'bg-rose-50 text-rose-700 ring-rose-200',
}

export function WaitEstimate({ tramite }: { tramite: Tramite }) {
  const { minutos, etiqueta, tono } = estimarEspera(tramite)
  return (
    <div className={`rounded-lg px-3 py-2 text-xs ring-1 ring-inset ${tonos[tono]}`}>
      <span className="font-semibold">~{minutos} min</span> · {etiqueta}
    </div>
  )
}

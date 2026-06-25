import { Fragment } from 'react'
import type { Tramite } from '@/shared/domain/entities'
import { calcularWorkflow, type EtapaEstado } from '@/shared/domain/workflow'
import { Badge } from './Badge'
import { IconCheck, IconX, IconChevron } from './icons'

const nodo: Record<EtapaEstado, string> = {
  completada: 'bg-emerald-500 text-white',
  actual: 'bg-gov-600 text-white ring-4 ring-gov-100',
  pendiente: 'bg-slate-200 text-slate-500',
  rechazada: 'bg-rose-500 text-white',
}

const texto: Record<EtapaEstado, string> = {
  completada: 'text-slate-700',
  actual: 'font-semibold text-gov-700',
  pendiente: 'text-slate-400',
  rechazada: 'font-semibold text-rose-600',
}

/** Stepper con flechas que muestra en qué etapa del proceso está el trámite. */
export function WorkflowSteps({ tramite }: { tramite: Tramite }) {
  const { etapas, resumen, estadoGlobal } = calcularWorkflow(tramite)

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Estado del proceso
        </p>
        <Badge
          tone={
            estadoGlobal === 'autorizado' ? 'green' : estadoGlobal === 'rechazado' ? 'red' : 'amber'
          }
        >
          {resumen}
        </Badge>
      </div>

      <ol className="flex items-center gap-1 overflow-x-auto pb-1">
        {etapas.map((e, i) => (
          <Fragment key={e.clave}>
            <li className="flex shrink-0 items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${nodo[e.estado]}`}
              >
                {e.estado === 'completada' ? (
                  <IconCheck />
                ) : e.estado === 'rechazada' ? (
                  <IconX />
                ) : (
                  i + 1
                )}
              </span>
              <span className={`whitespace-nowrap text-xs ${texto[e.estado]}`}>{e.titulo}</span>
            </li>
            {i < etapas.length - 1 && <IconChevron className="shrink-0 text-slate-300" />}
          </Fragment>
        ))}
      </ol>
    </div>
  )
}

/** Versión compacta: solo un badge con el resumen de la etapa. */
export function WorkflowBadge({ tramite }: { tramite: Tramite }) {
  const { resumen, estadoGlobal } = calcularWorkflow(tramite)
  return (
    <Badge
      tone={estadoGlobal === 'autorizado' ? 'green' : estadoGlobal === 'rechazado' ? 'red' : 'amber'}
    >
      {resumen}
    </Badge>
  )
}

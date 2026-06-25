import type { ReactNode } from 'react'
import type { Tramite } from '@/shared/domain/entities'
import { StatusBadge, RiskBadge, Badge } from './Badge'
import { WorkflowBadge } from './WorkflowSteps'
import { IconCar, IconLeaf, IconPaw } from './icons'
import { formatDate } from '@/shared/lib/format'

/** Tarjeta de resumen de un trámite para los paneles de funcionarios. */
export function TramiteSummary({ tramite, actions }: { tramite: Tramite; actions?: ReactNode }) {
  const t = tramite
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-slate-400">{t.id}</p>
          <p className="mt-0.5 font-semibold text-slate-900">{t.viajero.nombre}</p>
          <p className="text-xs text-slate-500">{t.viajero.documento}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge estado={t.estadoValidacion} />
          <WorkflowBadge tramite={t} />
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600">
        <div>
          <dt className="text-xs text-slate-400">Destino</dt>
          <dd>{t.documentacion.destino}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Fecha de viaje</dt>
          <dd>{formatDate(t.documentacion.fechaViaje)}</dd>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap gap-2">
        {t.vehiculo && (
          <Badge tone="blue">
            <IconCar />{' '}
            {t.vehiculo.tipo === 'diplomatico' ? `Diplomático ${t.vehiculo.tipoPlaca}` : 'Particular'}
          </Badge>
        )}
        {t.declaracionSag && (
          <span className="flex items-center gap-1">
            <Badge tone="teal">
              <IconLeaf /> SAG
            </Badge>
            <RiskBadge nivel={t.declaracionSag.nivelRiesgo} />
          </span>
        )}
        {t.declaracionMascota && (
          <Badge tone="teal">
            <IconPaw /> {t.declaracionMascota.tipoAnimal}
          </Badge>
        )}
        {!t.vehiculo && !t.declaracionSag && !t.declaracionMascota && (
          <span className="text-xs text-slate-400">Solo documentación básica</span>
        )}
      </div>

      {actions && <div className="mt-4 flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

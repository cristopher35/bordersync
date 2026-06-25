import { useParams, Link } from 'react-router-dom'
import { useData } from '@/shared/infrastructure/store'
import { StatusBadge, Badge, RiskBadge } from '@/shared/ui/Badge'
import { WorkflowSteps } from '@/shared/ui/WorkflowSteps'
import { IconCar, IconLeaf, IconPaw } from '@/shared/ui/icons'
import { formatDate, formatDateTime } from '@/shared/lib/format'
import { WaitEstimate } from './components/WaitEstimate'

/**
 * Página PÚBLICA de consulta de estado (HU07). Es el destino del QR del pase:
 * cualquiera con el enlace puede ver el estado del trámite sin iniciar sesión.
 */
export function PublicStatusPage() {
  const { id } = useParams()
  const data = useData()
  const tramite = data.tramites.find((t) => t.id.toUpperCase() === (id ?? '').toUpperCase())

  return (
    <main className="min-h-full bg-slate-50">
      <header className="bg-gov-800 text-white">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 font-bold">
            B
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">BorderSync</p>
            <p className="text-[11px] text-gov-200">Consulta de estado de trámite</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-10">
        {!tramite ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-sm text-slate-500">
              No existe un trámite con el identificador <span className="font-mono">{id}</span>.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <WorkflowSteps tramite={tramite} />
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xs text-slate-400">{tramite.id}</p>
                <p className="mt-0.5 text-lg font-bold text-slate-900">
                  {tramite.documentacion.destino}
                </p>
                <p className="text-sm text-slate-500">{tramite.viajero.nombre}</p>
              </div>
              <StatusBadge estado={tramite.estadoValidacion} />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-slate-400">Fecha de viaje</dt>
                <dd className="text-slate-800">{formatDate(tramite.documentacion.fechaViaje)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Última actualización</dt>
                <dd className="text-slate-800">{formatDateTime(tramite.updatedAt)}</dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              {tramite.vehiculo && (
                <Badge tone="blue">
                  <IconCar /> Vehículo
                </Badge>
              )}
              {tramite.declaracionSag && (
                <span className="flex items-center gap-1">
                  <Badge tone="teal">
                    <IconLeaf /> SAG
                  </Badge>
                  <RiskBadge nivel={tramite.declaracionSag.nivelRiesgo} />
                </span>
              )}
              {tramite.declaracionMascota && (
                <Badge tone="teal">
                  <IconPaw /> Mascota
                </Badge>
              )}
            </div>

            <div className="mt-4">
              <WaitEstimate tramite={tramite} />
            </div>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-slate-400">
          <Link to="/login" className="font-medium text-gov-700 hover:underline">
            Ingresar a BorderSync
          </Link>
        </p>
      </div>
    </main>
  )
}

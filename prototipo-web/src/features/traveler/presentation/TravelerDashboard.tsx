import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/shared/ui/AppShell'
import { Button } from '@/shared/ui/Button'
import { StatusBadge } from '@/shared/ui/Badge'
import { IconPlus, IconCalendar, IconCar, IconLeaf, IconPaw } from '@/shared/ui/icons'
import { WorkflowBadge } from '@/shared/ui/WorkflowSteps'
import { formatDate } from '@/shared/lib/format'
import { useMyTramites } from '../application/useMyTramites'
import { WaitEstimate } from './components/WaitEstimate'

export function TravelerDashboard() {
  const tramites = useMyTramites()
  const navigate = useNavigate()

  return (
    <>
      <PageHeader
        title="Mis trámites"
        description="Precarga tu cruce fronterizo y sigue su estado de validación."
        actions={
          <Button onClick={() => navigate('/viajero/nuevo')}>
            <IconPlus /> Nuevo trámite
          </Button>
        }
      />

      {tramites.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">Aún no tienes trámites.</p>
          <Link
            to="/viajero/nuevo"
            className="mt-3 inline-block font-semibold text-gov-700 hover:underline"
          >
            Crear mi primer trámite →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {tramites.map((t) => (
            <Link
              key={t.id}
              to={`/viajero/tramite/${t.id}`}
              className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-gov-300 hover:shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-xs text-slate-400">{t.id}</p>
                  <p className="mt-0.5 font-semibold text-slate-900">{t.documentacion.destino}</p>
                </div>
                <StatusBadge estado={t.estadoValidacion} />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <IconCalendar /> {formatDate(t.documentacion.fechaViaje)}
                </span>
                {t.vehiculo && (
                  <span className="inline-flex items-center gap-1">
                    <IconCar /> Vehículo
                  </span>
                )}
                {t.declaracionSag && (
                  <span className="inline-flex items-center gap-1">
                    <IconLeaf /> SAG
                  </span>
                )}
                {t.declaracionMascota && (
                  <span className="inline-flex items-center gap-1">
                    <IconPaw /> Mascota
                  </span>
                )}
              </div>
              <div>
                <WorkflowBadge tramite={t} />
              </div>
              <WaitEstimate tramite={t} />
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

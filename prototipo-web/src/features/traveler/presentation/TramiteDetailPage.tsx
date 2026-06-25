import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Badge, RiskBadge } from '@/shared/ui/Badge'
import { IconPlus, IconWarning, IconTrash } from '@/shared/ui/icons'
import { WorkflowSteps } from '@/shared/ui/WorkflowSteps'
import { CATEGORIA_LABEL } from '../domain/sagPolicy'
import { formatDate, formatDateTime } from '@/shared/lib/format'
import { useSession } from '@/shared/session/SessionProvider'
import type { ActorRef } from '@/shared/domain/entities'
import { useTramite } from '../application/useMyTramites'
import { removeComponente, type ComponenteTramite } from '../application/tramitesService'
import { CrossingPass } from './components/CrossingPass'
import { VehiculoForm } from './components/VehiculoForm'
import { SagForm } from './components/SagForm'
import { MascotaForm } from './components/MascotaForm'

type OpenForm = 'vehiculo' | 'sag' | 'mascota' | null

export function TramiteDetailPage() {
  const { id } = useParams()
  const tramite = useTramite(id)
  const { user } = useSession()
  const [open, setOpen] = useState<OpenForm>(null)

  if (!tramite) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-sm text-slate-500">No se encontró el trámite {id}.</p>
        <Link to="/viajero" className="mt-3 inline-block font-semibold text-gov-700 hover:underline">
          ← Volver a mis trámites
        </Link>
      </div>
    )
  }

  const actor: ActorRef = user ?? { id: '', nombre: 'Viajero', rol: 'viajero' }

  return (
    <>
      <Link to="/viajero" className="text-sm text-gov-700 hover:underline">
        ← Mis trámites
      </Link>

      <div className="mt-3">
        <WorkflowSteps tramite={tramite} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-6">
          {/* Documentación */}
          <Card title="Documentación de viaje" description="RF03">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Field label="Destino" value={tramite.documentacion.destino} />
              <Field label="Fecha de viaje" value={formatDate(tramite.documentacion.fechaViaje)} />
              <Field label="Viajero" value={tramite.viajero.nombre} />
              <Field label="Documento" value={tramite.viajero.documento} />
              <Field label="Motivo" value={tramite.documentacion.motivo || '—'} />
            </dl>
          </Card>

          {/* Vehículo */}
          <Card
            title="Vehículo"
            description="RF04 · particular (180 días) o diplomático (90 días)"
          >
            {tramite.vehiculo ? (
              <div className="flex flex-col gap-3">
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <Field label="Tipo" value={tramite.vehiculo.tipo} />
                  <Field label="Patente" value={tramite.vehiculo.patente} />
                  <Field label="Modelo" value={tramite.vehiculo.modelo} />
                  <Field label="Propietario" value={tramite.vehiculo.propietario} />
                  <div className="col-span-2 rounded-lg bg-gov-50 px-3 py-2">
                    <p className="text-xs text-gov-700">{tramite.vehiculo.documentoGenerado}</p>
                    <p className="text-xs text-slate-500">
                      Vigencia {tramite.vehiculo.vigenciaDias} días · vence{' '}
                      {formatDate(tramite.vehiculo.vencimiento)}
                    </p>
                  </div>
                </dl>
                <RemoveAction
                  tramiteId={tramite.id}
                  componente="vehiculo"
                  actor={actor}
                  label="el vehículo"
                />
              </div>
            ) : open === 'vehiculo' ? (
              <VehiculoForm tramiteId={tramite.id} actor={actor} onDone={() => setOpen(null)} />
            ) : (
              <Button variant="ghost" onClick={() => setOpen('vehiculo')}>
                <IconPlus /> Registrar vehículo
              </Button>
            )}
          </Card>

          {/* Declaración SAG */}
          <Card title="Declaración SAG" description="RF05 · productos de origen animal o vegetal">
            {tramite.declaracionSag ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <RiskBadge nivel={tramite.declaracionSag.nivelRiesgo} />
                  {tramite.declaracionSag.advertencia && (
                    <span className="inline-flex items-center gap-1 text-sm text-amber-600">
                      <IconWarning /> Con advertencia sanitaria
                    </span>
                  )}
                </div>
                <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                  {tramite.declaracionSag.productos.map((p, i) => (
                    <li key={i} className="flex items-center justify-between px-3 py-2 text-sm">
                      <span>
                        {p.cantidad}× {p.nombre}
                      </span>
                      <Badge
                        tone={
                          p.categoria === 'prohibido'
                            ? 'red'
                            : p.categoria === 'restringido'
                              ? 'amber'
                              : 'green'
                        }
                      >
                        {CATEGORIA_LABEL[p.categoria]}
                      </Badge>
                    </li>
                  ))}
                </ul>
                <RemoveAction
                  tramiteId={tramite.id}
                  componente="declaracionSag"
                  actor={actor}
                  label="la declaración SAG"
                />
              </div>
            ) : open === 'sag' ? (
              <SagForm tramiteId={tramite.id} actor={actor} onDone={() => setOpen(null)} />
            ) : (
              <Button variant="ghost" onClick={() => setOpen('sag')}>
                <IconPlus /> Declarar productos
              </Button>
            )}
          </Card>

          {/* Declaración mascota */}
          <Card title="Declaración de mascota" description="RF09">
            {tramite.declaracionMascota ? (
              <div className="flex flex-col gap-3">
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <Field label="Animal" value={tramite.declaracionMascota.tipoAnimal} />
                  <Field label="Cantidad" value={String(tramite.declaracionMascota.cantidad)} />
                  {tramite.declaracionMascota.representanteLegal && (
                    <Field
                      label="Representante legal"
                      value={tramite.declaracionMascota.representanteLegal}
                    />
                  )}
                  <div className="col-span-2">
                    <RiskBadge nivel={tramite.declaracionMascota.nivelRiesgo} />
                  </div>
                </dl>
                <RemoveAction
                  tramiteId={tramite.id}
                  componente="declaracionMascota"
                  actor={actor}
                  label="la declaración de mascota"
                />
              </div>
            ) : open === 'mascota' ? (
              <MascotaForm tramiteId={tramite.id} actor={actor} onDone={() => setOpen(null)} />
            ) : (
              <Button variant="ghost" onClick={() => setOpen('mascota')}>
                <IconPlus /> Declarar mascota
              </Button>
            )}
          </Card>
        </div>

        {/* Columna lateral */}
        <div className="flex flex-col gap-6">
          <CrossingPass tramite={tramite} />

          <Card title="Historial del trámite">
            <ol className="flex flex-col gap-3">
              {tramite.historial.map((h, i) => (
                <li key={i} className="border-l-2 border-gov-200 pl-3">
                  <p className="text-sm text-slate-700">{h.accion}</p>
                  {h.resultado && <p className="text-xs text-slate-500">{h.resultado}</p>}
                  <p className="text-xs text-slate-400">
                    {h.actor} · {formatDateTime(h.fecha)}
                  </p>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="text-slate-800 capitalize">{value}</dd>
    </div>
  )
}

/** Botón para eliminar (y rehacer) un componente del trámite, con confirmación. */
function RemoveAction({
  tramiteId,
  componente,
  actor,
  label,
}: {
  tramiteId: string
  componente: ComponenteTramite
  actor: ActorRef
  label: string
}) {
  function handleRemove() {
    if (window.confirm(`¿Eliminar ${label}? Podrás volver a registrarlo.`)) {
      removeComponente(tramiteId, componente, actor)
    }
  }
  return (
    <div className="flex justify-end border-t border-slate-100 pt-3">
      <button
        type="button"
        onClick={handleRemove}
        className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 hover:underline"
      >
        <IconTrash /> Eliminar y corregir
      </button>
    </div>
  )
}

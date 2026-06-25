import type { Tramite, CategoriaProducto, EstadoRevision } from '@/shared/domain/entities'
import { Badge, RiskBadge } from '@/shared/ui/Badge'
import { WorkflowSteps } from '@/shared/ui/WorkflowSteps'
import {
  IconDocument,
  IconCar,
  IconLeaf,
  IconPaw,
  IconPassport,
  IconHistory,
  IconWarning,
  IconCheck,
  IconX,
} from '@/shared/ui/icons'
import { formatDate, formatDateTime } from '@/shared/lib/format'

const CAT_LABEL: Record<CategoriaProducto, string> = {
  permitido: 'Permitido',
  restringido: 'Restringido',
  prohibido: 'Prohibido',
}
const catTone = (c: CategoriaProducto) =>
  c === 'prohibido' ? 'red' : c === 'restringido' ? 'amber' : 'green'

/**
 * Vista de SOLO LECTURA del documento completo de un trámite, para que el
 * funcionario revise todo lo declarado (y su historial) antes de decidir.
 */
export function TramiteDocument({ tramite: t }: { tramite: Tramite }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <WorkflowSteps tramite={t} />

      <Section title={<><IconDocument /> Documentación de viaje</>}>
        <Grid>
          <Field label="Viajero" value={t.viajero.nombre} />
          <Field label="Documento" value={t.viajero.documento} />
          <Field label="Nacionalidad" value={t.viajero.nacionalidad} />
          <Field label="Destino" value={t.documentacion.destino} />
          <Field label="Fecha de viaje" value={formatDate(t.documentacion.fechaViaje)} />
          <Field label="Motivo" value={t.documentacion.motivo || '—'} />
        </Grid>
      </Section>

      <Section title={<><IconCar /> Vehículo</>}>
        {t.vehiculo ? (
          <Grid>
            <Field label="Tipo" value={t.vehiculo.tipo} />
            <Field label="Patente" value={t.vehiculo.patente} />
            <Field label="Modelo" value={t.vehiculo.modelo} />
            <Field label="Propietario" value={t.vehiculo.propietario} />
            {t.vehiculo.tipoPlaca && <Field label="Placa diplomática" value={t.vehiculo.tipoPlaca} />}
            <Field label="Documento" value={t.vehiculo.documentoGenerado} />
            <Field
              label="Vigencia"
              value={`${t.vehiculo.vigenciaDias} días · vence ${formatDate(t.vehiculo.vencimiento)}`}
            />
          </Grid>
        ) : (
          <Empty />
        )}
      </Section>

      <Section title={<><IconLeaf /> Declaración SAG</>}>
        {t.declaracionSag ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <RiskBadge nivel={t.declaracionSag.nivelRiesgo} />
              {t.declaracionSag.advertencia && (
                <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                  <IconWarning /> Con advertencia sanitaria
                </span>
              )}
            </div>
            <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
              {t.declaracionSag.productos.map((p, i) => (
                <li key={i} className="flex items-center justify-between px-3 py-2 text-sm">
                  <span>
                    {p.cantidad}× {p.nombre}
                  </span>
                  <Badge tone={catTone(p.categoria)}>{CAT_LABEL[p.categoria]}</Badge>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <Empty />
        )}
      </Section>

      <Section title={<><IconPaw /> Declaración de mascota</>}>
        {t.declaracionMascota ? (
          <Grid>
            <Field label="Animal" value={t.declaracionMascota.tipoAnimal} />
            <Field label="Cantidad" value={String(t.declaracionMascota.cantidad)} />
            {t.declaracionMascota.representanteLegal && (
              <Field label="Representante legal" value={t.declaracionMascota.representanteLegal} />
            )}
          </Grid>
        ) : (
          <Empty />
        )}
      </Section>

      <Section title={<><IconPassport /> Controles SAG / PDI</>}>
        <div className="flex flex-col gap-2 text-sm">
          {t.declaracionSag && (
            <ControlRow
              label="SAG · productos"
              estado={t.declaracionSag.estadoRevision}
              motivo={t.declaracionSag.motivoRechazo}
            />
          )}
          {t.declaracionMascota && (
            <ControlRow
              label="SAG · mascota"
              estado={t.declaracionMascota.estadoRevision}
              motivo={t.declaracionMascota.motivoRechazo}
            />
          )}
          <ControlRow
            label="PDI · migratorio"
            estado={
              t.controlMigratorio.estado === 'pendiente'
                ? 'pendiente'
                : t.controlMigratorio.estado === 'aprobado'
                  ? 'aprobada'
                  : 'rechazada'
            }
            motivo={t.controlMigratorio.motivo ?? undefined}
          />
        </div>
      </Section>

      <Section title={<><IconHistory /> Historial</>}>
        <ol className="flex flex-col gap-2">
          {t.historial.map((h, i) => (
            <li key={i} className="border-l-2 border-gov-200 pl-3">
              <p className="text-sm text-slate-700">{h.accion}</p>
              {h.resultado && <p className="text-xs text-slate-500">{h.resultado}</p>}
              <p className="text-xs text-slate-400">
                {h.actor} · {formatDateTime(h.fecha)}
              </p>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>
      {children}
    </div>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return <dl className="grid grid-cols-2 gap-3 text-sm">{children}</dl>
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="text-slate-800">{value}</dd>
    </div>
  )
}

function Empty() {
  return <p className="text-sm text-slate-400">No declarado.</p>
}

function ControlRow({
  label,
  estado,
  motivo,
}: {
  label: string
  estado: EstadoRevision
  motivo?: string
}) {
  const tone = estado === 'rechazada' ? 'red' : estado === 'aprobada' ? 'green' : 'gray'
  const content =
    estado === 'rechazada' ? (
      <>
        <IconX /> Rechazada
      </>
    ) : estado === 'aprobada' ? (
      <>
        <IconCheck /> Aprobada
      </>
    ) : (
      'Pendiente'
    )
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
      <span className="text-slate-600">{label}</span>
      <div className="flex items-center gap-2">
        {motivo && <span className="text-xs text-rose-600">{motivo}</span>}
        <Badge tone={tone}>{content}</Badge>
      </div>
    </div>
  )
}

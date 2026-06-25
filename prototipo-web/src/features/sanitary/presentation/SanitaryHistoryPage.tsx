import { PageHeader } from '@/shared/ui/AppShell'
import { Card } from '@/shared/ui/Card'
import { Badge, RiskBadge } from '@/shared/ui/Badge'
import { IconCheck, IconX, IconLeaf, IconPaw } from '@/shared/ui/icons'
import { CATEGORIA_LABEL } from '@/features/traveler/domain/sagPolicy'
import { formatDateTime } from '@/shared/lib/format'
import type { Tramite, EstadoRevision } from '@/shared/domain/entities'
import { useRevisadas, type TipoDeclaracion } from '../application/sanitaryQueries'

/** Última marca (aprobación o rechazo) registrada para una declaración. */
function marca(tramite: Tramite, tipo: TipoDeclaracion) {
  const target = tipo === 'sag' ? 'declaración SAG' : 'declaración de mascota'
  return (
    [...tramite.historial]
      .reverse()
      .find(
        (h) =>
          (h.accion.startsWith('Aprobó') || h.accion.startsWith('Rechazó')) &&
          h.accion.includes(target),
      ) ?? null
  )
}

function EstadoBadge({ estado }: { estado: EstadoRevision }) {
  if (estado === 'rechazada')
    return (
      <Badge tone="red">
        <IconX /> Rechazada
      </Badge>
    )
  return (
    <Badge tone="green">
      <IconCheck /> Aprobada
    </Badge>
  )
}

export function SanitaryHistoryPage() {
  const items = useRevisadas()

  return (
    <>
      <PageHeader
        title="Declaraciones revisadas"
        description="Histórico de tus aprobaciones y rechazos de declaraciones SAG y mascotas."
        badge={`${items.length} revisadas`}
      />

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          Aún no hay declaraciones revisadas.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => {
            const t = item.tramite
            const m = marca(t, item.tipo)
            const decl = item.tipo === 'sag' ? t.declaracionSag : t.declaracionMascota
            return (
              <Card key={`${t.id}-${item.tipo}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs text-slate-400">{t.id}</p>
                    <p className="font-semibold text-slate-900">{t.viajero.nombre}</p>
                    <p className="text-xs text-slate-500">{t.viajero.documento}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {decl && <EstadoBadge estado={decl.estadoRevision} />}
                    <RiskBadge nivel={item.nivelRiesgo} />
                  </div>
                </div>

                {item.tipo === 'sag' && t.declaracionSag && (
                  <div className="mt-3">
                    <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                      <IconLeaf /> Declaración SAG
                    </p>
                    <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                      {t.declaracionSag.productos.map((p, i) => (
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
                  </div>
                )}

                {item.tipo === 'mascota' && t.declaracionMascota && (
                  <div className="mt-3">
                    <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                      <IconPaw /> Declaración de mascota
                    </p>
                    <p className="text-sm text-slate-600">
                      {t.declaracionMascota.cantidad}× {t.declaracionMascota.tipoAnimal}
                    </p>
                  </div>
                )}

                {decl?.estadoRevision === 'rechazada' && decl.motivoRechazo && (
                  <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
                    Motivo del rechazo: {decl.motivoRechazo}
                  </p>
                )}

                <p className="mt-3 border-t border-slate-100 pt-2 text-xs text-slate-400">
                  {m ? `${m.actor} · ${formatDateTime(m.fecha)}` : 'Revisada'}
                </p>
              </Card>
            )
          })}
        </div>
      )}
    </>
  )
}

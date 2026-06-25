import { useState } from 'react'
import { PageHeader } from '@/shared/ui/AppShell'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { TextField } from '@/shared/ui/TextField'
import { Badge, RiskBadge } from '@/shared/ui/Badge'
import { IconCheck, IconLeaf, IconPaw } from '@/shared/ui/icons'
import { CATEGORIA_LABEL } from '@/features/traveler/domain/sagPolicy'
import type { ActorRef } from '@/shared/domain/entities'
import { useSession } from '@/shared/session/SessionProvider'
import { usePendientesRevision, type ItemRevision } from '../application/sanitaryQueries'
import {
  aprobarSag,
  rechazarSag,
  aprobarMascota,
  rechazarMascota,
} from '../application/sanitaryService'

export function ReviewPage() {
  const items = usePendientesRevision()
  const { user } = useSession()
  const actor: ActorRef = user ?? { id: '', nombre: 'Funcionario SAG', rol: 'sag' }

  const [rejectingKey, setRejectingKey] = useState<string | null>(null)
  const [motivo, setMotivo] = useState('')

  function aprobar(item: ItemRevision) {
    if (item.tipo === 'sag') aprobarSag(item.tramite.id, actor)
    else aprobarMascota(item.tramite.id, actor)
  }

  function confirmarRechazo(item: ItemRevision) {
    if (item.tipo === 'sag') rechazarSag(item.tramite.id, actor, motivo)
    else rechazarMascota(item.tramite.id, actor, motivo)
    setRejectingKey(null)
    setMotivo('')
  }

  return (
    <>
      <PageHeader
        title="Revisión de declaraciones"
        description="HU11 · Control sanitario SAG: aprueba o rechaza declaraciones de productos y mascotas, priorizadas por riesgo."
        badge={`${items.length} pendientes`}
      />

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          No hay declaraciones pendientes de revisión.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => {
            const t = item.tramite
            const key = `${t.id}-${item.tipo}`
            return (
              <Card key={key}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs text-slate-400">{t.id}</p>
                    <p className="font-semibold text-slate-900">{t.viajero.nombre}</p>
                    <p className="text-xs text-slate-500">{t.viajero.documento}</p>
                  </div>
                  <RiskBadge nivel={item.nivelRiesgo} />
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
                    {t.declaracionMascota.representanteLegal && (
                      <p className="text-xs text-slate-500">
                        Representante legal: {t.declaracionMascota.representanteLegal}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-4">
                  {rejectingKey === key ? (
                    <div className="flex flex-col gap-2">
                      <TextField
                        label="Motivo del rechazo"
                        name={`motivo-${key}`}
                        placeholder="Producto prohibido, requisito sanitario incumplido…"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        hint="Obligatorio para dejar trazabilidad."
                        required
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="danger"
                          onClick={() => confirmarRechazo(item)}
                          disabled={motivo.trim().length < 3}
                        >
                          Confirmar rechazo
                        </Button>
                        <Button variant="ghost" onClick={() => setRejectingKey(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <Button variant="success" onClick={() => aprobar(item)}>
                        <IconCheck /> Aprobar
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setMotivo('')
                          setRejectingKey(key)
                        }}
                      >
                        Rechazar
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </>
  )
}

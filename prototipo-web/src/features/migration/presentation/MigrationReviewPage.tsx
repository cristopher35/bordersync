import { useState } from 'react'
import { PageHeader } from '@/shared/ui/AppShell'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { TextField } from '@/shared/ui/TextField'
import { formatDate } from '@/shared/lib/format'
import { IconCheck } from '@/shared/ui/icons'
import type { ActorRef } from '@/shared/domain/entities'
import { useSession } from '@/shared/session/SessionProvider'
import { usePendientesMigratorio } from '../application/migrationQueries'
import { aprobarMigratorio, rechazarMigratorio } from '../application/migrationService'

export function MigrationReviewPage() {
  const cola = usePendientesMigratorio()
  const { user } = useSession()
  const actor: ActorRef = user ?? { id: '', nombre: 'Funcionario PDI', rol: 'pdi' }

  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [motivo, setMotivo] = useState('')

  function confirmarRechazo(id: string) {
    rechazarMigratorio(id, actor, motivo)
    setRejectingId(null)
    setMotivo('')
  }

  return (
    <>
      <PageHeader
        title="Control migratorio"
        description="Control de personas (PDI): valida la identidad y el movimiento migratorio de cada viajero."
        badge={`${cola.length} pendientes`}
      />

      {cola.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          No hay controles migratorios pendientes.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {cola.map((t) => (
            <Card key={t.id}>
              <p className="font-mono text-xs text-slate-400">{t.id}</p>
              <dl className="mt-1 grid grid-cols-2 gap-3 text-sm">
                <Field label="Viajero" value={t.viajero.nombre} />
                <Field label="Documento" value={t.viajero.documento} />
                <Field label="Nacionalidad" value={t.viajero.nacionalidad} />
                <Field label="Destino" value={t.documentacion.destino} />
                <Field label="Fecha de viaje" value={formatDate(t.documentacion.fechaViaje)} />
                <Field label="Motivo" value={t.documentacion.motivo || '—'} />
              </dl>

              <div className="mt-4">
                {rejectingId === t.id ? (
                  <div className="flex flex-col gap-2">
                    <TextField
                      label="Motivo del rechazo"
                      name={`motivo-${t.id}`}
                      placeholder="Identidad no verificable, alerta migratoria…"
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      hint="Obligatorio para dejar trazabilidad."
                      required
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="danger"
                        onClick={() => confirmarRechazo(t.id)}
                        disabled={motivo.trim().length < 3}
                      >
                        Confirmar rechazo
                      </Button>
                      <Button variant="ghost" onClick={() => setRejectingId(null)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end gap-2">
                    <Button variant="success" onClick={() => aprobarMigratorio(t.id, actor)}>
                      <IconCheck /> Aprobar ingreso
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setMotivo('')
                        setRejectingId(t.id)
                      }}
                    >
                      Rechazar
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="text-slate-800">{value}</dd>
    </div>
  )
}

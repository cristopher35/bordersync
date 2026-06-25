import { useState } from 'react'
import { PageHeader } from '@/shared/ui/AppShell'
import { Button } from '@/shared/ui/Button'
import { TextField } from '@/shared/ui/TextField'
import { TramiteSummary } from '@/shared/ui/TramiteSummary'
import { IconCheck, IconEye, IconEyeOff } from '@/shared/ui/icons'
import type { ActorRef } from '@/shared/domain/entities'
import { useSession } from '@/shared/session/SessionProvider'
import { useColaValidacion } from '../application/customsQueries'
import { validarTramite, rechazarTramite } from '../application/customsService'
import { TramiteDocument } from './components/TramiteDocument'

export function ValidationQueuePage() {
  const cola = useColaValidacion()
  const { user } = useSession()
  const actor: ActorRef = user ?? { id: '', nombre: 'Funcionario', rol: 'aduanas' }
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [motivo, setMotivo] = useState('')

  function confirmarRechazo(id: string) {
    rechazarTramite(id, actor, motivo)
    setRejectingId(null)
    setMotivo('')
  }

  return (
    <>
      <PageHeader
        title="Cola de validación"
        description="HU08 · Revisa el documento completo y autoriza o rechaza cada trámite."
        badge={`${cola.length} pendientes`}
      />

      {cola.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          No hay trámites pendientes de validación.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {cola.map((t) => (
            <div key={t.id} className="flex flex-col gap-3">
              <TramiteSummary
                tramite={t}
                actions={
                  rejectingId === t.id ? (
                    <div className="flex w-full flex-col gap-2">
                      <TextField
                        label="Motivo del rechazo"
                        name={`motivo-${t.id}`}
                        placeholder="Documento inconsistente, datos incompletos…"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        hint="Obligatorio para dejar trazabilidad del rechazo."
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
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => setViewingId(viewingId === t.id ? null : t.id)}
                      >
                        {viewingId === t.id ? (
                          <>
                            <IconEyeOff /> Ocultar documento
                          </>
                        ) : (
                          <>
                            <IconEye /> Ver documento
                          </>
                        )}
                      </Button>
                      <Button variant="success" onClick={() => validarTramite(t.id, actor)}>
                        <IconCheck /> Validar
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
                    </>
                  )
                }
              />
              {viewingId === t.id && <TramiteDocument tramite={t} />}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

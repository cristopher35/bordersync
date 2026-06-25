import { useState } from 'react'
import { PageHeader } from '@/shared/ui/AppShell'
import { Button } from '@/shared/ui/Button'
import { TramiteSummary } from '@/shared/ui/TramiteSummary'
import { IconEye, IconEyeOff } from '@/shared/ui/icons'
import { useProcesados } from '../application/customsQueries'
import { TramiteDocument } from './components/TramiteDocument'

export function CustomsHistoryPage() {
  const procesados = useProcesados()
  const [viewingId, setViewingId] = useState<string | null>(null)

  return (
    <>
      <PageHeader
        title="Trámites procesados"
        description="Histórico de trámites que ya fueron validados o rechazados."
        badge={`${procesados.length} procesados`}
      />

      {procesados.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          Aún no se ha procesado ningún trámite.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {procesados.map((t) => (
            <div key={t.id} className="flex flex-col gap-3">
              <TramiteSummary
                tramite={t}
                actions={
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
                        <IconEye /> Ver documento e historial
                      </>
                    )}
                  </Button>
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

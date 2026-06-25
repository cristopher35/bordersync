import { useState } from 'react'
import { PageHeader } from '@/shared/ui/AppShell'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { TextField } from '@/shared/ui/TextField'
import { TramiteSummary } from '@/shared/ui/TramiteSummary'
import { IconHistory, IconEye, IconEyeOff } from '@/shared/ui/icons'
import type { Tramite } from '@/shared/domain/entities'
import { useFiscalizacion, useActividadReciente } from '../application/customsQueries'
import { TramiteDocument } from './components/TramiteDocument'

export function FiscalizacionPage() {
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [viewingId, setViewingId] = useState<string | null>(null)

  const resultados = useFiscalizacion(submitted)
  const recientes = useActividadReciente()

  function toggle(id: string) {
    setViewingId((cur) => (cur === id ? null : id))
  }

  function buscar() {
    setSubmitted(query)
    setViewingId(null)
  }

  const lista = submitted ? resultados : recientes

  return (
    <>
      <PageHeader
        title="Fiscalización de operaciones"
        description="HU09 · Busca por nombre, RUN o N° de trámite, o revisa la actividad reciente."
      />

      <Card className="mb-6 max-w-2xl">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <TextField
              label="Buscar operación"
              name="query"
              placeholder="Nombre, RUN o TRM-2026-0001"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buscar()}
            />
          </div>
          <Button onClick={buscar}>Buscar</Button>
          {submitted && (
            <Button
              variant="ghost"
              onClick={() => {
                setQuery('')
                setSubmitted('')
              }}
            >
              Limpiar
            </Button>
          )}
        </div>
      </Card>

      <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
        {submitted ? (
          `Resultados para “${submitted}”`
        ) : (
          <>
            <IconHistory /> Actividad reciente (validados / rechazados)
          </>
        )}
      </h2>

      {lista.length === 0 ? (
        <p className="text-sm text-slate-500">
          {submitted ? 'Sin resultados.' : 'Aún no hay trámites procesados.'}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {lista.map((t: Tramite) => (
            <div key={t.id} className="flex flex-col gap-3">
              <TramiteSummary
                tramite={t}
                actions={
                  <Button variant="ghost" onClick={() => toggle(t.id)}>
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

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/shared/ui/AppShell'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { TextField } from '@/shared/ui/TextField'
import { StatusBadge } from '@/shared/ui/Badge'
import { formatDate } from '@/shared/lib/format'
import { useData } from '@/shared/infrastructure/store'
import type { Tramite } from '@/shared/domain/entities'
import { useMyTramites } from '../application/useMyTramites'

export function ConsultaPage() {
  const data = useData()
  const misTramites = useMyTramites()

  // Búsqueda por código exacto
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<Tramite | null | undefined>(undefined)

  // Búsqueda entre mis trámites por fecha de creación
  const [fecha, setFecha] = useState('')

  function buscar() {
    const id = query.trim().toUpperCase()
    if (!id) return
    setResult(data.tramites.find((t) => t.id.toUpperCase() === id) ?? null)
  }

  const porFecha = useMemo(
    () => (fecha ? misTramites.filter((t) => t.createdAt.slice(0, 10) === fecha) : misTramites),
    [misTramites, fecha],
  )

  return (
    <>
      <PageHeader
        title="Consultar estado de trámite"
        description="RF07 · Busca por código, o encuentra tu trámite por la fecha en que lo creaste."
      />

      {/* Búsqueda por código */}
      <Card className="mb-6 max-w-xl">
        <p className="mb-3 text-sm font-medium text-slate-700">¿Tienes el código?</p>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <TextField
              label="Identificador del trámite"
              name="query"
              placeholder="TRM-2026-0001"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buscar()}
            />
          </div>
          <Button onClick={buscar}>Buscar</Button>
        </div>

        {result === null && (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
            No existe un trámite con ese identificador.
          </p>
        )}
        {result && <TramiteRow tramite={result} />}
      </Card>

      {/* Búsqueda entre mis trámites por fecha */}
      <Card className="max-w-xl">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <p className="text-sm font-medium text-slate-700">
            ¿No tienes el código? Busca entre tus trámites
          </p>
          <div className="flex items-end gap-2">
            <TextField
              label="Creado el"
              name="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            {fecha && (
              <Button variant="ghost" onClick={() => setFecha('')}>
                Limpiar
              </Button>
            )}
          </div>
        </div>

        {porFecha.length === 0 ? (
          <p className="text-sm text-slate-500">
            {fecha ? 'No creaste trámites en esa fecha.' : 'Aún no tienes trámites.'}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {porFecha.map((t) => (
              <TramiteRow key={t.id} tramite={t} />
            ))}
          </div>
        )}
      </Card>
    </>
  )
}

function TramiteRow({ tramite }: { tramite: Tramite }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
      <div>
        <p className="font-mono text-xs text-slate-400">{tramite.id}</p>
        <p className="font-semibold text-slate-800">{tramite.documentacion.destino}</p>
        <p className="text-xs text-slate-500">
          Creado: {formatDate(tramite.createdAt)} · viaje: {formatDate(tramite.documentacion.fechaViaje)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <StatusBadge estado={tramite.estadoValidacion} />
        <Link
          to={`/viajero/tramite/${tramite.id}`}
          className="text-xs font-semibold text-gov-700 hover:underline"
        >
          Ver detalle →
        </Link>
      </div>
    </div>
  )
}

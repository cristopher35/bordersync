import { PageHeader } from '@/shared/ui/AppShell'
import { Card } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { IconCheck, IconX } from '@/shared/ui/icons'
import { formatDate } from '@/shared/lib/format'
import { useProcesadosMigratorio } from '../application/migrationQueries'

export function MigrationHistoryPage() {
  const procesados = useProcesadosMigratorio()

  return (
    <>
      <PageHeader
        title="Controles migratorios procesados"
        description="Histórico de tus aprobaciones y rechazos de control migratorio."
        badge={`${procesados.length} procesados`}
      />

      {procesados.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          Aún no has procesado controles migratorios.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {procesados.map((t) => {
            const c = t.controlMigratorio
            return (
              <Card key={t.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs text-slate-400">{t.id}</p>
                    <p className="font-semibold text-slate-900">{t.viajero.nombre}</p>
                    <p className="text-xs text-slate-500">
                      {t.viajero.documento} · {t.viajero.nacionalidad}
                    </p>
                  </div>
                  <Badge tone={c.estado === 'aprobado' ? 'green' : 'red'}>
                    {c.estado === 'aprobado' ? (
                      <>
                        <IconCheck /> Aprobado
                      </>
                    ) : (
                      <>
                        <IconX /> Rechazado
                      </>
                    )}
                  </Badge>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Destino: {t.documentacion.destino} · viaje: {formatDate(t.documentacion.fechaViaje)}
                </p>

                {c.estado === 'rechazado' && c.motivo && (
                  <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
                    Motivo del rechazo: {c.motivo}
                  </p>
                )}

                {c.revisadoPor && (
                  <p className="mt-3 border-t border-slate-100 pt-2 text-xs text-slate-400">
                    Revisado por {c.revisadoPor}
                  </p>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </>
  )
}

import { PageHeader } from '@/shared/ui/AppShell'
import { Card } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { useData } from '@/shared/infrastructure/store'
import type { Integracion } from '@/shared/domain/entities'

const estadoIntegracion: Record<Integracion['estado'], { tone: 'green' | 'amber' | 'red'; label: string }> = {
  operativa: { tone: 'green', label: 'Operativa' },
  degradada: { tone: 'amber', label: 'Degradada' },
  caida: { tone: 'red', label: 'Caída' },
}

export function AdminDashboard() {
  const data = useData()

  return (
    <>
      <PageHeader
        title="Panel del administrador"
        description="HU14 · Estado de las integraciones externas y resumen del sistema."
      />

      <h2 className="mb-3 text-sm font-semibold text-slate-700">Integraciones externas</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {data.integraciones.map((it) => {
          const e = estadoIntegracion[it.estado]
          return (
            <Card key={it.nombre}>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-800">{it.nombre}</p>
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    it.estado === 'operativa'
                      ? 'bg-emerald-500'
                      : it.estado === 'degradada'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                  }`}
                />
              </div>
              <div className="mt-2">
                <Badge tone={e.tone}>{e.label}</Badge>
              </div>
              <p className="mt-2 text-xs text-slate-400">Latencia: {it.latenciaMs} ms</p>
            </Card>
          )
        })}
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold text-slate-700">Resumen</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <p className="text-3xl font-bold text-gov-800">{data.users.length}</p>
          <p className="mt-1 text-sm text-slate-500">Usuarios</p>
        </Card>
        <Card>
          <p className="text-3xl font-bold text-gov-800">
            {data.users.filter((u) => u.estado === 'bloqueado').length}
          </p>
          <p className="mt-1 text-sm text-slate-500">Usuarios bloqueados</p>
        </Card>
        <Card>
          <p className="text-3xl font-bold text-gov-800">{data.tramites.length}</p>
          <p className="mt-1 text-sm text-slate-500">Trámites</p>
        </Card>
        <Card>
          <p className="text-3xl font-bold text-gov-800">
            {data.parametros.filter((p) => p.activo).length}/{data.parametros.length}
          </p>
          <p className="mt-1 text-sm text-slate-500">Parámetros activos</p>
        </Card>
      </div>
    </>
  )
}

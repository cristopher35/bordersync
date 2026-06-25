import { PageHeader } from '@/shared/ui/AppShell'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { DonutChart, BarChart } from '@/shared/ui/Charts'
import { IconPdf, IconExcel } from '@/shared/ui/icons'
import { useData } from '@/shared/infrastructure/store'
import { calcularReporte, construirCsv } from '../domain/reportes'
import { descargarArchivo } from '../application/customsService'

export function ReportesPage() {
  const data = useData()
  const stats = calcularReporte(data.tramites)
  const sinDatos = stats.total === 0

  function exportarExcel() {
    if (sinDatos) return
    descargarArchivo('reporte-bordersync.csv', construirCsv(data.tramites), 'text/csv;charset=utf-8')
  }

  const estados = [
    { label: 'Pendientes', value: stats.pendientes, color: '#f59e0b' },
    { label: 'Aprobados', value: stats.aprobados, color: '#10b981' },
    { label: 'Rechazados', value: stats.rechazados, color: '#f43f5e' },
  ]

  const composicion = [
    { label: 'Vehículos particulares', value: stats.vehiculosParticulares, color: '#1c4493' },
    { label: 'Vehículos diplomáticos', value: stats.vehiculosDiplomaticos, color: '#2a59b0' },
    { label: 'Declaraciones SAG', value: stats.declaracionesSag, color: '#0ea5b7' },
    { label: 'SAG riesgo alto', value: stats.riesgoAlto, color: '#f43f5e' },
    { label: 'Mascotas declaradas', value: stats.mascotas, color: '#7fa1da' },
  ]

  return (
    <>
      <PageHeader
        title="Reportes estadísticos"
        description="RF08 · Flujo de personas y vehículos. Exporta a Excel (CSV) o PDF."
        actions={
          <>
            <Button variant="ghost" onClick={() => window.print()} disabled={sinDatos}>
              <IconPdf /> PDF
            </Button>
            <Button onClick={exportarExcel} disabled={sinDatos}>
              <IconExcel /> Excel
            </Button>
          </>
        }
      />

      {sinDatos ? (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
          No hay datos disponibles para generar el reporte.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Gráficos */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Trámites por estado">
              <DonutChart data={estados} />
            </Card>
            <Card title="Composición de trámites">
              <BarChart data={composicion} />
            </Card>
          </div>

          {/* Métricas numéricas */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Metric value={stats.total} label="Trámites totales" />
            <Metric value={stats.pendientes} label="Pendientes" />
            <Metric value={stats.aprobados} label="Aprobados" />
            <Metric value={stats.rechazados} label="Rechazados" />
            <Metric value={stats.declaracionesSag} label="Declaraciones SAG" />
            <Metric value={stats.mascotas} label="Mascotas declaradas" />
          </div>
        </div>
      )}
    </>
  )
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <Card>
      <p className="text-3xl font-bold text-gov-800">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </Card>
  )
}

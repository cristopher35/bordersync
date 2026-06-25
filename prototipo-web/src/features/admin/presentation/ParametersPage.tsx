import { PageHeader } from '@/shared/ui/AppShell'
import { Card } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { useData } from '@/shared/infrastructure/store'

export function ParametersPage() {
  const data = useData()

  return (
    <>
      <PageHeader
        title="Parámetros del sistema"
        description="HU13 · Estado de los parámetros clave de seguridad y operación (solo lectura)."
      />
      <Card className="p-0">
        <ul className="divide-y divide-slate-100">
          {data.parametros.map((p) => (
            <li key={p.clave} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium text-slate-800">{p.clave}</p>
                <p className="text-sm text-slate-500">{p.descripcion}</p>
              </div>
              <Badge tone={p.activo ? 'green' : 'gray'}>
                {p.activo ? 'Activado' : 'Desactivado'}
              </Badge>
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}

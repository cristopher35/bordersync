import { PageHeader } from '@/shared/ui/AppShell'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Badge } from '@/shared/ui/Badge'
import { ROLE_LABELS, type ActorRef } from '@/shared/domain/entities'
import { useData } from '@/shared/infrastructure/store'
import { useSession } from '@/shared/session/SessionProvider'
import { bloquearUsuario, reactivarUsuario } from '../application/adminService'

export function UsersPage() {
  const data = useData()
  const { user } = useSession()
  const actor: ActorRef = user ?? { id: '', nombre: 'Administrador', rol: 'admin' }

  return (
    <>
      <PageHeader
        title="Usuarios y roles"
        description="HU12 · Control de acceso basado en roles (RBAC). Bloquea o reactiva cuentas."
      />
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">{u.nombre}</p>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">{ROLE_LABELS[u.rol]}</td>
                <td className="px-4 py-3">
                  <Badge tone={u.estado === 'activo' ? 'green' : 'red'}>
                    {u.estado === 'activo' ? 'Activo' : 'Bloqueado'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  {u.id === user?.id ? (
                    <span className="text-xs text-slate-400">Tu cuenta</span>
                  ) : u.estado === 'activo' ? (
                    <Button variant="danger" onClick={() => bloquearUsuario(u.id, u.nombre, actor)}>
                      Bloquear
                    </Button>
                  ) : (
                    <Button variant="success" onClick={() => reactivarUsuario(u.id, u.nombre, actor)}>
                      Reactivar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  )
}

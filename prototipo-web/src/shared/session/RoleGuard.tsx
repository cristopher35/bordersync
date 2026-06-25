import { Navigate } from 'react-router-dom'
import type { Role } from '@/shared/domain/entities'
import { useSession } from './SessionProvider'
import { ROLE_HOME } from './roleHome'

/**
 * Control de acceso basado en roles (RBAC, RNF 3.3.2). Protege un subárbol de
 * rutas: sin sesión redirige al login; con un rol no autorizado, redirige al
 * dashboard propio del usuario.
 */
export function RoleGuard({ allow, children }: { allow: Role; children: React.ReactNode }) {
  const { user } = useSession()

  if (!user) return <Navigate to="/login" replace />
  if (user.rol !== allow) return <Navigate to={ROLE_HOME[user.rol]} replace />

  return <>{children}</>
}

import { AppShell, type NavItem } from '@/shared/ui/AppShell'
import { IconDesktop, IconUsers, IconGear, IconHistory } from '@/shared/ui/icons'

const navItems: NavItem[] = [
  { to: '/admin', label: 'Panel', icon: <IconDesktop />, end: true },
  { to: '/admin/usuarios', label: 'Usuarios y roles', icon: <IconUsers /> },
  { to: '/admin/parametros', label: 'Parámetros', icon: <IconGear /> },
  { to: '/admin/auditoria', label: 'Auditoría', icon: <IconHistory /> },
]

export function AdminLayout() {
  return <AppShell navItems={navItems} />
}

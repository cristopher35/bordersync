import { AppShell, type NavItem } from '@/shared/ui/AppShell'
import { IconClipboard, IconPlus, IconSearch, IconHistory } from '@/shared/ui/icons'

const navItems: NavItem[] = [
  { to: '/viajero', label: 'Mis trámites', icon: <IconClipboard />, end: true },
  { to: '/viajero/nuevo', label: 'Nuevo trámite', icon: <IconPlus /> },
  { to: '/viajero/consulta', label: 'Consultar estado', icon: <IconSearch /> },
  { to: '/viajero/actividad', label: 'Mi actividad', icon: <IconHistory /> },
]

export function TravelerLayout() {
  return <AppShell navItems={navItems} />
}

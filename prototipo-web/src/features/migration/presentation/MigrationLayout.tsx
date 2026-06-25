import { AppShell, type NavItem } from '@/shared/ui/AppShell'
import { IconPassport, IconArchive } from '@/shared/ui/icons'

const navItems: NavItem[] = [
  { to: '/pdi', label: 'Control migratorio', icon: <IconPassport />, end: true },
  { to: '/pdi/historial', label: 'Procesados', icon: <IconArchive /> },
]

export function MigrationLayout() {
  return <AppShell navItems={navItems} />
}

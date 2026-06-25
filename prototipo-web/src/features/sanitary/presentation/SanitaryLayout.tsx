import { AppShell, type NavItem } from '@/shared/ui/AppShell'
import { IconLeaf, IconArchive } from '@/shared/ui/icons'

const navItems: NavItem[] = [
  { to: '/sag', label: 'Revisión de declaraciones', icon: <IconLeaf />, end: true },
  { to: '/sag/historial', label: 'Revisadas', icon: <IconArchive /> },
]

export function SanitaryLayout() {
  return <AppShell navItems={navItems} />
}

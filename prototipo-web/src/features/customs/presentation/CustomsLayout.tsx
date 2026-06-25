import { AppShell, type NavItem } from '@/shared/ui/AppShell'
import { IconCircleCheck, IconSearch, IconChart, IconArchive } from '@/shared/ui/icons'

const navItems: NavItem[] = [
  { to: '/aduanas', label: 'Cola de validación', icon: <IconCircleCheck />, end: true },
  { to: '/aduanas/fiscalizacion', label: 'Fiscalización', icon: <IconSearch /> },
  { to: '/aduanas/reportes', label: 'Reportes', icon: <IconChart /> },
  { to: '/aduanas/historial', label: 'Procesados', icon: <IconArchive /> },
]

export function CustomsLayout() {
  return <AppShell navItems={navItems} />
}

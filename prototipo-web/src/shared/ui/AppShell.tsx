import type { ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useSession } from '@/shared/session/SessionProvider'
import { ROLE_LABELS } from '@/shared/domain/entities'
import { Badge } from './Badge'
import { IconLogout } from './icons'

export interface NavItem {
  to: string
  label: string
  icon: ReactNode
  end?: boolean
}

/**
 * Marco institucional común a todos los roles (RNF25): cabecera con identidad
 * de Aduanas, datos de sesión, navegación por rol y área de contenido.
 */
export function AppShell({ navItems }: { navItems: NavItem[] }) {
  const { user, logout } = useSession()

  return (
    <div className="min-h-full">
      {/* Franja roja institucional (bandera de Chile). */}
      <div className="h-1 bg-accent-500" />
      <header className="bg-gov-800 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500 font-bold">
              B
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">BorderSync</p>
              <p className="text-[11px] text-gov-200">Sistema de Gestión Aduanera Inteligente</p>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">{user.nombre}</p>
                <p className="text-[11px] text-gov-200">{ROLE_LABELS[user.rol]}</p>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/20 transition hover:bg-white/20"
              >
                <IconLogout /> Cerrar sesión
              </button>
            </div>
          )}
        </div>

        <nav className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 sm:px-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'border-white text-white'
                      : 'border-transparent text-gov-200 hover:text-white'
                  }`
                }
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}

/** Encabezado reutilizable de página dentro del shell. */
export function PageHeader({
  title,
  description,
  badge,
  actions,
}: {
  title: string
  description?: string
  badge?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          {badge && <Badge tone="blue">{badge}</Badge>}
        </div>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

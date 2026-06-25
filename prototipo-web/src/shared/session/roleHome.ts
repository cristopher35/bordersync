import type { Role } from '@/shared/domain/entities'

/** Ruta de inicio (dashboard) correspondiente a cada rol tras autenticarse. */
export const ROLE_HOME: Record<Role, string> = {
  viajero: '/viajero',
  aduanas: '/aduanas',
  sag: '/sag',
  pdi: '/pdi',
  admin: '/admin',
}

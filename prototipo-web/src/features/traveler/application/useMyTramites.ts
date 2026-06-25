import { useMemo } from 'react'
import { useData } from '@/shared/infrastructure/store'
import { useSession } from '@/shared/session/SessionProvider'
import type { Tramite } from '@/shared/domain/entities'

/** Trámites del viajero autenticado, más recientes primero. */
export function useMyTramites(): Tramite[] {
  const data = useData()
  const { user } = useSession()
  return useMemo(
    () =>
      data.tramites
        .filter((t) => t.travelerUserId === user?.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [data.tramites, user?.id],
  )
}

/** Un trámite por id (o null). */
export function useTramite(id: string | undefined): Tramite | null {
  const data = useData()
  return useMemo(() => data.tramites.find((t) => t.id === id) ?? null, [data.tramites, id])
}

import { useMemo } from 'react'
import { useData } from '@/shared/infrastructure/store'
import type { ActivityEntry } from '@/shared/domain/entities'

/**
 * Entradas del registro de actividad ordenadas de la más reciente a la más
 * antigua. `filter` permite acotar al historial de un rol o usuario.
 */
export function useActivity(filter?: (e: ActivityEntry) => boolean): ActivityEntry[] {
  const data = useData()
  return useMemo(() => {
    const all = data.actividad ?? []
    const filtered = filter ? all.filter(filter) : all
    return [...filtered].sort((a, b) => b.fecha.localeCompare(a.fecha))
  }, [data.actividad, filter])
}

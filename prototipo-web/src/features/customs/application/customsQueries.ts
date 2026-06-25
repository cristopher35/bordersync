import { useMemo } from 'react'
import { useData } from '@/shared/infrastructure/store'
import type { Tramite } from '@/shared/domain/entities'

/** Cola de validación: trámites pendientes, más antiguos primero (FIFO). */
export function useColaValidacion(): Tramite[] {
  const data = useData()
  return useMemo(
    () =>
      data.tramites
        .filter((t) => t.estadoValidacion === 'pendiente')
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [data.tramites],
  )
}

/**
 * Actividad reciente: trámites ya procesados (aprobados o rechazados), del más
 * reciente al más antiguo. Da al funcionario un punto de partida sin tener que
 * adivinar qué buscar.
 */
export function useActividadReciente(limit = 10): Tramite[] {
  const data = useData()
  return useMemo(
    () =>
      data.tramites
        .filter((t) => t.estadoValidacion !== 'pendiente')
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, limit),
    [data.tramites, limit],
  )
}

/** Histórico completo de trámites procesados (validados o rechazados). */
export function useProcesados(): Tramite[] {
  const data = useData()
  return useMemo(
    () =>
      data.tramites
        .filter((t) => t.estadoValidacion !== 'pendiente')
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [data.tramites],
  )
}

/** Fiscalización: busca trámites por nombre, RUN o ID (HU09). */
export function useFiscalizacion(query: string): Tramite[] {
  const data = useData()
  return useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return data.tramites.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.viajero.nombre.toLowerCase().includes(q) ||
        t.viajero.documento.toLowerCase().includes(q),
    )
  }, [data.tramites, query])
}

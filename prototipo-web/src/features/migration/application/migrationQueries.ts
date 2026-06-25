import { useMemo } from 'react'
import { useData } from '@/shared/infrastructure/store'
import type { Tramite } from '@/shared/domain/entities'

/** Cola de control migratorio: trámites con control pendiente (FIFO). */
export function usePendientesMigratorio(): Tramite[] {
  const data = useData()
  return useMemo(
    () =>
      data.tramites
        .filter((t) => t.controlMigratorio.estado === 'pendiente')
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [data.tramites],
  )
}

/** Histórico de controles migratorios resueltos (aprobados o rechazados). */
export function useProcesadosMigratorio(): Tramite[] {
  const data = useData()
  return useMemo(
    () =>
      data.tramites
        .filter((t) => t.controlMigratorio.estado !== 'pendiente')
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [data.tramites],
  )
}

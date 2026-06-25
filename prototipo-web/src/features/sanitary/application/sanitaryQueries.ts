import { useMemo } from 'react'
import { useData } from '@/shared/infrastructure/store'
import type { Tramite, NivelRiesgo } from '@/shared/domain/entities'

export type TipoDeclaracion = 'sag' | 'mascota'

export interface ItemRevision {
  tramite: Tramite
  tipo: TipoDeclaracion
  nivelRiesgo: NivelRiesgo
}

const ordenRiesgo: Record<NivelRiesgo, number> = { alto: 0, medio: 1, bajo: 2 }

/**
 * Cola de revisión SAG/PDI: declaraciones (SAG y mascotas) aún no revisadas,
 * ordenadas por nivel de riesgo (más alto primero) para priorizar el control.
 */
export function usePendientesRevision(): ItemRevision[] {
  const data = useData()
  return useMemo(() => {
    const items: ItemRevision[] = []
    for (const t of data.tramites) {
      if (t.declaracionSag && t.declaracionSag.estadoRevision === 'pendiente') {
        items.push({ tramite: t, tipo: 'sag', nivelRiesgo: t.declaracionSag.nivelRiesgo })
      }
      if (t.declaracionMascota && t.declaracionMascota.estadoRevision === 'pendiente') {
        items.push({ tramite: t, tipo: 'mascota', nivelRiesgo: t.declaracionMascota.nivelRiesgo })
      }
    }
    return items.sort((a, b) => ordenRiesgo[a.nivelRiesgo] - ordenRiesgo[b.nivelRiesgo])
  }, [data.tramites])
}

/**
 * Histórico de declaraciones ya revisadas (marcas), de la más reciente a la más
 * antigua, para que el funcionario SAG/PDI pueda consultarlas después.
 */
export function useRevisadas(): ItemRevision[] {
  const data = useData()
  return useMemo(() => {
    const items: ItemRevision[] = []
    for (const t of data.tramites) {
      if (t.declaracionSag && t.declaracionSag.estadoRevision !== 'pendiente') {
        items.push({ tramite: t, tipo: 'sag', nivelRiesgo: t.declaracionSag.nivelRiesgo })
      }
      if (t.declaracionMascota && t.declaracionMascota.estadoRevision !== 'pendiente') {
        items.push({ tramite: t, tipo: 'mascota', nivelRiesgo: t.declaracionMascota.nivelRiesgo })
      }
    }
    return items.sort((a, b) => b.tramite.updatedAt.localeCompare(a.tramite.updatedAt))
  }, [data.tramites])
}

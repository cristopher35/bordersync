import type { Tramite } from '@/shared/domain/entities'
import { store } from './store'

/** Operaciones de persistencia sobre la colección de trámites. */
export const tramitesRepository = {
  add(tramite: Tramite) {
    store.update((data) => ({ ...data, tramites: [tramite, ...data.tramites] }))
  },

  /** Aplica una transformación inmutable a un trámite por id. */
  mutate(id: string, updater: (t: Tramite) => Tramite) {
    store.update((data) => ({
      ...data,
      tramites: data.tramites.map((t) => (t.id === id ? updater(t) : t)),
    }))
  },

  /** Genera el siguiente id correlativo (TRM-AAAA-NNNN). */
  nextId(tramites: Tramite[]): string {
    const year = new Date().getFullYear()
    const count = tramites.length + 1
    return `TRM-${year}-${String(count).padStart(4, '0')}`
  },
}

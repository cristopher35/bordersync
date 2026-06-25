import { useSyncExternalStore } from 'react'
import seed from '@/data/seed.json'
import type { BorderSyncData } from '@/shared/domain/entities'

/**
 * Store JSON en el navegador (sin backend). En el primer arranque carga la
 * semilla `data.json`; a partir de ahí persiste cada cambio en localStorage,
 * de modo que la información sobrevive a recargas. Reemplaza al backend/BD.
 *
 * Las mutaciones son inmutables y notifican a los componentes suscritos vía
 * useSyncExternalStore, así la UI se mantiene sincronizada entre roles.
 */
const STORAGE_KEY = 'bordersync.db.v1'

type Listener = () => void

class JsonStore {
  private data: BorderSyncData
  private listeners = new Set<Listener>()

  constructor() {
    this.data = this.read()
  }

  private read(): BorderSyncData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw) as BorderSyncData
    } catch {
      // localStorage corrupto o no disponible: usar semilla.
    }
    return structuredClone(seed) as unknown as BorderSyncData
  }

  private write() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data))
    this.listeners.forEach((notify) => notify())
  }

  getSnapshot = (): BorderSyncData => this.data

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /** Aplica una transformación inmutable del estado completo y persiste. */
  update(mutator: (data: BorderSyncData) => BorderSyncData) {
    this.data = mutator(this.data)
    this.write()
  }

  /** Restaura la base a la semilla original (útil para demos). */
  reset() {
    this.data = structuredClone(seed) as unknown as BorderSyncData
    this.write()
  }
}

export const store = new JsonStore()

/** Hook que expone el snapshot completo (estable entre actualizaciones). */
export function useData(): BorderSyncData {
  return useSyncExternalStore(store.subscribe, store.getSnapshot)
}

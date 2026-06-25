/**
 * Configuración derivada del entorno.
 *
 * La URL base para los enlaces de los QR se resuelve así:
 * - En DESARROLLO se usa el origen actual del navegador (localhost o tu IP de
 *   red), de modo que el QR siempre apunte a la app que estás corriendo y no a
 *   un dominio de ejemplo (evita 404 al escanear/probar en local).
 * - En PRODUCCIÓN se usa VITE_APP_BASE_URL (el dominio donde se aloja la app);
 *   si no está definido, también cae al origen actual.
 */
const envUrl = import.meta.env.VITE_APP_BASE_URL?.trim()
const origin = typeof window !== 'undefined' ? window.location.origin : ''

export const APP_BASE_URL = (import.meta.env.DEV ? origin : envUrl || origin).replace(/\/$/, '')

/** URL pública para consultar el estado de un trámite (destino del QR). */
export function tramiteStatusUrl(id: string): string {
  return `${APP_BASE_URL}/estado/${encodeURIComponent(id)}`
}

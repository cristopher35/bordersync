/**
 * Configuración derivada del entorno. La URL base del dominio se define en `.env`
 * (VITE_APP_BASE_URL); si no está, se usa el origen actual del navegador como
 * respaldo, de modo que los enlaces de los QR siempre apunten a algún sitio válido.
 */
const fromEnv = import.meta.env.VITE_APP_BASE_URL?.trim()

export const APP_BASE_URL = (
  fromEnv || (typeof window !== 'undefined' ? window.location.origin : '')
).replace(/\/$/, '')

/** URL pública para consultar el estado de un trámite (destino del QR). */
export function tramiteStatusUrl(id: string): string {
  return `${APP_BASE_URL}/estado/${encodeURIComponent(id)}`
}

/**
 * Validadores de dominio reutilizables. Funciones puras, sin dependencias de
 * React, para poder usarlas tanto en las reglas de negocio (domain) como en la
 * validación en tiempo real de los formularios (presentation).
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim())
}

// ---------------------------------------------------------------------------
// RUT chileno (con dígito verificador)
// ---------------------------------------------------------------------------

/** Deja solo dígitos y la K final, en mayúscula. */
export function cleanRut(rut: string): string {
  return rut.replace(/[^0-9kK]/g, '').toUpperCase()
}

/** Calcula el dígito verificador (módulo 11) del cuerpo numérico del RUT. */
export function computeDv(body: string): string {
  let sum = 0
  let mul = 2
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * mul
    mul = mul === 7 ? 2 : mul + 1
  }
  const res = 11 - (sum % 11)
  if (res === 11) return '0'
  if (res === 10) return 'K'
  return String(res)
}

/** Valida un RUT chileno completo (cuerpo + dígito verificador). */
export function isValidRut(rut: string): boolean {
  const clean = cleanRut(rut)
  if (clean.length < 2) return false
  const body = clean.slice(0, -1)
  const dv = clean.slice(-1)
  if (!/^\d+$/.test(body)) return false
  return computeDv(body) === dv
}

/** Formatea un RUT como 12.345.678-9. */
export function formatRut(rut: string): string {
  const clean = cleanRut(rut)
  if (clean.length < 2) return rut
  const body = clean.slice(0, -1)
  const dv = clean.slice(-1)
  return `${body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`
}

// ---------------------------------------------------------------------------
// Documento de identidad genérico (pasaporte o ID extranjero): alfanumérico,
// admite puntos, guiones y espacios. Para chilenos se usa isValidRut aparte.
// ---------------------------------------------------------------------------

export function isValidDocumento(value: string): boolean {
  const v = value.trim()
  return v.length >= 5 && /^[A-Za-z0-9.\- ]+$/.test(v)
}

// ---------------------------------------------------------------------------
// Patente vehicular internacional: la Aduana recibe vehículos de distintos
// países, así que se acepta cualquier placa alfanumérica (con espacios o
// guiones), no solo el formato chileno.
// ---------------------------------------------------------------------------

const PATENTE_RE = /^[A-Z0-9][A-Z0-9\s-]{2,11}$/

export function isValidPatente(value: string): boolean {
  const v = value.trim().toUpperCase()
  return v.length >= 4 && PATENTE_RE.test(v)
}

// ---------------------------------------------------------------------------
// Fechas (comparadas por día, sin hora)
// ---------------------------------------------------------------------------

function toDay(value: string): Date | null {
  if (!value) return null
  const d = new Date(`${value}T00:00:00`)
  return Number.isNaN(d.getTime()) ? null : d
}

function today(): Date {
  const t = new Date()
  return new Date(t.getFullYear(), t.getMonth(), t.getDate())
}

/** True si la fecha (yyyy-mm-dd) es hoy o futura. */
export function isTodayOrFuture(value: string): boolean {
  const d = toDay(value)
  return d != null && d >= today()
}

/** True si la fecha (yyyy-mm-dd) es estrictamente pasada. */
export function isPast(value: string): boolean {
  const d = toDay(value)
  return d != null && d < today()
}

// ---------------------------------------------------------------------------
// Helpers genéricos
// ---------------------------------------------------------------------------

export function isBlank(value: string): boolean {
  return value.trim().length === 0
}

export function inRange(n: number, min: number, max: number): boolean {
  return Number.isFinite(n) && n >= min && n <= max
}

/**
 * Result<T> — patrón funcional para representar éxito o fallo sin lanzar
 * excepciones. Lo usamos en los Value Objects y casos de uso del dominio
 * para que la validación sea explícita y testeable.
 */
export type Result<T, E = string> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E }

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value })

export const err = <E>(error: E): Result<never, E> => ({ ok: false, error })

export const isOk = <T, E>(r: Result<T, E>): r is { ok: true; value: T } => r.ok

import type { Producto, NivelRiesgo, CategoriaProducto } from '@/shared/domain/entities'

/**
 * Reglas de la declaración SAG (RF05). Mejora UX: el sistema clasifica
 * automáticamente cada producto contra un catálogo conocido y calcula el nivel
 * de riesgo, de modo que el funcionario SAG recibe la declaración ya priorizada
 * (en vez de clasificarla manualmente, reduciendo el tiempo de revisión).
 */

export interface ProductoCatalogo {
  nombre: string
  categoria: CategoriaProducto
}

export const CATALOGO_SAG: ProductoCatalogo[] = [
  { nombre: 'Agua embotellada', categoria: 'permitido' },
  { nombre: 'Galletas envasadas', categoria: 'permitido' },
  { nombre: 'Chocolate sellado', categoria: 'permitido' },
  { nombre: 'Conservas industriales', categoria: 'permitido' },
  { nombre: 'Frutas frescas (manzanas)', categoria: 'restringido' },
  { nombre: 'Verduras frescas', categoria: 'restringido' },
  { nombre: 'Semillas', categoria: 'restringido' },
  { nombre: 'Miel', categoria: 'restringido' },
  { nombre: 'Embutidos artesanales', categoria: 'prohibido' },
  { nombre: 'Carne fresca', categoria: 'prohibido' },
  { nombre: 'Productos lácteos sin sellar', categoria: 'prohibido' },
  { nombre: 'Plantas con tierra', categoria: 'prohibido' },
]

export const CATEGORIA_LABEL: Record<CategoriaProducto, string> = {
  permitido: 'Permitido',
  restringido: 'Restringido',
  prohibido: 'Prohibido',
}

export function categoriaDe(nombre: string): CategoriaProducto {
  return CATALOGO_SAG.find((p) => p.nombre === nombre)?.categoria ?? 'permitido'
}

/** Calcula advertencia y nivel de riesgo a partir de los productos declarados. */
export function evaluarDeclaracionSag(productos: Producto[]): {
  advertencia: boolean
  nivelRiesgo: NivelRiesgo
} {
  if (productos.some((p) => p.categoria === 'prohibido')) {
    return { advertencia: true, nivelRiesgo: 'alto' }
  }
  if (productos.some((p) => p.categoria === 'restringido')) {
    return { advertencia: true, nivelRiesgo: 'medio' }
  }
  return { advertencia: false, nivelRiesgo: 'bajo' }
}

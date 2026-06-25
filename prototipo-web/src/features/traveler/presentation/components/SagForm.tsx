import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { SelectField } from '@/shared/ui/SelectField'
import { TextField } from '@/shared/ui/TextField'
import { Badge, RiskBadge } from '@/shared/ui/Badge'
import { IconWarning } from '@/shared/ui/icons'
import type { Producto, CategoriaProducto, ActorRef } from '@/shared/domain/entities'
import {
  CATALOGO_SAG,
  CATEGORIA_LABEL,
  categoriaDe,
  evaluarDeclaracionSag,
} from '../../domain/sagPolicy'
import { setSagDeclaration } from '../../application/tramitesService'

const tonoCategoria: Record<CategoriaProducto, 'green' | 'amber' | 'red'> = {
  permitido: 'green',
  restringido: 'amber',
  prohibido: 'red',
}

export function SagForm({
  tramiteId,
  actor,
  onDone,
}: {
  tramiteId: string
  actor: ActorRef
  onDone: () => void
}) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [nombre, setNombre] = useState('')
  const [cantidad, setCantidad] = useState(1)

  function add() {
    if (!nombre) return
    setProductos((prev) => {
      const existe = prev.find((p) => p.nombre === nombre)
      if (existe) {
        // Evita duplicados: acumula la cantidad del mismo producto.
        return prev.map((p) =>
          p.nombre === nombre ? { ...p, cantidad: Math.min(999, p.cantidad + cantidad) } : p,
        )
      }
      return [...prev, { nombre, categoria: categoriaDe(nombre), cantidad: Math.min(999, cantidad) }]
    })
    setNombre('')
    setCantidad(1)
  }

  function submit() {
    setSagDeclaration(tramiteId, productos, actor)
    onDone()
  }

  const evaluacion = productos.length ? evaluarDeclaracionSag(productos) : null

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-500">
        Selecciona los productos de origen animal o vegetal que llevas. El sistema los clasifica
        automáticamente y calcula el nivel de riesgo para SAG.
      </p>

      <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_auto]">
        <SelectField
          label="Producto"
          name="producto"
          placeholder="Selecciona un producto…"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          options={CATALOGO_SAG.map((p) => ({
            value: p.nombre,
            label: `${p.nombre} · ${CATEGORIA_LABEL[p.categoria]}`,
          }))}
        />
        <TextField
          label="Cantidad"
          name="cantidad"
          type="number"
          min={1}
          value={cantidad}
          onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
        />
        <Button type="button" variant="ghost" onClick={add}>
          Añadir
        </Button>
      </div>

      {productos.length > 0 && (
        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
          {productos.map((p, i) => (
            <li key={i} className="flex items-center justify-between px-3 py-2 text-sm">
              <span>
                {p.cantidad}× {p.nombre}
              </span>
              <Badge tone={tonoCategoria[p.categoria]}>{CATEGORIA_LABEL[p.categoria]}</Badge>
            </li>
          ))}
        </ul>
      )}

      {evaluacion && (
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm">
          <span className="text-slate-500">Evaluación automática:</span>
          <RiskBadge nivel={evaluacion.nivelRiesgo} />
          {evaluacion.advertencia && (
            <span className="inline-flex items-center gap-1 text-amber-600">
              <IconWarning /> Contiene productos restringidos o prohibidos
            </span>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="button" onClick={submit} disabled={productos.length === 0}>
          Registrar declaración SAG
        </Button>
      </div>
    </div>
  )
}

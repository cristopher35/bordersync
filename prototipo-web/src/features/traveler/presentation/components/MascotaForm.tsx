import { useState, type FormEvent } from 'react'
import { Button } from '@/shared/ui/Button'
import { TextField } from '@/shared/ui/TextField'
import type { ActorRef } from '@/shared/domain/entities'
import { buildMascota } from '../../domain/mascotaPolicy'
import { setMascota } from '../../application/tramitesService'

export function MascotaForm({
  tramiteId,
  actor,
  onDone,
}: {
  tramiteId: string
  actor: ActorRef
  onDone: () => void
}) {
  const [tipoAnimal, setTipoAnimal] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [esMenor, setEsMenor] = useState(false)
  const [representante, setRepresentante] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const result = buildMascota({
      tipoAnimal,
      cantidad,
      declaranteEsMenor: esMenor,
      representanteLegal: representante,
    })
    if (!result.ok) {
      setError(result.error)
      return
    }
    setMascota(tramiteId, result.value, actor)
    onDone()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Tipo de animal"
          name="tipoAnimal"
          placeholder="Perro, gato…"
          value={tipoAnimal}
          onChange={(e) => setTipoAnimal(e.target.value)}
          required
        />
        <TextField
          label="Cantidad"
          name="cantidad"
          type="number"
          min={1}
          value={cantidad}
          onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
          required
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={esMenor}
          onChange={(e) => setEsMenor(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-gov-600 focus:ring-gov-400"
        />
        Soy menor de 18 años
      </label>

      {esMenor && (
        <TextField
          label="Representante legal"
          name="representante"
          placeholder="Nombre del representante legal"
          value={representante}
          onChange={(e) => setRepresentante(e.target.value)}
          hint="Obligatorio para declarantes menores de edad (RF09)."
          required
        />
      )}

      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit">Registrar mascota</Button>
      </div>
    </form>
  )
}

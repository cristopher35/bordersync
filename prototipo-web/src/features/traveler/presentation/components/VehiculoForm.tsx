import { useState, type FormEvent } from 'react'
import { Button } from '@/shared/ui/Button'
import { TextField } from '@/shared/ui/TextField'
import { SelectField } from '@/shared/ui/SelectField'
import type { PlacaDiplomatica, TipoVehiculo, ActorRef } from '@/shared/domain/entities'
import { buildVehiculo, PLACAS_DIPLOMATICAS } from '../../domain/vehiculoPolicy'
import { setVehiculo } from '../../application/tramitesService'

export function VehiculoForm({
  tramiteId,
  actor,
  onDone,
}: {
  tramiteId: string
  actor: ActorRef
  onDone: () => void
}) {
  const [tipo, setTipo] = useState<TipoVehiculo>('particular')
  const [patente, setPatente] = useState('')
  const [modelo, setModelo] = useState('')
  const [propietario, setPropietario] = useState('')
  const [tipoPlaca, setTipoPlaca] = useState<PlacaDiplomatica | ''>('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const result = buildVehiculo({ tipo, patente, modelo, propietario, tipoPlaca }, new Date())
    if (!result.ok) {
      setError(result.error)
      return
    }
    setVehiculo(tramiteId, result.value, actor)
    onDone()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <SelectField
        label="Tipo de vehículo"
        name="tipo"
        value={tipo}
        onChange={(e) => setTipo(e.target.value as TipoVehiculo)}
        options={[
          { value: 'particular', label: 'Particular (180 días)' },
          { value: 'diplomatico', label: 'Diplomático (90 días)' },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Patente" name="patente" value={patente} onChange={(e) => setPatente(e.target.value)} required />
        <TextField label="Modelo" name="modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} required />
        <TextField
          label="Propietario"
          name="propietario"
          value={propietario}
          onChange={(e) => setPropietario(e.target.value)}
          required
        />
        {tipo === 'diplomatico' && (
          <SelectField
            label="Tipo de placa"
            name="tipoPlaca"
            placeholder="Selecciona…"
            value={tipoPlaca}
            onChange={(e) => setTipoPlaca(e.target.value as PlacaDiplomatica)}
            options={PLACAS_DIPLOMATICAS.map((p) => ({ value: p, label: p }))}
            required
          />
        )}
      </div>

      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit">Generar documento</Button>
      </div>
    </form>
  )
}

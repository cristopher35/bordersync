import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/shared/ui/AppShell'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { TextField } from '@/shared/ui/TextField'
import { TextAreaField } from '@/shared/ui/TextAreaField'
import { useData } from '@/shared/infrastructure/store'
import { useSession } from '@/shared/session/SessionProvider'
import { isBlank, isPast } from '@/shared/lib/validation'
import { createTramite } from '../application/tramitesService'

export function NewTramitePage() {
  const data = useData()
  const { user } = useSession()
  const navigate = useNavigate()
  const [destino, setDestino] = useState('')
  const [fechaViaje, setFechaViaje] = useState('')
  const [motivo, setMotivo] = useState('')
  const [errors, setErrors] = useState<{ destino?: string; fechaViaje?: string }>({})

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (isBlank(destino)) {
      next.destino = 'Indica el destino o paso fronterizo.'
    } else if (destino.trim().length < 3) {
      next.destino = 'El destino es demasiado corto.'
    }
    if (!fechaViaje) {
      next.fechaViaje = 'Indica la fecha de viaje.'
    } else if (isPast(fechaViaje)) {
      next.fechaViaje = 'La fecha de viaje no puede ser anterior a hoy.'
    }
    setErrors(next)
    if (Object.keys(next).length > 0 || !user) return

    const id = createTramite(user, { destino, fechaViaje, motivo }, data.tramites)
    navigate(`/viajero/tramite/${id}`)
  }

  return (
    <>
      <PageHeader
        title="Nuevo trámite"
        description="RF03 · Documentación de viaje. Luego podrás añadir vehículo y declaraciones."
      />
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="Destino / paso fronterizo"
            name="destino"
            placeholder="Ej. Mendoza, Argentina (Paso Los Libertadores)"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            error={errors.destino}
            required
          />
          <TextField
            label="Fecha de viaje"
            name="fechaViaje"
            type="date"
            value={fechaViaje}
            onChange={(e) => setFechaViaje(e.target.value)}
            error={errors.fechaViaje}
            required
          />
          <TextAreaField
            label="Motivo del viaje"
            name="motivo"
            placeholder="Turismo, trabajo, visita familiar…"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => navigate('/viajero')}>
              Cancelar
            </Button>
            <Button type="submit">Crear trámite</Button>
          </div>
        </form>
      </Card>
    </>
  )
}

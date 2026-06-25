import type { Tramite } from '@/shared/domain/entities'
import { QrCode } from '@/shared/ui/QrCode'
import { CopyButton } from '@/shared/ui/CopyButton'
import { StatusBadge } from '@/shared/ui/Badge'
import { IconCheck } from '@/shared/ui/icons'
import { tramiteStatusUrl } from '@/shared/config'
import { WaitEstimate } from './WaitEstimate'

/** Pase de cruce: identifica el trámite en el control con un QR escaneable. */
export function CrossingPass({ tramite }: { tramite: Tramite }) {
  const aprobado = tramite.estadoValidacion === 'aprobado'
  const statusUrl = tramiteStatusUrl(tramite.id)

  return (
    <div className="rounded-2xl border border-gov-200 bg-linear-to-br from-gov-50 to-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <QrCode value={statusUrl} downloadName={`pase-${tramite.id}`} />
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-gov-600">
            Pase de cruce fronterizo
          </p>
          <div className="mt-1 flex items-center gap-2">
            <p className="font-mono text-lg font-bold text-gov-900">{tramite.id}</p>
            <CopyButton value={tramite.id} label="" />
          </div>
          <p className="text-sm text-slate-600">{tramite.viajero.nombre}</p>
          <p className="text-xs text-slate-400">{tramite.viajero.documento}</p>
          <div className="mt-3">
            <StatusBadge estado={tramite.estadoValidacion} />
          </div>
          <div className="mt-3">
            <WaitEstimate tramite={tramite} />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <CopyButton value={statusUrl} label="Copiar enlace de consulta" />
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {aprobado ? (
          <>
            <IconCheck className="text-emerald-500" /> Escanea el QR en el control para ver el estado
            y acceder al carril preferente.
          </>
        ) : (
          'Escanea el QR o usa el código para consultar el estado del trámite en línea.'
        )}
      </p>
    </div>
  )
}

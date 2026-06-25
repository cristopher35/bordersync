import { Link } from 'react-router-dom'
import type { ActivityEntry, Role } from '@/shared/domain/entities'
import { ROLE_LABELS } from '@/shared/domain/entities'
import { formatDateTime } from '@/shared/lib/format'
import { Badge } from './Badge'

const roleTone: Record<Role, 'blue' | 'teal' | 'amber' | 'gray'> = {
  viajero: 'blue',
  aduanas: 'amber',
  sag: 'teal',
  pdi: 'teal',
  admin: 'gray',
}

/** Línea de tiempo del registro de actividad. */
export function ActivityFeed({
  entries,
  showActor = true,
  linkTo,
  emptyText = 'Sin actividad registrada.',
}: {
  entries: ActivityEntry[]
  showActor?: boolean
  linkTo?: (tramiteId: string) => string
  emptyText?: string
}) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        {emptyText}
      </div>
    )
  }

  return (
    <ol className="flex flex-col">
      {entries.map((e) => (
        <li key={e.id} className="flex gap-3 border-l-2 border-slate-200 pl-4 pb-5 last:pb-0">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-slate-800">{e.accion}</p>
              {e.tramiteId &&
                (linkTo ? (
                  <Link
                    to={linkTo(e.tramiteId)}
                    className="font-mono text-xs text-gov-700 hover:underline"
                  >
                    {e.tramiteId}
                  </Link>
                ) : (
                  <span className="font-mono text-xs text-slate-400">{e.tramiteId}</span>
                ))}
              {e.resultado && <Badge tone="gray">{e.resultado}</Badge>}
            </div>
            <p className="mt-0.5 text-xs text-slate-400">
              {showActor && (
                <>
                  <span className="text-slate-500">{e.actorNombre}</span> ·{' '}
                  <span className="inline-flex">
                    <Badge tone={roleTone[e.actorRol]}>{ROLE_LABELS[e.actorRol]}</Badge>
                  </span>{' '}
                  ·{' '}
                </>
              )}
              {formatDateTime(e.fecha)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}

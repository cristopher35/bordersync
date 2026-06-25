import { useMemo } from 'react'
import { PageHeader } from '@/shared/ui/AppShell'
import { Card } from '@/shared/ui/Card'
import { ActivityFeed } from '@/shared/ui/ActivityFeed'
import { useActivity } from '@/shared/session/useActivity'
import { useSession } from '@/shared/session/SessionProvider'
import { useMyTramites } from '../application/useMyTramites'

export function MyActivityPage() {
  const { user } = useSession()
  const all = useActivity()
  const myTramites = useMyTramites()

  const myIds = useMemo(() => new Set(myTramites.map((t) => t.id)), [myTramites])
  const entries = useMemo(
    () => all.filter((e) => e.actorId === user?.id || (e.tramiteId != null && myIds.has(e.tramiteId))),
    [all, user?.id, myIds],
  )

  return (
    <>
      <PageHeader
        title="Mi actividad"
        description="Historial de tus acciones y de lo que ocurre con tus trámites."
      />
      <Card>
        <ActivityFeed
          entries={entries}
          linkTo={(id) => `/viajero/tramite/${id}`}
          emptyText="Aún no tienes actividad registrada."
        />
      </Card>
    </>
  )
}

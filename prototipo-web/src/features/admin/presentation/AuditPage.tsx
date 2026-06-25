import { PageHeader } from '@/shared/ui/AppShell'
import { Card } from '@/shared/ui/Card'
import { ActivityFeed } from '@/shared/ui/ActivityFeed'
import { useActivity } from '@/shared/session/useActivity'

export function AuditPage() {
  const entries = useActivity()

  return (
    <>
      <PageHeader
        title="Auditoría del sistema"
        description="Registro completo de la actividad de todos los usuarios (RNF 3.3.2 · logs)."
        badge={`${entries.length} eventos`}
      />
      <Card>
        <ActivityFeed entries={entries} emptyText="Sin eventos registrados." />
      </Card>
    </>
  )
}

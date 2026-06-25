import { ROLE_LABELS, type Role } from '@/shared/domain/entities'

const DEMO: { rol: Role; email: string }[] = [
  { rol: 'viajero', email: 'viajero@bordersync.cl' },
  { rol: 'aduanas', email: 'aduanas@bordersync.cl' },
  { rol: 'sag', email: 'sag@bordersync.cl' },
  { rol: 'pdi', email: 'pdi@bordersync.cl' },
  { rol: 'admin', email: 'admin@bordersync.cl' },
]

/** Atajos de demo: rellenan las credenciales de cada rol (contraseña 123456). */
export function DemoAccounts({ onPick }: { onPick: (email: string) => void }) {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold text-slate-500">Cuentas de demostración (contraseña: 123456)</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {DEMO.map((d) => (
          <button
            key={d.email}
            type="button"
            onClick={() => onPick(d.email)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-700 transition hover:border-gov-300 hover:bg-gov-50"
          >
            {ROLE_LABELS[d.rol]}
          </button>
        ))}
      </div>
    </div>
  )
}

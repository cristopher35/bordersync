/** Gráficos ligeros en SVG/CSS, sin dependencias externas. */

export interface ChartDatum {
  label: string
  value: number
  color: string
}

/** Dona de proporciones (anillo segmentado) con leyenda. */
export function DonutChart({ data, size = 168 }: { data: ChartDatum[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const denom = total || 1
  const r = size / 2 - 14
  const circumference = 2 * Math.PI * r
  let offset = 0

  return (
    <div className="flex flex-wrap items-center gap-5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={14} />
          {data.map((d, i) => {
            const dash = (d.value / denom) * circumference
            const seg = (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={d.color}
                strokeWidth={14}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
              />
            )
            offset += dash
            return seg
          })}
        </g>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-slate-800 text-xl font-bold"
        >
          {total}
        </text>
      </svg>

      <ul className="flex flex-col gap-1.5 text-sm">
        {data.map((d, i) => (
          <li key={i} className="flex items-center gap-2 text-slate-600">
            <span className="h-3 w-3 rounded-sm" style={{ background: d.color }} />
            {d.label}
            <span className="text-slate-400">({d.value})</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Barras horizontales escaladas al valor máximo. */
export function BarChart({ data }: { data: ChartDatum[] }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  return (
    <div className="flex flex-col gap-3">
      {data.map((d, i) => (
        <div key={i}>
          <div className="mb-1 flex justify-between text-xs text-slate-600">
            <span>{d.label}</span>
            <span className="font-semibold">{d.value}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(d.value / max) * 100}%`, background: d.color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

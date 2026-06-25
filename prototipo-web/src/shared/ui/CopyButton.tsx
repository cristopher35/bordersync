import { useState } from 'react'
import { IconCheck, IconCopy } from './icons'

/** Botón que copia un texto al portapapeles y muestra confirmación temporal. */
export function CopyButton({
  value,
  label = 'Copiar',
  className = '',
}: {
  value: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // El navegador puede bloquear el portapapeles sin HTTPS; se ignora.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition ${
        copied
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      } ${className}`}
    >
      {copied ? (
        <>
          <IconCheck /> Copiado
        </>
      ) : (
        <>
          <IconCopy /> {label}
        </>
      )}
    </button>
  )
}

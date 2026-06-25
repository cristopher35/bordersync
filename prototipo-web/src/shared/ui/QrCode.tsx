import { useRef } from 'react'
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'
import { IconDownload } from './icons'

const FG = '#131d30'
const BG = '#ffffff'

/**
 * QR real y escaneable (qrcode.react). Codifica un texto —normalmente la URL
 * pública de consulta del trámite— y permite descargarlo como PNG o SVG cuando
 * se pasa `downloadName`, para que el viajero pueda guardarlo o imprimirlo.
 */
export function QrCode({
  value,
  size = 132,
  downloadName,
}: {
  value: string
  size?: number
  downloadName?: string
}) {
  const canvasWrap = useRef<HTMLDivElement>(null)
  const svgWrap = useRef<HTMLDivElement>(null)

  function downloadPng() {
    const canvas = canvasWrap.current?.querySelector('canvas')
    if (!canvas || !downloadName) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `${downloadName}.png`
    a.click()
  }

  function downloadSvg() {
    const svg = svgWrap.current?.querySelector('svg')
    if (!svg || !downloadName) return
    const data = new XMLSerializer().serializeToString(svg)
    const url = URL.createObjectURL(new Blob([data], { type: 'image/svg+xml' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `${downloadName}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={canvasWrap} className="rounded-lg bg-white p-2">
        <QRCodeCanvas value={value} size={size} level="M" fgColor={FG} bgColor={BG} />
      </div>

      {downloadName && (
        <>
          {/* SVG oculto, solo para exportar en vectorial. */}
          <div ref={svgWrap} className="hidden" aria-hidden>
            <QRCodeSVG value={value} size={size} level="M" fgColor={FG} bgColor={BG} />
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={downloadPng}
              className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
            >
              <IconDownload /> PNG
            </button>
            <button
              type="button"
              onClick={downloadSvg}
              className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
            >
              <IconDownload /> SVG
            </button>
          </div>
        </>
      )}
    </div>
  )
}

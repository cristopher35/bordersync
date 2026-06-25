/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base del dominio donde se aloja la app (para los QR de consulta). */
  readonly VITE_APP_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

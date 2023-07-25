/// <reference types="astro/client" />
/// <reference types="vite-plugin-pwa/client" />
interface ImportMetaEnv {
  readonly WSSIP: string
  readonly WSSPORT: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

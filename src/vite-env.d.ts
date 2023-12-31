/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENCRYPTION_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'node-spotlight' {
  export default function spotlight(
    query: string,
    dir: string | null,
    attrs: string[]
  ): AsyncGenerator<
    any,
    void,
    unknown
  >
}

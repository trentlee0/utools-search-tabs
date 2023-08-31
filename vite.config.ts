import { defineConfig } from 'vite'
import { builtinModules } from 'node:module'

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      external: [...builtinModules, ...builtinModules.map((e) => `node:${e}`)],
      input: 'src/preload.ts',
      output: {
        format: 'cjs',
        entryFileNames: '[name].js'
      }
    }
  }
})

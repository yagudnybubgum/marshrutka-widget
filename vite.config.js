import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { writeSeoFiles } from './scripts/seo-data.mjs'

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')

function seoHomePlugin() {
  return {
    name: 'seo-home',
    buildStart() {
      if (process.env.VITEST) return
      writeSeoFiles(publicDir)
    },
    configureServer() {
      writeSeoFiles(publicDir)
    },
  }
}

export default defineConfig({
  plugins: [
    seoHomePlugin(),
    react(),
    svgr({
      svgrOptions: {
        svgProps: {
          fill: 'currentColor',
        },
      },
    }),
  ],
  base: '/',
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  test: {
    environment: 'node',
  },
})

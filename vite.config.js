import { copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function spaFallback404() {
  return {
    name: 'spa-fallback-404',
    closeBundle() {
      const outDir = join(process.cwd(), 'dist')
      const indexPath = join(outDir, 'index.html')
      const fallbackPath = join(outDir, '404.html')

      if (existsSync(indexPath)) {
        copyFileSync(indexPath, fallbackPath)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), spaFallback404()],
})

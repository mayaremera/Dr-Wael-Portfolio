import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const BRAND = '#1a4d5c'
const BRAND_ON_BRAND_MARK = '#ffffff'
const LOGO_MARK = join(process.cwd(), 'src/assets/logo-wa-mark.png')

function buildFaviconSvg({ viewBox, imageBox, background = null, fill = BRAND }) {
  const logoBase64 = readFileSync(LOGO_MARK).toString('base64')
  const backgroundRect = background
    ? `<rect width="${viewBox}" height="${viewBox}" rx="${Math.round(viewBox * 0.2)}" fill="${background}" />`
    : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBox} ${viewBox}">
  ${backgroundRect}
  <defs>
    <mask id="wa-mark" maskUnits="userSpaceOnUse" x="0" y="0" width="${viewBox}" height="${viewBox}">
      <image
        href="data:image/png;base64,${logoBase64}"
        x="${imageBox.x}"
        y="${imageBox.y}"
        width="${imageBox.width}"
        height="${imageBox.height}"
        preserveAspectRatio="xMidYMid meet"
      />
    </mask>
  </defs>
  <rect width="${viewBox}" height="${viewBox}" fill="${fill}" mask="url(#wa-mark)" />
</svg>
`
}

function writeFavicons(targetDir) {
  if (!existsSync(LOGO_MARK)) return

  writeFileSync(
    join(targetDir, 'favicon.svg'),
    buildFaviconSvg({
      viewBox: 100,
      imageBox: { x: 3, y: 21, width: 94, height: 66 },
    }),
  )

  writeFileSync(
    join(targetDir, 'apple-touch-icon.svg'),
    buildFaviconSvg({
      viewBox: 180,
      imageBox: { x: 14, y: 38, width: 152, height: 107 },
      background: BRAND,
      fill: BRAND_ON_BRAND_MARK,
    }),
  )
}

function spaFallback404() {
  return {
    name: 'spa-fallback-404',
    buildStart() {
      writeFavicons(join(process.cwd(), 'public'))
    },
    closeBundle() {
      const outDir = join(process.cwd(), 'dist')
      const indexPath = join(outDir, 'index.html')
      const fallbackPath = join(outDir, '404.html')

      if (existsSync(indexPath)) {
        copyFileSync(indexPath, fallbackPath)
      }

      writeFavicons(outDir)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), spaFallback404()],
})

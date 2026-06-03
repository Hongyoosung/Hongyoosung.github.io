import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cpSync, createReadStream, existsSync, statSync } from 'node:fs'
import { dirname, extname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const staticAssetDirs = ['gifs', 'images', 'js', 'papers', 'formula']
const portfolioRoot = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(portfolioRoot, '..')

function copyHugoStaticAssets() {
  const staticRoot = resolve(repositoryRoot, 'static')
  const distRoot = resolve(portfolioRoot, 'dist')

  return {
    name: 'copy-hugo-static-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/+/, '')
        const [assetDir] = pathname.split('/')

        if (!staticAssetDirs.includes(assetDir)) {
          next()
          return
        }

        const filePath = resolve(staticRoot, pathname)
        const relativePath = relative(staticRoot, filePath)

        if (relativePath.startsWith('..') || relativePath.startsWith(sep)) {
          next()
          return
        }

        if (!existsSync(filePath) || !statSync(filePath).isFile()) {
          next()
          return
        }

        const contentTypes = {
          '.gif': 'image/gif',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.pdf': 'application/pdf',
          '.svg': 'image/svg+xml',
          '.webp': 'image/webp',
          '.js': 'text/javascript',
        }

        res.setHeader('Content-Type', contentTypes[extname(filePath).toLowerCase()] || 'application/octet-stream')
        createReadStream(filePath).pipe(res)
      })
    },
    closeBundle() {
      for (const assetDir of staticAssetDirs) {
        const source = resolve(staticRoot, assetDir)
        if (existsSync(source)) {
          cpSync(source, resolve(distRoot, assetDir), { recursive: true, force: true })
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    copyHugoStaticAssets(),
  ],
  base: '/',
  server: {
    fs: {
      allow: [repositoryRoot],
    },
  },
})

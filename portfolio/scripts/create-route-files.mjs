import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const portfolioRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repositoryRoot = resolve(portfolioRoot, '..')
const distRoot = resolve(portfolioRoot, 'dist')
const distIndex = resolve(distRoot, 'index.html')

if (!existsSync(distIndex)) {
  throw new Error('dist/index.html does not exist. Run vite build before route generation.')
}

const unique = (items) => [...new Set(items.filter(Boolean))]

const readText = (path) => readFileSync(path, 'utf8')

const getProjectSlugs = () => {
  const projectsDir = resolve(portfolioRoot, 'src/data/projects')

  return readdirSync(projectsDir)
    .filter((file) => file.endsWith('.js'))
    .map((file) => readText(resolve(projectsDir, file)).match(/["']slug["']\s*:\s*["']([^"']+)["']/)?.[1])
    .filter(Boolean)
}

const getPublicationIds = () => {
  const publicationsPath = resolve(portfolioRoot, 'src/data/publications.js')
  const source = readText(publicationsPath)
  const ids = []
  const idPattern = /\bid\s*:\s*['"]([^'"]+)['"]/g
  let match

  while ((match = idPattern.exec(source)) !== null) {
    ids.push(match[1])
  }

  return ids
}

const getJournalSlugs = () => {
  const journalDir = resolve(repositoryRoot, 'content/journal')

  return readdirSync(journalDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => basename(file).replace(/\.ko\.md$|\.md$/g, ''))
}

const localized = (paths) => paths.flatMap((path) => [path, `/ko${path === '/' ? '' : path}`])

const routes = unique([
  '/',
  '/ko',
  ...localized(['/publications', '/news']),
  ...localized(getProjectSlugs().map((slug) => `/projects/${slug}`)),
  ...localized(getPublicationIds().map((id) => `/publications/${id}`)),
  ...localized(getJournalSlugs().map((slug) => `/news/${slug}`)),
])

for (const route of routes) {
  if (route === '/') continue

  const routeIndex = join(distRoot, route.replace(/^\/+/, ''), 'index.html')
  mkdirSync(dirname(routeIndex), { recursive: true })
  copyFileSync(distIndex, routeIndex)
}

const cnameSource = resolve(repositoryRoot, 'CNAME')
if (existsSync(cnameSource)) {
  copyFileSync(cnameSource, resolve(distRoot, 'CNAME'))
}

console.log(`Generated ${routes.length - 1} route index files.`)

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const ICON_DIR = resolve('node_modules/lucide-static/icons')
const OUT_DIR = resolve('docs/public/images/icons')
mkdirSync(OUT_DIR, { recursive: true })

const load = (name) => readFileSync(resolve(ICON_DIR, `${name}.svg`), 'utf8')

// ---- Feature icons: file SVG berwarna (terang = oranye, gelap = amber) ----
const featureIcons = {
  rocket: 'rocket',
  bot: 'bot',
  message: 'message-circle',
  infinity: 'infinity',
  puzzle: 'puzzle',
  wrench: 'wrench',
}

const variants = { light: '#ea580c', dark: '#fbbf24' }

for (const [out, name] of Object.entries(featureIcons)) {
  for (const [mode, color] of Object.entries(variants)) {
    const svg = load(name).replace('stroke="currentColor"', `stroke="${color}"`)
    writeFileSync(resolve(OUT_DIR, `${out}-${mode}.svg`), svg)
  }
}

// ---- Sidebar icons: CSS mask + data URI, warna dari var palet ----
const sidebarIcons = {
  overview: 'map',
  preparation: 'clipboard-list',
  'vps-setup': 'server',
  installation: 'download',
  'gemini-api': 'key-round',
  'telegram-bot': 'send',
  'connect-telegram': 'link',
  systemd: 'infinity',
  testing: 'list-checks',
  operations: 'terminal',
  mcp: 'puzzle',
  troubleshooting: 'wrench',
  security: 'shield-check',
  'checklist-faq': 'circle-check',
  references: 'book-open',
}

const dataUri = (name) =>
  `url("data:image/svg+xml,${encodeURIComponent(load(name).replace('currentColor', '#000'))}")`

const rules = Object.entries(sidebarIcons)
  .map(
    ([slug, name]) =>
      `.VPSidebarItem .item > .link[href*="/guide/${slug}"] .text::before {\n  --icon: ${dataUri(name)};\n}`
  )
  .join('\n\n')

const css = `/* Ikon sidebar: mask data-URI dari Lucide, warna mengikuti var(--vp-c-brand-1) */

.VPSidebarItem .item > .link .text::before {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  vertical-align: -3px;
  background-color: var(--vp-c-brand-1);
  -webkit-mask: var(--icon) no-repeat center / contain;
  mask: var(--icon) no-repeat center / contain;
}

${rules}
`

writeFileSync(resolve('docs/.vitepress/theme/sidebar-icons.css'), css)
console.log(`feature icons: ${Object.keys(featureIcons).length * 2} file -> docs/public/images/icons/`)
console.log(`sidebar icons: ${Object.keys(sidebarIcons).length} aturan -> docs/.vitepress/theme/sidebar-icons.css`)

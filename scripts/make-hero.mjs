import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const D1 = 330
const D2 = 205
const PLUS = 56
const GAP = 36
const PAD = 24
const W = D1 + GAP + PLUS + GAP + D2 + PAD * 2
const H = D1 + PAD * 2

const circleMask = (d) =>
  Buffer.from(
    `<svg width="${d}" height="${d}"><circle cx="${d / 2}" cy="${d / 2}" r="${d / 2 - 1}" fill="#fff"/></svg>`
  )

const badge = async (src, D, scale) => {
  const inner = await sharp(src)
    .resize(Math.round(D * scale), Math.round(D * scale), { fit: 'inside' })
    .png()
    .toBuffer()
  const flat = await sharp({
    create: { width: D, height: D, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
  })
    .composite([{ input: inner, gravity: 'centre' }])
    .png()
    .toBuffer()
  return sharp(flat)
    .composite([{ input: circleMask(D), blend: 'dest-in' }])
    .png()
    .toBuffer()
}

const plus = Buffer.from(
  `<svg width="${PLUS}" height="${PLUS}" viewBox="0 0 ${PLUS} ${PLUS}">
    <path d="M${PLUS / 2} ${PLUS * 0.2} V${PLUS * 0.8} M${PLUS * 0.2} ${PLUS / 2} H${PLUS * 0.8}"
      stroke="#f97316" stroke-width="9" stroke-linecap="round" fill="none"/>
  </svg>`
)

const mascotBadge = await badge('hermes-agent.png', D1, 0.72)
const telegramBadge = await badge('telegeram.png', D2, 0.8)

mkdirSync('docs/public/images', { recursive: true })

await sharp({
  create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite([
    { input: mascotBadge, left: PAD, top: PAD },
    { input: plus, left: PAD + D1 + GAP, top: PAD + Math.round((D1 - PLUS) / 2) },
    { input: telegramBadge, left: PAD + D1 + GAP + PLUS + GAP, top: PAD + Math.round((D1 - D2) / 2) },
  ])
  .png()
  .toFile('docs/public/images/hero-hermes-telegram.png')

console.log(`hero composite: ${W}x${H} -> docs/public/images/hero-hermes-telegram.png`)

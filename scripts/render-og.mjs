import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Resvg } from '@resvg/resvg-js'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const regular = path.join(root, 'public/fonts/google-sans/GoogleSans-Regular.ttf')
const medium = path.join(root, 'public/fonts/google-sans/GoogleSans-Medium.ttf')

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#f8fafd"/>
  <rect x="56" y="56" width="1088" height="518" rx="36" fill="#ffffff" stroke="#d3d8e0"/>
  <text x="120" y="230" fill="#15202c" font-family="Google Sans" font-size="72" font-weight="500">Маршрутки</text>
  <text x="120" y="314" fill="#15202c" font-family="Google Sans" font-size="72" font-weight="500">Янино-1</text>
  <text x="120" y="378" fill="#15202c" fill-opacity="0.7" font-family="Google Sans" font-size="28">Ближайший рейс и полное расписание</text>
  <g font-family="Google Sans" font-size="28" font-weight="500">
    <rect x="120" y="420" width="92" height="52" rx="26" fill="#deedff"/>
    <text x="166" y="454" text-anchor="middle" fill="#21459d">533</text>
    <rect x="224" y="420" width="92" height="52" rx="26" fill="#d9f8e0"/>
    <text x="270" y="454" text-anchor="middle" fill="#015d2d">429</text>
    <rect x="328" y="420" width="92" height="52" rx="26" fill="#eff2f7"/>
    <text x="374" y="454" text-anchor="middle" fill="#4a4d53">664</text>
    <rect x="432" y="420" width="124" height="52" rx="26" fill="#f5e8ff"/>
    <text x="494" y="454" text-anchor="middle" fill="#632895">430А</text>
    <rect x="568" y="420" width="92" height="52" rx="26" fill="#ffe9d0"/>
    <text x="614" y="454" text-anchor="middle" fill="#793900">453</text>
    <rect x="672" y="420" width="92" height="52" rx="26" fill="#eff2f7"/>
    <text x="718" y="454" text-anchor="middle" fill="#4a4d53">605</text>
  </g>
  <text x="120" y="530" fill="#15202c" fill-opacity="0.55" font-family="Google Sans" font-size="24">Янино · Ладожская · Разметелево</text>
  <text x="1024" y="530" text-anchor="end" fill="#21459d" font-family="Google Sans" font-size="24" font-weight="500">yanino.online</text>
</svg>
`

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: {
    fontFiles: [regular, medium],
    loadSystemFonts: false,
    defaultFontFamily: 'Google Sans',
  },
})

const png = resvg.render()
const out = path.join(root, 'public/og.png')
fs.writeFileSync(out, png.asPng())
console.log(`[render-og] ${png.width}x${png.height} → public/og.png`)

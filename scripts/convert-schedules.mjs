import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as XLSX from 'xlsx'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '..', 'public')
const outDir = path.join(publicDir, 'schedules')

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

const files = fs.readdirSync(publicDir).filter((f) => /^schedule-.+\.xlsx$/i.test(f))

if (files.length === 0) {
  console.warn('[convert-schedules] No schedule-*.xlsx files found in public/')
  process.exit(0)
}

for (const file of files) {
  const routeId = file.match(/^schedule-(.+)\.xlsx$/i)[1]
  const inputPath = path.join(publicDir, file)
  const outputPath = path.join(outDir, `${routeId}.json`)

  const buffer = fs.readFileSync(inputPath)
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
  const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: null })

  fs.writeFileSync(outputPath, JSON.stringify(jsonData))
  fs.chmodSync(outputPath, 0o644)
  console.log(`[convert-schedules] ${file} → schedules/${routeId}.json`)
}

console.log(`[convert-schedules] Converted ${files.length} file(s)`)

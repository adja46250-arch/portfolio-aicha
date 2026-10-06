import sharp from 'sharp'
import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs'
import { join, extname } from 'path'

const DOSSIERS = ['public/univers', 'src/assets/dessins']
const MAX = 1600
const MIN_OCTETS = 400 * 1024 // on ignore ce qui est déjà léger

function fichiers(dir) {
  return readdirSync(dir).flatMap((nom) => {
    const p = join(dir, nom)
    return statSync(p).isDirectory() ? fichiers(p) : [p]
  })
}

let avant = 0, apres = 0
const echecs = []

for (const dossier of DOSSIERS) {
  let liste
  try { liste = fichiers(dossier) } catch { continue }
  for (const f of liste) {
    const ext = extname(f).toLowerCase()
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue
    const taille = statSync(f).size
    if (taille < MIN_OCTETS) continue
    try {
      let img = sharp(readFileSync(f), { failOn: 'none' })
        .rotate()
        .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
      img = ext === '.png'
        ? img.png({ compressionLevel: 9, palette: true, quality: 80 })
        : img.jpeg({ quality: 80, mozjpeg: true })
      const buf = await img.toBuffer()
      if (buf.length < taille) {
        writeFileSync(f, buf)
        avant += taille; apres += buf.length
        console.log(f, (taille / 1048576).toFixed(1) + ' Mo →', (buf.length / 1048576).toFixed(1) + ' Mo')
      }
    } catch (e) {
      echecs.push(f)
      console.log('⚠ IMPOSSIBLE à compresser :', f, '(' + (taille / 1048576).toFixed(1) + ' Mo)')
    }
  }
}

console.log(`\nTotal : ${(avant / 1048576).toFixed(0)} Mo → ${(apres / 1048576).toFixed(0)} Mo`)
if (echecs.length) {
  console.log('\nImages à réexporter à la main (ouvre-les, puis enregistre-les en JPEG) :')
  echecs.forEach((f) => console.log(' -', f))
}
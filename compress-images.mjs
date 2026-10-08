// Compresse les grosses images du portfolio SANS les abîmer une deuxième fois.
// Lance : node compress-images.mjs
//
// Règles de sécurité :
//  1. Une image déjà assez petite (poids < MIN_OCTETS et largeur ≤ MAX) n'est pas touchée.
//  2. Une image n'est remplacée que si le gain est réel (au moins GAIN_MIN). Sinon l'original reste tel quel :
//     relancer la commande ne recompresse donc jamais une image déjà compressée.
//  3. Les noms et les extensions ne changent pas.
import { readdir, readFile, writeFile, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'
import sharp from 'sharp'

const DOSSIERS = ['public/univers', 'src/assets/dessins']
const MAX = 1600 // côté le plus long, en pixels
const QUALITE = 80
const MIN_OCTETS = 400 * 1024 // en dessous de 400 Ko, on ne touche pas
const GAIN_MIN = 0.15 // on ne remplace que si on gagne au moins 15 %
const EXT = new Set(['.jpg', '.jpeg', '.png'])

async function* fichiers(dossier) {
  let entrees
  try {
    entrees = await readdir(dossier, { withFileTypes: true })
  } catch {
    return
  }
  for (const e of entrees) {
    const chemin = join(dossier, e.name)
    if (e.isDirectory()) yield* fichiers(chemin)
    else if (EXT.has(extname(e.name).toLowerCase())) yield chemin
  }
}

const mo = (n) => (n / 1024 / 1024).toFixed(1)
let avant = 0
let apres = 0
const impossibles = []

for (const dossier of DOSSIERS) {
  for await (const chemin of fichiers(dossier)) {
    const taille = (await stat(chemin)).size
    avant += taille
    try {
      const source = await readFile(chemin)
      const meta = await sharp(source, { failOn: 'none' }).metadata()
      const plusLarge = Math.max(meta.width || 0, meta.height || 0)

      if (taille < MIN_OCTETS && plusLarge <= MAX) {
        apres += taille
        continue
      }

      let img = sharp(source, { failOn: 'none' }).rotate()
      if (plusLarge > MAX) img = img.resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
      const ext = extname(chemin).toLowerCase()
      const sortie =
        ext === '.png'
          ? await img.png({ palette: true, quality: 85, compressionLevel: 9 }).toBuffer()
          : await img.jpeg({ quality: QUALITE, mozjpeg: true }).toBuffer()

      if (sortie.length <= taille * (1 - GAIN_MIN)) {
        await writeFile(chemin, sortie)
        apres += sortie.length
        console.log(`✓ ${chemin} : ${mo(taille)} Mo → ${mo(sortie.length)} Mo`)
      } else {
        apres += taille
        console.log(`= ${chemin} : déjà optimisée, laissée telle quelle`)
      }
    } catch (e) {
      apres += taille
      impossibles.push(chemin)
      console.log(`⚠ IMPOSSIBLE ${chemin} : ${e.message}`)
    }
  }
}

console.log(`\nTotal : ${mo(avant)} Mo → ${mo(apres)} Mo`)
if (impossibles.length) console.log(`\nÀ ré-exporter à la main :\n- ${impossibles.join('\n- ')}`)

/**
 * One-off: resize + compress PNGs in public/images (hero & site assets).
 * Run: node scripts/compress-public-images.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, "../public/images");

const MAX_DIM = 1200;
const TARGET_MAX_BYTES = 300 * 1024;
const SKIP_IF_UNDER = 80 * 1024; /* leave tiny assets unchanged */

async function main() {
  const files = fs.readdirSync(imagesDir).filter((f) => /\.png$/i.test(f));
  for (const name of files) {
    const inputPath = path.join(imagesDir, name);
    const before = fs.statSync(inputPath).size;
    if (before < SKIP_IF_UNDER) {
      console.log(`${name}: ${(before / 1024).toFixed(1)} KB (skipped, already small)`);
      continue;
    }
    let pipeline = sharp(inputPath).rotate();
    const meta = await pipeline.metadata();
    if ((meta.width && meta.width > MAX_DIM) || (meta.height && meta.height > MAX_DIM)) {
      pipeline = pipeline.resize({
        width: MAX_DIM,
        height: MAX_DIM,
        fit: "inside",
        withoutEnlargement: true,
      });
    }
    const buf = await pipeline
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        effort: 10,
      })
      .toBuffer();

    let out = buf;
    if (out.length > TARGET_MAX_BYTES) {
      out = await sharp(inputPath)
        .rotate()
        .resize({
          width: 900,
          height: 900,
          fit: "inside",
          withoutEnlargement: true,
        })
        .png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10 })
        .toBuffer();
    }

    const tmpPath = inputPath + ".tmp.png";
    fs.writeFileSync(tmpPath, out);
    fs.renameSync(tmpPath, inputPath);
    const after = fs.statSync(inputPath).size;
    console.log(`${name}: ${(before / 1024).toFixed(1)} KB → ${(after / 1024).toFixed(1)} KB`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

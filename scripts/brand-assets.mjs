/**
 * Genera los derivados de marca a partir del logotipo oficial, SIN modificar su diseño:
 *  - src/assets/brand/logo.png        → logotipo completo, solo se recortan márgenes vacíos
 *  - src/assets/brand/isotipo.png     → isotipo "AM" recortado del logotipo (para favicon)
 *  - public/favicon.ico / favicon.png / apple-touch-icon.png
 *  - public/og-default.jpg            → imagen Open Graph 1200×630
 *
 * Uso: node scripts/brand-assets.mjs
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const SRC = path.join(root, 'src/assets/brand/artmeltech-logo-original.png');
const OUT_BRAND = path.join(root, 'src/assets/brand');
const OUT_PUBLIC = path.join(root, 'public');

const NAVY = '#03203D';
const SKY = '#639CC5';
const ACCENT = '#EB2F33';

await mkdir(OUT_PUBLIC, { recursive: true });

// ---------------------------------------------------------------------------
// 1. Análisis del logotipo original
// ---------------------------------------------------------------------------
const meta = await sharp(SRC).metadata();
const { data: rawAlpha, info: infoAlpha } = await sharp(SRC)
  .ensureAlpha()
  .extractChannel(3)
  .raw()
  .toBuffer({ resolveWithObject: true });
let transparentPixels = 0;
for (const v of rawAlpha) if (v < 250) transparentPixels++;
const transparentRatio = transparentPixels / (infoAlpha.width * infoAlpha.height);
console.log(
  `Logo original: ${meta.width}×${meta.height}, canales=${meta.channels}, transparencia=${(transparentRatio * 100).toFixed(1)}%`,
);

// ---------------------------------------------------------------------------
// 2. Recorte de márgenes vacíos (transparente o blanco)
// ---------------------------------------------------------------------------
const trimmedBuffer = await sharp(SRC).trim({ threshold: 18 }).png().toBuffer();
const trimmedMeta = await sharp(trimmedBuffer).metadata();
await writeFile(path.join(OUT_BRAND, 'logo.png'), trimmedBuffer);
console.log(`logo.png: ${trimmedMeta.width}×${trimmedMeta.height}`);

// ---------------------------------------------------------------------------
// 3. Detección del isotipo: primera franja vertical vacía entre la marca y el texto
// ---------------------------------------------------------------------------
const { data, info } = await sharp(trimmedBuffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const isInk = (x, y) => {
  const i = (y * info.width + x) * 4;
  const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
  return a > 60 && r + g + b < 600; // píxel visible y no blanco
};
const columnHasInk = (x) => {
  for (let y = 0; y < info.height; y++) if (isInk(x, y)) return true;
  return false;
};
let gapStart = -1;
let run = 0;
for (let x = Math.floor(info.width * 0.15); x < info.width; x++) {
  if (!columnHasInk(x)) {
    if (run === 0) gapStart = x;
    run++;
    if (run >= 6) break;
  } else {
    run = 0;
  }
}
if (gapStart > 0) {
  const markBuffer = await sharp(trimmedBuffer)
    .extract({ left: 0, top: 0, width: gapStart, height: info.height })
    .trim({ threshold: 18 })
    .png()
    .toBuffer();
  await writeFile(path.join(OUT_BRAND, 'isotipo.png'), markBuffer);
  const m = await sharp(markBuffer).metadata();
  console.log(`isotipo.png: ${m.width}×${m.height}`);

  // Favicons: isotipo original sobre fondo blanco (sin recolorear)
  const iconOnWhite = async (size, padding) => {
    const inner = Math.round(size * (1 - padding * 2));
    const mark = await sharp(markBuffer)
      .resize(inner, inner, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toBuffer();
    return sharp({ create: { width: size, height: size, channels: 4, background: '#FFFFFF' } })
      .composite([{ input: mark, gravity: 'center' }])
      .png()
      .toBuffer();
  };
  const fav32 = await iconOnWhite(32, 0.06);
  await writeFile(path.join(OUT_PUBLIC, 'favicon.png'), await iconOnWhite(192, 0.12));
  await writeFile(path.join(OUT_PUBLIC, 'icon-512.png'), await iconOnWhite(512, 0.14));
  await writeFile(path.join(OUT_PUBLIC, 'apple-touch-icon.png'), await iconOnWhite(180, 0.14));

  // ICO con PNG embebido (formato soportado por todos los navegadores modernos)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);
  entry.writeUInt8(32, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(fav32.length, 8);
  entry.writeUInt32LE(22, 12);
  await writeFile(path.join(OUT_PUBLIC, 'favicon.ico'), Buffer.concat([header, entry, fav32]));
} else {
  console.warn('No se detectó la separación entre isotipo y texto; se omiten favicons.');
}

// ---------------------------------------------------------------------------
// 4. Imagen Open Graph 1200×630: fondo navy + placa blanca con el logo original
// ---------------------------------------------------------------------------
const W = 1200;
const H = 630;
const plateW = 560;
const plateH = 190;
const logoForOg = await sharp(trimmedBuffer)
  .resize(plateW - 80, plateH - 60, { fit: 'inside' })
  .toBuffer();

const grid = Array.from({ length: Math.ceil(W / 56) }, (_, i) => `<line x1="${i * 56}" y1="0" x2="${i * 56}" y2="${H}"/>`)
  .concat(Array.from({ length: Math.ceil(H / 56) }, (_, i) => `<line x1="0" y1="${i * 56}" x2="${W}" y2="${i * 56}"/>`))
  .join('');

const ogSvg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="78%" cy="30%" r="60%">
      <stop offset="0" stop-color="${SKY}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="${NAVY}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="${NAVY}"/>
  <g stroke="${SKY}" stroke-opacity="0.08" stroke-width="1">${grid}</g>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <g fill="none" stroke="${SKY}" stroke-width="2" stroke-opacity="0.55" stroke-linecap="round">
    <path d="M760 520 L860 420 L1010 420 L1080 350"/>
    <path d="M820 600 L940 480 L1120 480"/>
    <path d="M700 110 L800 110 L880 190 L1040 190"/>
  </g>
  <g fill="${SKY}"><circle cx="1080" cy="350" r="6"/><circle cx="1120" cy="480" r="6"/><circle cx="1040" cy="190" r="6"/></g>
  <circle cx="860" cy="420" r="7" fill="${ACCENT}"/>
  <rect x="80" y="110" width="${plateW}" height="${plateH}" rx="28" fill="#FFFFFF"/>
  <text x="80" y="410" font-family="Montserrat, Arial, Helvetica, sans-serif" font-size="46" font-weight="700" fill="#FFFFFF">Transformamos ideas en</text>
  <text x="80" y="468" font-family="Montserrat, Arial, Helvetica, sans-serif" font-size="46" font-weight="700" fill="#FFFFFF">soluciones tecnológicas<tspan fill="${ACCENT}">.</tspan></text>
  <text x="80" y="535" font-family="Inter, Arial, Helvetica, sans-serif" font-size="22" letter-spacing="5" fill="${SKY}">CONNECTING SOLUTIONS</text>
</svg>`;

const logoMeta = await sharp(logoForOg).metadata();
await sharp(Buffer.from(ogSvg))
  .composite([
    {
      input: logoForOg,
      left: Math.round(80 + (plateW - (logoMeta.width ?? 0)) / 2),
      top: Math.round(110 + (plateH - (logoMeta.height ?? 0)) / 2),
    },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.join(OUT_PUBLIC, 'og-default.jpg'));
console.log('og-default.jpg generado');

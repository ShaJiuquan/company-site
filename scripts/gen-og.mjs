// Generates public/og.png (1200×630) for link previews from the RHEED
// illustration plus the logo mark and tagline. Rerun: node scripts/gen-og.mjs
import sharp from 'sharp';

const root = new URL('..', import.meta.url).pathname;
const W = 1200, H = 630;
const rheed = await sharp(`${root}src/assets/science/rheed.webp`).resize(720, 440).toBuffer();
const overlay = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="fade" x1="0" x2="1">
      <stop offset="0.38" stop-color="#05070a" stop-opacity="1"/>
      <stop offset="0.7" stop-color="#05070a" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#fade)"/>
  <g transform="translate(80 92) scale(2.2)">
    <rect x="3" y="8" width="16" height="16" rx="4.5" fill="none" stroke="#edf1f5" stroke-width="2"/>
    <path d="M11 16h14.5" stroke="#3cf0a0" stroke-width="2" stroke-linecap="round"/>
    <circle cx="11" cy="16" r="2.6" fill="#3cf0a0"/>
    <circle cx="27.6" cy="16" r="2.4" fill="none" stroke="#3cf0a0" stroke-width="1.8"/>
  </g>
  <text x="80" y="300" font-family="PingFang SC, Hiragino Sans GB, Noto Sans CJK SC, sans-serif" font-size="84" font-weight="600" fill="#edf1f5">开特云</text>
  <text x="80" y="372" font-family="Helvetica Neue, Arial, sans-serif" font-size="34" fill="#3cf0a0">The digital thread for materials labs</text>
  <text x="80" y="424" font-family="PingFang SC, Hiragino Sans GB, Noto Sans CJK SC, sans-serif" font-size="30" fill="#9ba6b4">材料实验室的数字主线</text>
  <text x="80" y="548" font-family="Menlo, monospace" font-size="22" fill="#6c7786">MBE · RHEED · STM · PPMS · provenance</text>
</svg>`);
await sharp({ create: { width: W, height: H, channels: 3, background: '#05070a' } })
  .composite([{ input: rheed, left: W - 760, top: 95 }, { input: overlay, left: 0, top: 0 }])
  .png({ compressionLevel: 9 })
  .toFile(`${root}public/og.png`);
console.log('public/og.png written');

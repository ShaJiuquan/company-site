// Generates the illustrative science images used on the home page:
// a RHEED streak pattern (phosphor screen) and an STM topograph of a
// quintuple-layer film (terraces + C3 triangular defects).
// Deterministic (seeded) — rerun with: node scripts/gen-science.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const OUT = new URL('../src/assets/science/', import.meta.url).pathname;
await mkdir(OUT, { recursive: true });

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (v) => Math.max(0, Math.min(1, v));

async function writeRgb(name, width, height, pixel, blur = 0) {
  const buf = Buffer.alloc(width * height * 3);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b] = pixel(x, y);
      const i = (y * width + x) * 3;
      buf[i] = Math.round(clamp(r) * 255);
      buf[i + 1] = Math.round(clamp(g) * 255);
      buf[i + 2] = Math.round(clamp(b) * 255);
    }
  }
  let img = sharp(buf, { raw: { width, height, channels: 3 } });
  if (blur) img = img.blur(blur);
  const info = await img.webp({ quality: 86 }).toFile(`${OUT}${name}.webp`);
  console.log(`${name}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`);
}

// ---------------------------------------------------------------- RHEED
{
  const W = 720, H = 440, cx = W / 2, shadowY = 92, d = 74;
  const rand = rng(7);
  const grain = Float32Array.from({ length: W * H }, () => rand());
  // Zeroth Laue circle through the specular spot.
  const R = 560, laueY = (x) => shadowY + 150 - (R - Math.sqrt(Math.max(0, R * R - (x - cx) ** 2)));
  const streaks = [-3, -2, -1, 0, 1, 2, 3].map((n) => ({ x: cx + n * d, amp: Math.exp(-(n * n) / 7) * (n % 2 ? 0.62 : 1) }));
  await writeRgb('rheed', W, H, (x, y) => {
    let v = 0;
    if (y > shadowY) {
      for (const s of streaks) {
        const dx = (x - s.x) / 5.2;
        const yc = laueY(s.x);
        const dy = (y - yc) / 78;
        v += s.amp * Math.exp(-dx * dx) * Math.exp(-dy * dy) * 0.95;
        v += s.amp * 0.18 * Math.exp(-dx * dx * 0.08) * Math.exp(-dy * dy * 0.6);
      }
      const sx = (x - cx) / 9, sy = (y - (shadowY + 150)) / 9;
      v += 1.1 * Math.exp(-(sx * sx + sy * sy));
      // Faint Kikuchi lines, fading away from the specular region.
      for (const [k, off] of [[0.42, 120], [-0.42, 120]]) {
        const dist = Math.abs((y - shadowY - off) - k * (x - cx)) / Math.sqrt(1 + k * k);
        const fade = Math.exp(-(((x - cx) / 260) ** 2));
        v += 0.05 * fade * Math.exp(-(dist * dist) / 5);
      }
      // Streak intensity nodes along the rod (weak modulation).
      v *= 0.9 + 0.1 * Math.cos((y - shadowY) / 17);
      v += 0.035 * Math.exp(-(((y - shadowY) / 26) ** 2));
    }
    const vign = 1 - 0.55 * (((x - cx) / W) ** 2 + ((y - H / 2) / H) ** 2);
    v = v * vign + (grain[y * W + x] - 0.5) * 0.045 + 0.018;
    const t = clamp(v);
    return [0.12 * t + 0.85 * Math.max(0, t - 0.72) * 3, 0.96 * Math.pow(t, 0.85), 0.55 * Math.pow(t, 0.95) + 0.4 * Math.max(0, t - 0.8) * 5];
  }, 1.1);
}

// ------------------------------------------------------------------ STM
{
  const W = 520, H = 520;
  const rand = rng(21);
  // Smooth value noise for sub-step roughness.
  const G = 64, lattice = Float32Array.from({ length: (G + 1) * (G + 1) }, () => rand());
  const smooth = (x, y) => {
    const gx = (x / W) * G, gy = (y / H) * G, ix = Math.floor(gx), iy = Math.floor(gy);
    const fx = gx - ix, fy = gy - iy, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    const at = (i, j) => lattice[Math.min(j, G) * (G + 1) + Math.min(i, G)];
    const a = at(ix, iy) + (at(ix + 1, iy) - at(ix, iy)) * sx;
    const b = at(ix, iy + 1) + (at(ix + 1, iy + 1) - at(ix, iy + 1)) * sx;
    return a + (b - a) * sy;
  };
  const grain = Float32Array.from({ length: W * H }, () => rand());
  const tri = Array.from({ length: 46 }, () => ({ x: rand() * W, y: rand() * H, s: 4 + rand() * 8, depth: rand() > 0.3 ? -0.35 : 0.3 }));
  const triMask = (px, py, t) => {
    // Equilateral triangles sharing one C3 orientation, soft 1.5 px rim.
    const x = (px - t.x) / t.s, y = (py - t.y) / t.s;
    const e1 = y + 0.5, e2 = -0.866 * x - 0.5 * y + 0.5, e3 = 0.866 * x - 0.5 * y + 0.5;
    const m = Math.min(e1, e2, e3) * t.s;
    return Math.max(0, Math.min(1, m / 1.5));
  };
  const height = (x, y) => {
    const meander = 18 * Math.sin(y / 67 + 0.7) + 8 * Math.sin(y / 29 + x / 97) + 4 * Math.sin(x / 37);
    const u = x * 0.8 + y * 0.6 + meander;
    const level = u / 118;
    const frac = level - Math.floor(level);
    let h = Math.floor(level) + 1 / (1 + Math.exp(-(frac - 0.985) * 90));
    for (const t of tri) {
      if (Math.abs(x - t.x) < t.s * 1.2 && Math.abs(y - t.y) < t.s * 1.2) h += t.depth * triMask(x, y, t);
    }
    return h + 0.06 * smooth(x, y) + 0.025 * (grain[y * W + x] - 0.5);
  };
  const hs = new Float32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) hs[y * W + x] = height(x, y);
  // Partial plane subtraction (as after a plane fit on a vicinal surface).
  const shown = hs.map((h, i) => h - 0.78 * (((i % W) * 0.8 + Math.floor(i / W) * 0.6) / 118));
  let min = Infinity, max = -Infinity;
  for (const v of shown) { min = Math.min(min, v); max = Math.max(max, v); }
  await writeRgb('stm', W, H, (x, y) => {
    const i = y * W + x;
    const v = (shown[i] - min) / (max - min);
    // Hill-shading from the upper left makes step edges and defects read in relief.
    const dx = hs[i + (x < W - 1 ? 1 : 0)] - hs[i - (x > 0 ? 1 : 0)];
    const dy = hs[i + (y < H - 1 ? W : 0)] - hs[i - (y > 0 ? W : 0)];
    const shade = Math.max(-0.35, Math.min(0.35, -(dx + dy) * 1.4));
    const t = clamp(0.1 + 0.82 * v + shade * 0.5);
    return [Math.min(1, t * 1.85), Math.max(0, t * 1.85 - 0.6), Math.max(0, t * 2.2 - 1.3)];
  }, 0.4);
}

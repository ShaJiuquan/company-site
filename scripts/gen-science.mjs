// Generates the illustrative science images used on the site:
// a RHEED streak pattern (phosphor screen), an STM topograph of a
// quintuple-layer film (terraces + C3 triangular defects), and a finite-
// element style temperature map of Joule heating at a current constriction.
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

// ------------------------------------------------------------------ FEM
// Joule heating at a constriction: solve Laplace(phi) in the conductor
// (insulated edges, fixed potential at both pads), take q = |grad phi|^2,
// then solve Poisson(T) = -q over the substrate with T = 0 at the border.
{
  const NX = 200, NY = 122, W = 960, H = 586;
  const halfWidth = (u) => 0.14 - 0.085 * Math.exp(-(((u - 0.5) / 0.07) ** 2));
  const inConductor = (u, v) => {
    if (u >= 0.06 && u <= 0.27 && v >= 0.16 && v <= 0.84) return true;
    if (u >= 0.73 && u <= 0.94 && v >= 0.16 && v <= 0.84) return true;
    return u > 0.27 && u < 0.73 && Math.abs(v - 0.5) <= halfWidth(u);
  };
  const idx = (i, j) => j * NX + i;
  const mask = new Uint8Array(NX * NY);
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) mask[idx(i, j)] = inConductor(i / (NX - 1), j / (NY - 1)) ? 1 : 0;
  const phi = new Float64Array(NX * NY).fill(0.5);
  const fixed = (i) => (i / (NX - 1) <= 0.075 ? 1 : i / (NX - 1) >= 0.925 ? 0 : null);
  for (let it = 0; it < 6000; it++) {
    for (let j = 1; j < NY - 1; j++) for (let i = 1; i < NX - 1; i++) {
      const k = idx(i, j);
      if (!mask[k]) continue;
      const f = fixed(i);
      if (f !== null) { phi[k] = f; continue; }
      let sum = 0, n = 0;
      for (const kk of [k - 1, k + 1, k - NX, k + NX]) if (mask[kk]) { sum += phi[kk]; n++; }
      if (n) phi[k] += 1.9 * (sum / n - phi[k]);
    }
  }
  const q = new Float64Array(NX * NY);
  for (let j = 1; j < NY - 1; j++) for (let i = 1; i < NX - 1; i++) {
    const k = idx(i, j);
    if (!mask[k]) continue;
    const gx = mask[k + 1] && mask[k - 1] ? (phi[k + 1] - phi[k - 1]) / 2 : 0;
    const gy = mask[k + NX] && mask[k - NX] ? (phi[k + NX] - phi[k - NX]) / 2 : 0;
    q[k] = gx * gx + gy * gy;
  }
  const T = new Float64Array(NX * NY);
  for (let it = 0; it < 6000; it++) {
    for (let j = 1; j < NY - 1; j++) for (let i = 1; i < NX - 1; i++) {
      const k = idx(i, j);
      // Conductor conducts heat 4x better than the substrate.
      const kc = mask[k] ? 4 : 1;
      const avg = (T[k - 1] + T[k + 1] + T[k - NX] + T[k + NX]) / 4;
      T[k] += 1.85 * (avg + (q[k] * 900) / (4 * kc) - T[k]);
    }
  }
  let tMax = 0;
  for (const t of T) tMax = Math.max(tMax, t);
  const sample = (arr, x, y) => {
    const gx = (x / (W - 1)) * (NX - 1), gy = (y / (H - 1)) * (NY - 1);
    const i = Math.min(NX - 2, Math.floor(gx)), j = Math.min(NY - 2, Math.floor(gy));
    const fx = gx - i, fy = gy - j;
    const a = arr[idx(i, j)] * (1 - fx) + arr[idx(i + 1, j)] * fx;
    const b = arr[idx(i, j + 1)] * (1 - fx) + arr[idx(i + 1, j + 1)] * fx;
    return a * (1 - fy) + b * fy;
  };
  const stops = [[0, [0, 0, 4]], [0.2, [40, 11, 84]], [0.42, [120, 28, 109]], [0.62, [196, 59, 78]], [0.8, [243, 120, 25]], [0.92, [250, 193, 39]], [1, [252, 255, 164]]];
  const inferno = (t) => {
    for (let s = 1; s < stops.length; s++) {
      if (t <= stops[s][0]) {
        const [t0, c0] = stops[s - 1], [t1, c1] = stops[s];
        const f = (t - t0) / (t1 - t0);
        return c0.map((c, n) => (c + (c1[n] - c) * f) / 255);
      }
    }
    return stops[stops.length - 1][1].map((c) => c / 255);
  };
  const rgb = new Float32Array(W * H * 3);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const c = inferno(Math.pow(Math.max(0, sample(T, x, y)) / tMax, 0.8));
    const o = (y * W + x) * 3;
    rgb[o] = c[0]; rgb[o + 1] = c[1]; rgb[o + 2] = c[2];
  }
  // Quadtree mesh, refined near the constriction and along conductor edges.
  const blend = (x, y, a) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const o = (y * W + x) * 3;
    for (let n = 0; n < 3; n++) rgb[o + n] = rgb[o + n] * (1 - a) + a;
  };
  const line = (x0, y0, x1, y1, a) => {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let s = 0; s <= steps; s++) blend(Math.round(x0 + ((x1 - x0) * s) / steps), Math.round(y0 + ((y1 - y0) * s) / steps), a);
  };
  const leaves = [];
  const refine = (u0, v0, du, dv, depth) => {
    const uc = u0 + du / 2, vc = v0 + dv / 2;
    const d2 = (uc - 0.5) ** 2 + ((vc - 0.5) * 0.61) ** 2;
    const corners = [inConductor(u0, v0), inConductor(u0 + du, v0), inConductor(u0, v0 + dv), inConductor(u0 + du, v0 + dv)];
    const edge = corners.some((c) => c !== corners[0]);
    const target = 0.012 + 0.11 * (1 - Math.exp(-d2 / 0.012));
    if (depth < 6 && (du > target || (edge && du > 0.02))) {
      for (const [a, b] of [[0, 0], [1, 0], [0, 1], [1, 1]]) refine(u0 + a * du / 2, v0 + b * dv / 2, du / 2, dv / 2, depth + 1);
    } else leaves.push([u0, v0, du, dv]);
  };
  for (let a = 0; a < 8; a++) for (let b = 0; b < 5; b++) refine(a / 8, b / 5, 1 / 8, 1 / 5, 0);
  for (const [u0, v0, du, dv] of leaves) {
    const x0 = Math.round(u0 * (W - 1)), y0 = Math.round(v0 * (H - 1));
    const x1 = Math.round((u0 + du) * (W - 1)), y1 = Math.round((v0 + dv) * (H - 1));
    line(x0, y0, x1, y0, 0.13); line(x0, y0, x0, y1, 0.13); line(x0, y1, x1, y0, 0.09);
  }
  // Conductor outline.
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const u = x / (W - 1), v = y / (H - 1), du = 1 / (W - 1), dv = 1 / (H - 1);
    const c = inConductor(u, v);
    if (c !== inConductor(u + du, v) || c !== inConductor(u, v + dv)) blend(x, y, 0.55);
  }
  await writeRgb('fem', W, H, (x, y) => {
    const o = (y * W + x) * 3;
    return [rgb[o], rgb[o + 1], rgb[o + 2]];
  }, 0.3);
}

// Build-time curve generators for the illustrative sample record. Outputs SVG
// path strings in a local (0..w, 0..h) box, y pointing down.

type Point = [number, number];

function toPath(points: Point[]): string {
  return points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('');
}

function scale(values: number[], lo: number, hi: number, h: number, pad: number): number[] {
  return values.map((v) => pad + (1 - (v - lo) / (hi - lo)) * (h - 2 * pad));
}

/** RHEED specular intensity during layer-by-layer growth: `periods` damped oscillations. */
export function rheedOscillation(w: number, h: number, periods = 8): string {
  const n = 360;
  const t = Array.from({ length: n }, (_, i) => i / (n - 1));
  const v = t.map((s) => {
    const damp = Math.exp(-s * 1.1);
    const onset = s < 0.04 ? 1 : 0.62 + 0.3 * damp * Math.cos(2 * Math.PI * periods * (s - 0.04) / 0.96) + 0.08 * damp;
    return onset;
  });
  const ys = scale(v, 0.3, 1.02, h, 4);
  return toPath(t.map((s, i) => [s * w, ys[i]]));
}

/** STM line profile across quintuple-layer terraces: a staircase with ~0.95 nm steps. */
export function stepProfile(w: number, h: number): string {
  const n = 240;
  const steps = [0.18, 0.41, 0.66, 0.86];
  const pts: Point[] = [];
  for (let i = 0; i < n; i++) {
    const s = i / (n - 1);
    let level = 0;
    for (const e of steps) level += 1 / (1 + Math.exp(-(s - e) * 220));
    const noise = 0.05 * Math.sin(s * 91) + 0.03 * Math.sin(s * 237 + 1.3);
    pts.push([s * w, level + noise]);
  }
  const ys = scale(pts.map((p) => p[1]), -0.2, steps.length + 0.2, h, 4);
  return toPath(pts.map(([x], i) => [x, ys[i]]));
}

function digamma(x: number): number {
  let r = 0;
  while (x < 6) { r -= 1 / x; x += 1; }
  const f = 1 / (x * x);
  return r + Math.log(x) - 0.5 / x - f * (1 / 12 - f * (1 / 120 - f / 252));
}

/** Magnetoresistance with a weak-antilocalization cusp (HLN form + small B² background). */
export function walCusp(w: number, h: number, bMax = 9, bPhi = 0.08): { path: string; zeroX: number } {
  const n = 401;
  const bs = Array.from({ length: n }, (_, i) => -bMax + (2 * bMax * i) / (n - 1));
  const mr = bs.map((b) => {
    const x = Math.max(Math.abs(b), 1e-4);
    const hln = digamma(0.5 + bPhi / x) - Math.log(bPhi / x);
    return hln + 0.018 * b * b;
  });
  const lo = Math.min(...mr), hi = Math.max(...mr);
  const ys = scale(mr, lo, hi, h, 5);
  return { path: toPath(bs.map((b, i) => [((b + bMax) / (2 * bMax)) * w, ys[i]])), zeroX: w / 2 };
}

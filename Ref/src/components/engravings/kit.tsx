/**
 * Engraving kit — deterministic geometry helpers for the steel-engraving plates.
 *
 * Everything here is pure (seeded PRNG, no Math.random), so server output is stable and
 * hydration-safe. Plates are drawn in `currentColor`: tone comes from line density and
 * line weight, never from fills, exactly as on an engraved plate.
 */

import type React from "react";

export type Pt = readonly [number, number];

/** Seeded PRNG (mulberry32). */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One-decimal rounding keeps path data compact. */
export const r1 = (n: number) => Math.round(n * 10) / 10;
const fmt = (p: Pt) => `${r1(p[0])} ${r1(p[1])}`;

export const TAU = Math.PI * 2;

export function poly(pts: readonly Pt[], closed = false) {
  if (!pts.length) return "";
  return "M" + pts.map(fmt).join("L") + (closed ? "Z" : "");
}

/** Compact polyline: absolute start, then relative steps (rounded first, so nothing drifts). */
export function rel(pts: readonly Pt[], closed = false) {
  if (pts.length < 2) return "";
  const q = pts.map(([x, y]) => [Math.round(x * 10), Math.round(y * 10)] as const);
  let d = `M${q[0][0] / 10} ${q[0][1] / 10}l`;
  for (let i = 1; i < q.length; i++) {
    const dx = (q[i][0] - q[i - 1][0]) / 10;
    const dy = (q[i][1] - q[i - 1][1]) / 10;
    d += `${i > 1 && dx >= 0 ? " " : ""}${dx}${dy >= 0 ? " " : ""}${dy}`;
  }
  return d + (closed ? "Z" : "");
}

/** Catmull-Rom spline through the points, emitted as cubic Béziers. */
export function smooth(pts: readonly Pt[], closed = false, tension = 1) {
  const n = pts.length;
  if (n < 3) return poly(pts, closed);
  const get = (i: number) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${fmt(pts[0])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);
    const c1: Pt = [p1[0] + ((p2[0] - p0[0]) / 6) * tension, p1[1] + ((p2[1] - p0[1]) / 6) * tension];
    const c2: Pt = [p2[0] - ((p3[0] - p1[0]) / 6) * tension, p2[1] - ((p3[1] - p1[1]) / 6) * tension];
    d += `C${fmt(c1)} ${fmt(c2)} ${fmt(p2)}`;
  }
  return d + (closed ? "Z" : "");
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerpPt = (a: Pt, b: Pt, t: number): Pt => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

/** Resample a polyline to `n` points evenly spaced by arc length. */
export function resample(pts: readonly Pt[], n: number): Pt[] {
  const acc = [0];
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = acc[acc.length - 1] || 1;
  const out: Pt[] = [];
  let j = 1;
  for (let k = 0; k < n; k++) {
    const target = (total * k) / (n - 1);
    while (j < acc.length - 1 && acc[j] < target) j++;
    const seg = acc[j] - acc[j - 1] || 1;
    out.push(lerpPt(pts[j - 1], pts[j], (target - acc[j - 1]) / seg));
  }
  return out;
}

/** Densify a smooth curve through control points (Catmull-Rom sampled) — for interpolation. */
export function sampleSpline(pts: readonly Pt[], perSeg = 8): Pt[] {
  const n = pts.length;
  const get = (i: number) => pts[Math.max(0, Math.min(n - 1, i))];
  const out: Pt[] = [];
  for (let i = 0; i < n - 1; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);
    for (let s = 0; s < perSeg; s++) {
      const t = s / perSeg;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(pts[n - 1]);
  return out;
}

/**
 * Contour-following hatch: `count` curves interpolated between curve `a` and curve `b`.
 * `ease` bunches lines toward one side (tone), `jitter` adds the engraver's hand.
 */
export function contourHatch(
  a: readonly Pt[],
  b: readonly Pt[],
  count: number,
  opts: { samples?: number; from?: number; to?: number; ease?: (t: number) => number; jitter?: number; seed?: number; trim?: [number, number]; compact?: boolean } = {},
) {
  const { samples = 18, from = 0, to = 1, ease = (t: number) => t, jitter = 0, seed = 1, trim = [0, 1], compact = false } = opts;
  const rand = mulberry32(seed);
  const A = resample(sampleSpline(a), samples);
  const B = resample(sampleSpline(b), samples);
  const i0 = Math.round(trim[0] * (samples - 1));
  const i1 = Math.round(trim[1] * (samples - 1));
  let d = "";
  for (let k = 0; k < count; k++) {
    const t = lerp(from, to, ease(count === 1 ? 0.5 : k / (count - 1)));
    const line: Pt[] = [];
    for (let i = i0; i <= i1; i++) {
      const p = lerpPt(A[i], B[i], t);
      line.push([p[0] + (rand() - 0.5) * jitter, p[1] + (rand() - 0.5) * jitter]);
    }
    d += compact ? rel(line) : smooth(line);
  }
  return d;
}

/** Circle as a path (for clip paths and outlines). */
export function circle(cx: number, cy: number, r: number) {
  return `M${r1(cx - r)} ${r1(cy)}a${r1(r)} ${r1(r)} 0 1 0 ${r1(2 * r)} 0a${r1(r)} ${r1(r)} 0 1 0 ${r1(-2 * r)} 0Z`;
}

type Circle = { cx: number; cy: number; r: number };
type Interval = [number, number];

const norm = (a: number) => ((a % TAU) + TAU) % TAU;

/** Angular interval(s) of circle `c` that fall inside circle `o`. */
function insideInterval(c: Circle, o: Circle): Interval | "all" | null {
  const dx = o.cx - c.cx;
  const dy = o.cy - c.cy;
  const D = Math.hypot(dx, dy);
  if (D >= c.r + o.r) return null;
  if (D + c.r <= o.r) return "all";
  if (D + o.r <= c.r) return null;
  const cosB = (c.r * c.r + D * D - o.r * o.r) / (2 * c.r * D);
  const beta = Math.acos(Math.max(-1, Math.min(1, cosB)));
  const mid = Math.atan2(dy, dx);
  return [mid - beta, mid + beta];
}

/** Subtract occluder intervals from [start, end] (radians, end > start). */
function subtractIntervals(start: number, end: number, cuts: Interval[]): Interval[] {
  let spans: Interval[] = [[start, end]];
  for (const [a0, b0] of cuts) {
    // shift the cut near the span range
    const shifts = [-TAU, 0, TAU, 2 * TAU];
    for (const s of shifts) {
      const a = a0 + s;
      const b = b0 + s;
      const next: Interval[] = [];
      for (const [x, y] of spans) {
        if (b <= x || a >= y) next.push([x, y]);
        else {
          if (a > x) next.push([x, a]);
          if (b < y) next.push([b, y]);
        }
      }
      spans = next;
    }
  }
  return spans.filter(([x, y]) => y - x > 0.02);
}

function arcD(c: Circle, [a, b]: Interval) {
  const p1: Pt = [c.cx + c.r * Math.cos(a), c.cy + c.r * Math.sin(a)];
  const p2: Pt = [c.cx + c.r * Math.cos(b), c.cy + c.r * Math.sin(b)];
  const large = b - a > Math.PI ? 1 : 0;
  return `M${fmt(p1)}A${r1(c.r)} ${r1(c.r)} 0 ${large} 1 ${fmt(p2)}`;
}

/** Outline of a circle with the parts hidden behind `front` circles removed. */
export function occludedCircle(c: Circle, front: readonly Circle[]) {
  const cuts: Interval[] = [];
  for (const o of front) {
    const iv = insideInterval(c, o);
    if (iv === "all") return "";
    if (iv) cuts.push(iv);
  }
  return subtractIntervals(0, TAU, cuts).map((iv) => arcD(c, iv)).join("");
}

/**
 * Sphere hatching (refs 4 and 5): arcs concentric about the highlight, clipped to the sphere,
 * with the parts behind `front` spheres removed. Returns [light, heavy] path data — the
 * heavy set is the shadow half, drawn again with a thicker line so strokes appear to swell.
 */
export function sphereHatch(
  cx: number,
  cy: number,
  r: number,
  opts: { count?: number; hx?: number; hy?: number; front?: readonly Circle[]; start?: number; heavyFrom?: number } = {},
): [string, string] {
  const { count = 11, hx = -0.42, hy = -0.46, front = [], start = 0.32, heavyFrom = 0.62 } = opts;
  const h = { cx: cx + hx * r, cy: cy + hy * r };
  const berry = { cx, cy, r };
  const D = Math.hypot(cx - h.cx, cy - h.cy);
  let light = "";
  let heavy = "";
  for (let k = 0; k < count; k++) {
    const t = k / (count - 1);
    // spacing tightens toward the terminator
    const rho = r * (start + (D / r + 1 - start) * Math.pow(t, 0.8));
    const arc = { cx: h.cx, cy: h.cy, r: rho };
    const iv = insideInterval(arc, berry);
    let span: Interval;
    if (iv === "all") span = [0, TAU];
    else if (!iv) continue;
    else {
      // the part of the hatch circle inside the berry is the complement of "inside berry"... compute directly:
      const dir = Math.atan2(cy - h.cy, cx - h.cx);
      const cosA = (rho * rho + D * D - r * r) / (2 * rho * D);
      if (cosA >= 1) continue;
      const alpha = cosA <= -1 ? Math.PI : Math.acos(cosA);
      span = [dir - alpha, dir + alpha];
    }
    const cuts: Interval[] = [];
    for (const o of front) {
      const c = insideInterval(arc, o);
      if (c === "all") {
        cuts.push([span[0] - 1, span[1] + 1]);
      } else if (c) cuts.push(c);
    }
    const parts = subtractIntervals(span[0], span[1], cuts).map((ivl) => arcD(arc, ivl)).join("");
    if (t >= heavyFrom) heavy += parts;
    else light += parts;
  }
  return [light, heavy];
}

/**
 * Mountain ridge: silhouette + shade facets (the slope facing away from the light, lower
 * right) + fall-line hachures from each summit. Light comes from the upper left.
 */
export function ridge(points: readonly Pt[], baseY: number, seed: number, opts: { hachures?: number; fall?: number; spread?: number } = {}) {
  const { hachures = 4, fall = 0.55, spread = 0.9 } = opts;
  const rand = mulberry32(seed);
  const outline = smooth(points, false, 0.55);
  const first = points[0];
  const last = points[points.length - 1];
  const silhouette = `${outline}L${r1(last[0])} ${baseY}L${r1(first[0])} ${baseY}Z`;
  let facets = "";
  let strokes = "";
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    const prev = points[i - 1];
    const next = points[i + 1];
    const isPeak = py < prev[1] && py < next[1];
    if (!isPeak) continue;
    const drop = Math.min(baseY - py, 260) * fall;
    // shade facet: from summit down the right-hand slope and back along a fall line
    const foot: Pt = [px + (next[0] - px) * 0.25 + drop * 0.12, py + drop];
    facets += poly([[px, py], next, [next[0], Math.min(baseY, next[1] + drop * 0.35)], foot], true);
    // hachures: short strokes running down the fall line from just below the summit
    for (let k = 0; k < hachures; k++) {
      const s = (k + 1) / (hachures + 1);
      const ox = lerp(prev[0], next[0], 0.5 + (s - 0.5) * spread) - px;
      const sx = px + ox * 0.35;
      const sy = py + Math.abs(ox) * 0.6 + 2;
      const len = drop * (0.35 + rand() * 0.45);
      const bend = (rand() - 0.3) * 10;
      strokes += `M${r1(sx)} ${r1(sy)}q${r1(bend)} ${r1(len * 0.5)} ${r1(ox * 0.25 + bend * 0.5)} ${r1(len)}`;
    }
  }
  return { outline, silhouette, facets, strokes };
}

/**
 * Engraved water: horizontal lines broken into dashes, spacing tightening and dashes
 * lengthening toward the foreground.
 */
export function waterLines(y0: number, y1: number, x0: number, x1: number, seed: number, opts: { first?: number; last?: number } = {}) {
  const { first = 9, last = 3.4 } = opts;
  const rand = mulberry32(seed);
  const rows: string[] = [];
  let y = y0;
  while (y < y1) {
    const t = (y - y0) / (y1 - y0);
    let d = "";
    let x = x0 + rand() * 40;
    while (x < x1) {
      const dash = lerp(18, 170, Math.pow(t, 0.8)) * (0.35 + rand() * 1.1);
      const end = Math.min(x1, x + dash);
      d += `M${r1(x)} ${r1(y)}H${r1(end)}`;
      x = end + lerp(26, 4, t) * (0.4 + rand() * 1.2);
    }
    rows.push(d);
    y += lerp(first, last, Math.pow(t, 0.7));
  }
  return rows;
}

/** Archimedean spiral points — tendrils and curls. */
export function spiral(cx: number, cy: number, r0: number, r1_: number, turns: number, start = 0, dir = 1, steps = 40): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = start + dir * t * turns * TAU;
    const r = lerp(r0, r1_, t);
    out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return out;
}

/** Parallel hatch fill: horizontal lines rotated by `angle`, tiled in user space. */
export function Hatch({ id, angle, spacing, weight }: { id: string; angle: number; spacing: number; weight: number }) {
  const w = spacing * 12;
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width={w} height={spacing} patternTransform={`rotate(${angle})`}>
      <line x1={-1} y1={spacing / 2} x2={w + 1} y2={spacing / 2} stroke="currentColor" strokeWidth={weight} />
    </pattern>
  );
}

/**
 * Shade masks, in objectBoundingBox units so one mask adapts to any form it is applied to.
 * shade: heavy lines swell toward the lower right; core: cross-hatch in the deepest shadow;
 * lit: base lines fade out in the upper-left highlight.
 */
export function ShadeMasks({ id }: { id: (k: string) => string }) {
  return (
    <>
      <linearGradient id={id("gs")} x1="0.15" y1="0.1" x2="0.85" y2="0.95">
        <stop offset="0.38" stopColor="black" />
        <stop offset="0.8" stopColor="white" />
      </linearGradient>
      <linearGradient id={id("gc")} x1="0.15" y1="0.1" x2="0.85" y2="0.95">
        <stop offset="0.62" stopColor="black" />
        <stop offset="0.95" stopColor="white" />
      </linearGradient>
      <radialGradient id={id("gl")} cx="0.3" cy="0.26" r="0.62">
        <stop offset="0.18" stopColor="black" />
        <stop offset="0.72" stopColor="white" />
      </radialGradient>
      <mask id={id("shade")} maskContentUnits="objectBoundingBox">
        <rect width="1" height="1" fill={`url(#${id("gs")})`} />
      </mask>
      <mask id={id("core")} maskContentUnits="objectBoundingBox">
        <rect width="1" height="1" fill={`url(#${id("gc")})`} />
      </mask>
      <mask id={id("lit")} maskContentUnits="objectBoundingBox">
        <rect width="1" height="1" fill={`url(#${id("gl")})`} />
      </mask>
    </>
  );
}

/** Foil gradient in the plate's own user space (strokes need userSpaceOnUse — see spec §4.1). */
export function PlateFoil({ id, w, h }: { id: string; w: number; h: number }) {
  // 115deg, the house light angle
  const dx = Math.sin((115 * Math.PI) / 180);
  const dy = -Math.cos((115 * Math.PI) / 180);
  const L = Math.max(w, h);
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={w / 2 - (dx * L) / 2} y1={h / 2 - (dy * L) / 2} x2={w / 2 + (dx * L) / 2} y2={h / 2 + (dy * L) / 2}>
      <stop offset="0" style={{ stopColor: "var(--color-gold-deep)" }} />
      <stop offset="0.22" style={{ stopColor: "var(--color-gold-light)" }} />
      <stop offset="0.4" style={{ stopColor: "var(--color-gold)" }} />
      <stop offset="0.55" style={{ stopColor: "var(--color-foil-highlight)" }} />
      <stop offset="0.75" style={{ stopColor: "var(--color-copper)" }} />
      <stop offset="1" style={{ stopColor: "var(--color-gold-light)" }} />
    </linearGradient>
  );
}

/** Stroke presets: contour lines keep a constant screen weight at any plate size. */
export const line = {
  fill: "none",
  stroke: "currentColor",
  vectorEffect: "non-scaling-stroke",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style: { strokeWidth: "var(--engrave-line)" },
} as const;

export const fine = { ...line, style: { strokeWidth: "var(--engrave-fine)" } } as const;

/** Plate-scaled strokes (these swell and shrink with the artwork, like cut lines). */
export const cut = (w: number) =>
  ({ fill: "none", stroke: "currentColor", strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round" }) as const;

export type PlateProps = {
  /** id factory, unique per rendered plate */
  id: (k: string) => string;
  /** duo mode: selected strokes in foil */
  highlight: boolean;
  /** base-layer opacity in duo mode */
  inkOpacity: number;
  /** "emblem" drops the heavy and cross-hatch levels for renders ≤160px */
  detail: "full" | "emblem";
  /** opacity of the foil strokes in duo mode (default 0.9) */
  hiOpacity?: number;
  /** lake only: draw the waterline highlight (default true) */
  waterline?: boolean;
};

/** Highlight strokes inherit stroke from their group: currentColor normally, foil in duo mode. */
export const hiLine = {
  fill: "none",
  vectorEffect: "non-scaling-stroke",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style: { strokeWidth: "var(--engrave-line)" },
} as const;

/** Wraps a plate's base layer and its highlight strokes (ref 2: tone-on-tone ink, foil accents). */
export function Duo({ p, w, h, base, hi }: { p: PlateProps; w: number; h: number; base: React.ReactNode; hi: React.ReactNode }) {
  if (!p.highlight) {
    return (
      <>
        {base}
        <g stroke="currentColor">{hi}</g>
      </>
    );
  }
  return (
    <>
      <defs>
        <PlateFoil id={p.id("foil")} w={w} h={h} />
      </defs>
      <g opacity={p.inkOpacity}>{base}</g>
      <g opacity={p.hiOpacity ?? 0.9} stroke={`url(#${p.id("foil")})`}>
        {hi}
      </g>
    </>
  );
}

/** A tapered limb along a spline: both edges (upper = lit side), centre and direction per sample. */
export function taper(center: readonly Pt[], w0: number | readonly number[], w1 = 0, n = 24, flip = false) {
  const c = resample(sampleSpline(center, 10), n);
  // a width profile (one width per control point) is mapped by chord length
  const chord = [0];
  for (let i = 1; i < center.length; i++) chord.push(chord[i - 1] + Math.hypot(center[i][0] - center[i - 1][0], center[i][1] - center[i - 1][1]));
  const widthAt = (f: number) => {
    if (!Array.isArray(w0)) return lerp(w0 as number, w1, Math.pow(f, 0.9));
    const ws = w0 as readonly number[];
    const target = f * chord[chord.length - 1];
    let j = 1;
    while (j < chord.length - 1 && chord[j] < target) j++;
    return lerp(ws[j - 1], ws[j], (target - chord[j - 1]) / (chord[j] - chord[j - 1] || 1));
  };
  const upper: Pt[] = [];
  const lower: Pt[] = [];
  const dir: number[] = [];
  const normals: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = c[Math.max(0, i - 1)];
    const b = c[Math.min(n - 1, i + 1)];
    dir.push(Math.atan2(b[1] - a[1], b[0] - a[0]));
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    normals.push([-(b[1] - a[1]) / L, (b[0] - a[0]) / L]);
  }
  // one orientation for the whole limb: "upper" faces the light (up / left) on average
  const ax = normals.reduce((s, v) => s + v[0], 0);
  const ay = normals.reduce((s, v) => s + v[1], 0);
  const sign = (ay > 0.001 || (Math.abs(ay) <= 0.001 && ax > 0)) !== flip ? -1 : 1;
  for (let i = 0; i < n; i++) {
    const [nx, ny] = normals[i];
    const w = widthAt(i / (n - 1)) / 2;
    upper.push([c[i][0] + sign * nx * w, c[i][1] + sign * ny * w]);
    lower.push([c[i][0] - sign * nx * w, c[i][1] - sign * ny * w]);
  }
  const ring = [...upper, ...lower.slice().reverse()];
  return { c, upper, lower, dir, shape: rel(ring, true), outline: smooth(ring, true, 0.8), sides: smooth(upper, false, 0.8) + smooth(lower, false, 0.8) };
}

/**
 * Scale lattice on an upright ellipsoid (cones, thistle heads): two crossing helix families,
 * foreshortened toward the silhouette. Returns the lattice lines and the cell centres
 * (with their visible width) so each scale can be finished by hand.
 */
export function helixLattice(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  opts: { tilt?: number; count?: number; twist?: number; vMin?: number; vMax?: number; bulge?: number } = {},
) {
  const { tilt = 0, count = 13, twist = 1.7, vMin = -0.97, vMax = 0.97, bulge = 0.1 } = opts;
  const rot = (tilt * TAU) / 360;
  const T = (x: number, y: number): Pt => [cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)];
  const halfW = (v: number) => rx * Math.sqrt(Math.max(0, 1 - v * v)) * (1 + bulge * v);
  const step = TAU / count;
  let lines = "";
  for (const sgn of [1, -1]) {
    for (let i = 0; i < count; i++) {
      const run: Pt[] = [];
      for (let s = 0; s <= 16; s++) {
        const v = lerp(vMin, vMax, s / 16);
        const phi = i * step + sgn * twist * v;
        if (Math.cos(phi) < 0.05) {
          if (run.length > 1) lines += rel(run);
          run.length = 0;
          continue;
        }
        run.push(T(Math.sin(phi) * halfW(v), v * ry));
      }
      if (run.length > 1) lines += rel(run);
    }
  }
  const cells: { x: number; y: number; w: number; h: number; facing: number; T: typeof T; lx: number; ly: number }[] = [];
  const dv = step / (2 * twist);
  for (let d = -12; d <= 12; d++) {
    const v = d * dv;
    if (v < vMin + dv * 0.5 || v > vMax - dv * 0.5) continue;
    for (let s = 0; s < count * 2; s += 2) {
      const phi = (s + (Math.abs(d) % 2 ? 1 : 0)) * (step / 2);
      const c = Math.cos(phi);
      if (c < 0.2) continue;
      const w = halfW(v);
      const lx = Math.sin(phi) * w;
      const ly = v * ry;
      const [x, y] = T(lx, ly);
      cells.push({ x, y, w: Math.max(1.5, (step / 2) * w * c * 0.8), h: dv * ry * 0.55, facing: c, T, lx, ly });
    }
  }
  const outline: Pt[] = [];
  for (let k = 0; k < 40; k++) {
    const a = (k / 40) * TAU;
    const v = Math.sin(a);
    outline.push(T(Math.cos(a) * rx * (1 + bulge * v), v * ry));
  }
  return { lines, cells, outline: rel(outline, true), T };
}

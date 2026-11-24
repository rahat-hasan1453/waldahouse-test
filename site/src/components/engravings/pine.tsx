/**
 * Swiss stone pine (arolla): a branch on the diagonal. Bark in longitudinal lines bunched
 * into the shade, with transverse ticks and a cross-hatched underside; needles in dense
 * brushes along the twig ends; two upright cones whose scales come from two crossing helix
 * families (a true scale lattice), each scale lip shaded. Highlights: the scale lips.
 */

import { contourHatch, Duo, Hatch, lerp, mulberry32, r1, rel, ShadeMasks, taper, TAU, type PlateProps, type Pt } from "./kit";

export const PINE_W = 600;
export const PINE_H = 600;

type Limb = { center: Pt[]; w0: number; w1: number };
const edges = ({ center, w0, w1 }: Limb) => taper(center, w0, w1);

const limbs: Limb[] = [
  { center: [[-10, 604], [78, 530], [166, 456], [250, 388], [332, 320], [404, 260], [462, 206], [506, 158]], w0: 34, w1: 8 },
  { center: [[250, 388], [236, 340], [220, 292], [200, 240]], w0: 13, w1: 5 },
  { center: [[166, 456], [212, 474], [262, 484], [316, 480]], w0: 12, w1: 5 },
  { center: [[404, 260], [394, 226], [378, 194], [360, 164]], w0: 10, w1: 5 },
];
const limbEdges = limbs.map((l) => edges(l));
const limbShapes = limbEdges.map((e) => e.shape).join("");

/* bark: longitudinal lines bunched toward the shade edge */
const bark = limbEdges
  .map((e, i) =>
    contourHatch(e.upper, e.lower, i === 0 ? 10 : 4, {
      samples: 16,
      from: 0.22,
      to: 0.96,
      ease: (t) => Math.pow(t, 0.6),
      jitter: 0.6,
      seed: 3 + i,
      compact: true,
    }),
  )
  .join("");

/* transverse ticks: the cracked bark, heavier toward the shade */
function ticks(e: ReturnType<typeof edges>, seed: number, from = 0.3) {
  const rand = mulberry32(seed);
  let d = "";
  for (let i = 1; i < e.c.length - 2; i++) {
    for (let k = 0; k < 2; k++) {
      const s = from + rand() * 0.3;
      const t = i + rand() * 0.9;
      const j = Math.min(e.c.length - 1, Math.floor(t));
      const u = e.upper[j];
      const l = e.lower[j];
      const a: Pt = [lerp(u[0], l[0], s), lerp(u[1], l[1], s)];
      const dx = (l[0] - u[0]) * (0.25 + rand() * 0.35);
      const dy = (l[1] - u[1]) * (0.25 + rand() * 0.35);
      d += `M${r1(a[0])} ${r1(a[1])}q${r1(dx / 2 + 1.5)} ${r1(dy / 2)} ${r1(dx)} ${r1(dy)}`;
    }
  }
  return d;
}
const barkTicks = ticks(limbEdges[0], 17) + ticks(limbEdges[1], 19, 0.45) + ticks(limbEdges[2], 23, 0.45);
const limbOutlines = limbEdges.map((e) => rel(e.upper) + rel(e.lower)).join("");

/* needle brushes: along the last stretch of each twig, angled forward toward the tip */
type Brush = { limb: number; from: number; to: number; n: number; len: number; seed: number };
const brushes: Brush[] = [
  { limb: 0, from: 0.74, to: 1, n: 70, len: 112, seed: 31 },
  { limb: 0, from: 0.5, to: 0.6, n: 22, len: 92, seed: 32 },
  { limb: 1, from: 0.5, to: 1, n: 56, len: 104, seed: 35 },
  { limb: 2, from: 0.5, to: 1, n: 52, len: 100, seed: 39 },
  { limb: 3, from: 0.45, to: 1, n: 44, len: 92, seed: 43 },
  { limb: 0, from: 0.14, to: 0.22, n: 18, len: 84, seed: 45 },
];

function brushPaths(b: Brush) {
  const rand = mulberry32(b.seed);
  const e = limbEdges[b.limb];
  const last = e.c.length - 1;
  let lit = "";
  let shade = "";
  for (let k = 0; k < b.n; k++) {
    const t = lerp(b.from, b.to, Math.pow(rand(), 0.6));
    const i = Math.min(last, Math.round(t * last));
    const [bx, by] = e.c[i];
    const axis = e.dir[i];
    const tip = t > 0.95;
    const side = rand() < 0.5 ? -1 : 1;
    const open = tip ? (rand() - 0.5) * 1.3 : side * (0.35 + rand() * 0.75);
    const a = axis + open;
    const len = b.len * (0.6 + rand() * 0.45) * (tip ? 1.05 : 1);
    const ex = Math.cos(a) * len;
    const ey = Math.sin(a) * len;
    const curl = (rand() - 0.5) * len * 0.16;
    const mx = ex / 2 - Math.sin(a) * curl;
    const my = ey / 2 + Math.cos(a) * curl;
    const seg = `M${Math.round(bx)} ${Math.round(by)}q${Math.round(mx)} ${Math.round(my)} ${Math.round(ex)} ${Math.round(ey)}`;
    // needles facing away from the light (lower right) are cut again, a hair apart: darker
    if (Math.cos(a - TAU / 8) > 0.15) shade += seg + `M${Math.round(bx + 1)} ${Math.round(by + 1)}q${Math.round(mx)} ${Math.round(my)} ${Math.round(ex * 0.86)} ${Math.round(ey * 0.86)}`;
    else lit += seg;
  }
  return { lit, shade };
}
const needles = brushes.map(brushPaths);
const needlesLit = needles.map((n) => n.lit).join("");
const needlesShade = needles.map((n) => n.shade).join("");

/* cones: upright ellipsoids; scales from two crossing helix families */
type Cone = { cx: number; cy: number; rx: number; ry: number; tilt: number; seed: number };
const cones: Cone[] = [
  { cx: 337, cy: 112, rx: 33, ry: 50, tilt: -24, seed: 61 },
  { cx: 520, cy: 104, rx: 30, ry: 45, tilt: 16, seed: 67 },
];

function coneGeometry({ cx, cy, rx, ry, tilt }: Cone) {
  const rot = (tilt * TAU) / 360;
  const T = (x: number, y: number): Pt => [cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)];
  const halfW = (v: number) => rx * Math.sqrt(Math.max(0, 1 - v * v)) * (1 + 0.1 * v); // fuller below
  const outline: Pt[] = [];
  for (let k = 0; k < 40; k++) {
    const a = (k / 40) * TAU;
    const v = Math.sin(a);
    outline.push(T(Math.cos(a) * rx * (1 + 0.1 * v), v * ry));
  }
  const twist = 1.7;
  const step = TAU / 13;
  let lattice = "";
  for (const sgn of [1, -1]) {
    for (let i = 0; i < 13; i++) {
      const run: Pt[] = [];
      for (let s = 0; s <= 16; s++) {
        const v = lerp(-0.97, 0.97, s / 16);
        const phi = i * step + sgn * twist * v;
        if (Math.cos(phi) < 0.05) {
          if (run.length > 1) lattice += rel(run);
          run.length = 0;
          continue;
        }
        run.push(T(Math.sin(phi) * halfW(v), v * ry));
      }
      if (run.length > 1) lattice += rel(run);
    }
  }
  // scale lips: the lower rim of every lattice cell, with a shadow tucked beneath
  let lips = "";
  let under = "";
  const dv = step / (2 * twist);
  for (let d = -6; d <= 6; d++) {
    const v = d * dv;
    if (Math.abs(v) > 0.9) continue;
    for (let s = 0; s < 26; s++) {
      const phi = (s + (d % 2 ? 1 : 0)) * (step / 2);
      const c = Math.cos(phi);
      if (c < 0.2 || s % 2 === 1) continue;
      const w = halfW(v);
      const x = Math.sin(phi) * w;
      const aw = Math.max(1.5, (step / 2) * w * c * 0.8);
      const y = v * ry;
      const h = dv * ry * 0.55;
      const [ax, ay] = T(x - aw, y + h * 0.1);
      const [kx, ky] = T(x, y + h * 1.3);
      const [bx, by] = T(x + aw, y + h * 0.1);
      lips += `M${r1(ax)} ${r1(ay)}Q${r1(kx)} ${r1(ky)} ${r1(bx)} ${r1(by)}`;
      const [ux, uy] = T(x - aw * 0.5, y + h * 0.75);
      const [wx, wy] = T(x + aw * 0.5, y + h * 0.75);
      under += `M${r1(ux)} ${r1(uy)}L${r1(wx)} ${r1(wy)}`;
    }
  }
  return { outline: rel(outline, true), lattice, lips, under };
}
const coneGeo = cones.map(coneGeometry);

export function PinePlate(p: PlateProps) {
  const { id } = p;
  const full = p.detail === "full";
  const url = (k: string) => `url(#${id(k)})`;
  return (
    <>
      <defs>
        <ShadeMasks id={id} />
        <Hatch id={id("h1")} angle={36} spacing={2.7} weight={0.7} />
        <Hatch id={id("h2")} angle={-44} spacing={3} weight={0.65} />
        {coneGeo.map((g, i) => (
          <path key={i} id={id(`co${i}`)} d={g.outline} />
        ))}
        {coneGeo.map((_, i) => (
          <clipPath key={i} id={id(`cc${i}`)}>
            <use href={`#${id(`co${i}`)}`} />
          </clipPath>
        ))}
        <mask id={id("behind")} maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="600">
          <rect width="600" height="600" fill="white" />
          {coneGeo.map((_, i) => (
            <use key={i} href={`#${id(`co${i}`)}`} fill="black" />
          ))}
        </mask>
      </defs>
      <Duo
        p={p}
        w={PINE_W}
        h={PINE_H}
        base={
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* needles sit behind the cones */}
            <g mask={url("behind")}>
              <path d={needlesLit} strokeWidth="0.8" />
              <path d={needlesShade} strokeWidth={full ? 0.95 : 0.8} />
            </g>
            {/* limbs */}
            <path d={limbShapes} fill={url("h1")} stroke="none" mask={url("shade")} />
            {full && <path d={limbShapes} fill={url("h2")} stroke="none" mask={url("core")} />}
            <path d={bark} strokeWidth="0.7" />
            {full && <path d={barkTicks} strokeWidth="0.8" />}
            <path d={limbOutlines} vectorEffect="non-scaling-stroke" style={{ strokeWidth: "var(--engrave-line)" }} />
            {/* cones */}
            {coneGeo.map((g, i) => (
              <g key={i}>
                <g clipPath={url(`cc${i}`)}>
                  <path d={g.lattice} strokeWidth="0.75" />
                  <path d={g.under} strokeWidth="1.3" />
                  <use href={`#${id(`co${i}`)}`} fill={url("h1")} stroke="none" mask={url("shade")} />
                  {full && <use href={`#${id(`co${i}`)}`} fill={url("h2")} stroke="none" mask={url("core")} />}
                </g>
                <use href={`#${id(`co${i}`)}`} vectorEffect="non-scaling-stroke" style={{ strokeWidth: "var(--engrave-line)" }} />
              </g>
            ))}
          </g>
        }
        hi={
          <g fill="none" strokeLinecap="round">
            {coneGeo.map((g, i) => (
              <path key={i} d={g.lips} strokeWidth="1.1" clipPath={url(`cc${i}`)} />
            ))}
          </g>
        }
      />
    </>
  );
}

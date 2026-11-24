/**
 * Trumpet gentians (Gentiana acaulis): two flared corollas on short stems over a rosette of
 * lanceolate leaves. Pleats follow the flare, the throat is cut dark in cross-hatch, the
 * shade side is doubled. Highlights: the petal rims.
 */

import { Duo, Hatch, lerp, mulberry32, r1, rel, sampleSpline, ShadeMasks, TAU, type PlateProps, type Pt } from "./kit";

export const GENTIAN_W = 420;
export const GENTIAN_H = 600;

type Trumpet = { x: number; y: number; h: number; rx: number; ry: number; base: number; tilt: number; seed: number };

function trumpet({ x, y, h, rx, ry, base, tilt, seed }: Trumpet) {
  const rand = mulberry32(seed);
  const rot = (tilt * TAU) / 360;
  const T = (lx: number, ly: number): Pt => [x + lx * Math.cos(rot) - ly * Math.sin(rot), y + lx * Math.sin(rot) + ly * Math.cos(rot)];
  const flare = (t: number) => base / 2 + (rx - base / 2) * Math.pow(t, 2.3);
  const depth = (t: number) => ry * Math.pow(t, 2.3);
  // a point on the corolla: t along the height, a around the axis (0 = right, π/2 = toward the viewer)
  const S = (t: number, a: number) => T(flare(t) * Math.cos(a), -h * t + depth(t) * Math.sin(a));
  // the rim with five pointed lobes
  const lobe = (a: number) => 1 + 0.24 * Math.pow(Math.max(0, Math.cos(5 * (a - 0.35))), 3);
  const rimPts = (a0: number, a1: number, n = 60): Pt[] => {
    const out: Pt[] = [];
    for (let i = 0; i <= n; i++) {
      const a = lerp(a0, a1, i / n);
      const k = lobe(a);
      out.push(T(rx * k * Math.cos(a), -h + ry * k * Math.sin(a) - (k - 1) * h * 0.18));
    }
    return out;
  };
  const front = rimPts(0, Math.PI);
  const back = rimPts(Math.PI, TAU);
  const sides = [0, Math.PI].map((a) => {
    const pts: Pt[] = [];
    for (let i = 0; i <= 14; i++) pts.push(S(i / 14, a));
    return rel(pts);
  });
  // pleats down the front, bunched toward the shade (right) side
  let pleats = "";
  let pleatsShade = "";
  for (let k = 1; k < 12; k++) {
    const a = Math.PI * (1 - Math.pow(k / 12, 0.85));
    const pts: Pt[] = [];
    for (let i = 1; i <= 12; i++) pts.push(S(lerp(0.05, 0.985, i / 12), a + (rand() - 0.5) * 0.04));
    if (Math.cos(a) > 0.2) pleatsShade += rel(pts);
    else pleats += rel(pts);
  }
  const throat = rel(rimPts(0, TAU, 60), true);
  const calyx = (() => {
    let d = "";
    for (let k = 0; k < 5; k++) {
      const a = lerp(0.2, Math.PI - 0.2, k / 4);
      const [bx, by] = S(0.02, a);
      const [tx, ty] = S(0.2, a + 0.1);
      d += `M${r1(bx)} ${r1(by)}L${r1(tx)} ${r1(ty)}`;
    }
    return d;
  })();
  let spots = "";
  for (let k = 0; k < 14; k++) {
    const a = lerp(0.35, Math.PI - 0.35, rand());
    const f = 0.35 + rand() * 0.4;
    const [sx, sy] = T(rx * f * Math.cos(a), -h + ry * f * Math.sin(a));
    spots += `M${r1(sx)} ${r1(sy)}l0.8 1.4`;
  }
  const stemTop = T(0, 4);
  return {
    front: rel(front),
    back: rel(back),
    sides: sides.join(""),
    body: rel([...Array.from({ length: 15 }, (_, i) => S(i / 14, 0)), ...front.slice().reverse().slice(1), ...Array.from({ length: 15 }, (_, i) => S(1 - i / 14, Math.PI))], true),
    throat,
    pleats,
    pleatsShade,
    calyx,
    spots,
    stemTop,
  };
}

const flowers = [
  trumpet({ x: 186, y: 412, h: 230, rx: 84, ry: 24, base: 30, tilt: -7, seed: 5 }),
  trumpet({ x: 300, y: 452, h: 170, rx: 62, ry: 18, base: 24, tilt: 15, seed: 9 }),
];
const stems = `M186 470Q184 440 188 414M300 482Q304 468 300 454`;

/* lanceolate leaves of the rosette */
function lance(base: Pt, tip: Pt, width: number, bend: number) {
  const mid: Pt = [lerp(base[0], tip[0], 0.5) + bend, lerp(base[1], tip[1], 0.5) - Math.abs(bend) * 0.4];
  const m = sampleSpline([base, mid, tip], 10);
  const n = m.length;
  const up: Pt[] = [];
  const lo: Pt[] = [];
  const v1: Pt[] = [];
  const v2: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = m[Math.max(0, i - 1)];
    const b = m[Math.min(n - 1, i + 1)];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const nx = -(b[1] - a[1]) / L;
    const ny = (b[0] - a[0]) / L;
    const t = i / (n - 1);
    const w = width * Math.pow(Math.sin(Math.PI * t), 0.7) * (1 - 0.25 * t);
    up.push([m[i][0] + nx * w, m[i][1] + ny * w]);
    lo.push([m[i][0] - nx * w, m[i][1] - ny * w]);
    v1.push([m[i][0] + nx * w * 0.5, m[i][1] + ny * w * 0.5]);
    v2.push([m[i][0] - nx * w * 0.5, m[i][1] - ny * w * 0.5]);
  }
  // hatch across one half: short strokes from the midrib to the edge
  let hatch = "";
  for (let i = 2; i < n - 2; i += 1) {
    const [mx, my] = m[i];
    const [ex, ey] = lo[i];
    hatch += `M${r1(mx)} ${r1(my)}L${r1(lerp(mx, ex, 0.92))} ${r1(lerp(my, ey, 0.92))}`;
  }
  return { shape: rel([...up, ...lo.slice().reverse()], true), veins: rel(m) + rel(v1.slice(2, -2)) + rel(v2.slice(2, -2)), hatch };
}
const leaves = [
  lance([196, 480], [36, 428], 26, -10),
  lance([198, 478], [84, 356], 22, -14),
  lance([214, 480], [392, 420], 26, 12),
  lance([206, 488], [96, 566], 24, 8),
  lance([214, 488], [346, 574], 25, -8),
  lance([204, 484], [212, 590], 18, 6),
];
const grass = (() => {
  const rand = mulberry32(21);
  let d = "";
  for (let k = 0; k < 16; k++) {
    const x = 150 + rand() * 120;
    const y = 492 + rand() * 8;
    const h = 10 + rand() * 14;
    d += `M${r1(x)} ${r1(y)}q${r1((rand() - 0.5) * 6)} ${r1(-h / 2)} ${r1((rand() - 0.5) * 10)} ${r1(-h)}`;
  }
  return d;
})();

export function GentianPlate(p: PlateProps) {
  const { id } = p;
  const full = p.detail === "full";
  const url = (k: string) => `url(#${id(k)})`;
  const contour = { vectorEffect: "non-scaling-stroke", style: { strokeWidth: "var(--engrave-line)" } } as const;
  return (
    <>
      <defs>
        <ShadeMasks id={id} />
        <Hatch id={id("h1")} angle={62} spacing={2.6} weight={0.7} />
        <Hatch id={id("h2")} angle={-30} spacing={2.8} weight={0.65} />
        <Hatch id={id("h3")} angle={8} spacing={2.2} weight={0.75} />
        <radialGradient id={id("gThroat")} cx="0.5" cy="0.3" r="0.62">
          <stop offset="0.2" stopColor="white" />
          <stop offset="0.95" stopColor="black" />
        </radialGradient>
        <mask id={id("throat")} maskContentUnits="objectBoundingBox">
          <rect width="1" height="1" fill={url("gThroat")} />
        </mask>
        <mask id={id("mBack")} maskUnits="userSpaceOnUse" x="0" y="0" width="420" height="600">
          <rect width="420" height="600" fill="white" />
          <path d={flowers[0].body} fill="black" />
        </mask>
      </defs>
      <Duo
        p={p}
        w={GENTIAN_W}
        h={GENTIAN_H}
        base={
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* the rosette */}
            {leaves.map((l, i) => (
              <g key={i}>
                <path d={l.shape} {...contour} />
                <path d={l.veins} strokeWidth="0.7" />
                <path d={l.shape} fill={url("h1")} stroke="none" mask={url("shade")} />
                {full && <path d={l.shape} fill={url("h2")} stroke="none" mask={url("core")} />}
              </g>
            ))}
            <path d={grass} strokeWidth="0.8" />
            <path d={stems} strokeWidth="2.2" />
            {/* flowers: the small one sits behind the large one */}
            {flowers
              .slice()
              .reverse()
              .map((f, i) => (
                <g key={i} mask={i === 0 ? url("mBack") : undefined}>
                  <path d={f.throat} fill={url("h3")} stroke="none" mask={url("throat")} />
                  {full && <path d={f.throat} fill={url("h2")} stroke="none" mask={url("throat")} />}
                  {full && <path d={f.spots} strokeWidth="1.3" />}
                  <path d={f.back} {...contour} />
                  <path d={f.sides} {...contour} />
                  <path d={f.pleats} strokeWidth="0.7" />
                  <path d={f.pleatsShade} strokeWidth="0.95" />
                  <path d={f.body} fill={url("h1")} stroke="none" mask={url("shade")} />
                  {full && <path d={f.body} fill={url("h2")} stroke="none" mask={url("core")} />}
                  <path d={f.calyx} strokeWidth="1" />
                </g>
              ))}
          </g>
        }
        hi={
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {flowers.map((f, i) => (
              <path key={i} d={f.front} strokeWidth="1.2" mask={i === 1 ? url("mBack") : undefined} />
            ))}
          </g>
        }
      />
    </>
  );
}

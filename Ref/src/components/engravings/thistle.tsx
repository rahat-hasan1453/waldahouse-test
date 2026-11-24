/**
 * A tall thistle (the whisky flower). Spiny, lobed leaves with a midrib and side hatch;
 * a bulbous head whose bracts form a diamond lattice, each bract ending in a spine; a crown
 * of radiating florets; a side bud. Highlights: the floret tips.
 */

import { contourHatch, Duo, Hatch, helixLattice, mulberry32, r1, rel, resample, sampleSpline, ShadeMasks, taper, TAU, type PlateProps, type Pt } from "./kit";

export const THISTLE_W = 420;
export const THISTLE_H = 900;

/** A spiny, lobed leaf along a midrib. */
function leaf(mid: Pt[], maxW: number, lobes: number, seed: number) {
  const rand = mulberry32(seed);
  const n = 64;
  const m = resample(sampleSpline(mid, 10), n);
  const up: Pt[] = [];
  const lo: Pt[] = [];
  const nrm: Pt[] = [];
  const tan: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = m[Math.max(0, i - 1)];
    const b = m[Math.min(n - 1, i + 1)];
    const tx = b[0] - a[0];
    const ty = b[1] - a[1];
    const L = Math.hypot(tx, ty) || 1;
    let nx = -ty / L;
    let ny = tx / L;
    if (ny > 0) {
      nx = -nx;
      ny = -ny;
    }
    nrm.push([nx, ny]);
    tan.push([tx / L, ty / L]);
    const t = i / (n - 1);
    const env = Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.02)), 0.75) * maxW;
    const lobe = 0.55 + 0.45 * Math.abs(Math.sin(t * lobes * Math.PI));
    const tooth = i % 2 ? 1.05 : 0.96;
    const w = env * lobe * tooth;
    up.push([m[i][0] + nx * w, m[i][1] + ny * w]);
    lo.push([m[i][0] - nx * w * 0.88, m[i][1] - ny * w * 0.88]);
  }
  let spines = "";
  let veins = "";
  for (let k = 0; k < lobes; k++) {
    const t = (k + 0.5) / lobes;
    if (t < 0.12) continue;
    const i = Math.min(n - 1, Math.round(t * (n - 1)));
    const [nx, ny] = nrm[i];
    const [tx, ty] = tan[i];
    for (const [edge, s] of [[up, 1], [lo, -1]] as const) {
      const [ex, ey] = edge[i];
      const len = 9 + rand() * 7;
      spines += `M${r1(ex)} ${r1(ey)}l${r1((nx * s * 0.6 + tx * 0.8) * len)} ${r1((ny * s * 0.6 + ty * 0.8) * len)}`;
      const j = Math.max(0, i - 5);
      const [mx, my] = m[j];
      veins += `M${r1(mx)} ${r1(my)}Q${r1((mx + ex) / 2 + tx * 4)} ${r1((my + ey) / 2 + ty * 4)} ${r1(ex)} ${r1(ey)}`;
    }
  }
  const shade =
    contourHatch(m, lo, 5, { samples: 26, from: 0.3, to: 0.96, ease: (t) => Math.pow(t, 0.7), seed: seed + 1, compact: true, trim: [0.06, 0.97] }) +
    contourHatch(m, up, 2, { samples: 26, from: 0.72, to: 0.94, seed: seed + 2, compact: true, trim: [0.1, 0.95] });
  return { spines, veins, shade, midrib: rel(m), shape: rel([...up, ...lo.slice().reverse()], true) };
}

const leaves = [
  leaf([[212, 780], [150, 760], [96, 726], [52, 690], [24, 668]], 46, 5, 11),
  leaf([[214, 664], [270, 640], [324, 604], [368, 566], [396, 548]], 42, 5, 13),
  leaf([[210, 486], [258, 462], [306, 430], [346, 404]], 30, 4, 15),
  leaf([[214, 872], [276, 866], [338, 850], [396, 826]], 48, 5, 17),
  leaf([[208, 362], [180, 352], [152, 344], [128, 344]], 15, 3, 19),
  leaf([[210, 362], [238, 352], [266, 348], [290, 350]], 15, 3, 21),
];

/* stem and the bud's branch */
const stem = taper([[214, 904], [212, 780], [208, 620], [206, 480], [206, 350]], 15, 9, 30);
const branch = taper([[208, 560], [176, 520], [146, 476], [122, 440]], 8, 4, 16);
const stemLines =
  contourHatch(stem.upper, stem.lower, 3, { samples: 20, from: 0.4, to: 0.92, seed: 23, compact: true }) +
  contourHatch(branch.upper, branch.lower, 2, { samples: 12, from: 0.5, to: 0.9, seed: 24, compact: true });
const stemSpines = (() => {
  const rand = mulberry32(29);
  let d = "";
  for (const t of [stem, branch]) {
    for (let i = 2; i < t.c.length - 2; i += 2) {
      for (const [edge, s] of [[t.upper, -1], [t.lower, 1]] as const) {
        if (rand() < 0.35) continue;
        const [x, y] = edge[i];
        d += `M${r1(x)} ${r1(y)}l${r1(s * (4 + rand() * 4))} ${r1(-3 - rand() * 4)}`;
      }
    }
  }
  return d;
})();

/* the head: bracts from a helix lattice, each finished with a spine */
function head(cx: number, cy: number, rx: number, ry: number, count: number, seed: number) {
  const rand = mulberry32(seed);
  const lat = helixLattice(cx, cy, rx, ry, { count, twist: 1.45, vMin: -0.78, vMax: 0.98, bulge: 0.12 });
  let spines = "";
  let under = "";
  for (const c of lat.cells) {
    const side = c.lx / rx;
    const [px, py] = c.T(c.lx, c.ly - c.h * 0.9);
    const len = 5 + rand() * 5;
    spines += `M${r1(px)} ${r1(py)}l${r1(side * len * 0.9)} ${r1(-len * (1 - Math.abs(side) * 0.4))}`;
    const [ux, uy] = c.T(c.lx - c.w * 0.45, c.ly + c.h * 0.5);
    const [wx, wy] = c.T(c.lx + c.w * 0.45, c.ly + c.h * 0.5);
    under += `M${r1(ux)} ${r1(uy)}L${r1(wx)} ${r1(wy)}`;
  }
  // florets: a crown radiating from the rim at the top of the head
  const rimY = cy - ry * 0.78;
  const rimR = rx * Math.sqrt(1 - 0.78 * 0.78) * 1.05;
  let florets = "";
  let tips = "";
  const n = Math.round(rx * 1.6);
  for (let k = 0; k < n; k++) {
    const f = rand() * 2 - 1;
    const bx = cx + f * rimR;
    const by = rimY + (rand() - 0.5) * 5;
    const a = ((-90 + f * 58 + (rand() - 0.5) * 16) * TAU) / 360;
    const len = rx * (1.7 + rand() * 0.9) * (1 - Math.abs(f) * 0.35);
    const ex = Math.cos(a) * len;
    const ey = Math.sin(a) * len;
    const bend = (rand() - 0.5) * len * 0.12;
    florets += `M${r1(bx)} ${r1(by)}q${r1(ex / 2 + bend)} ${r1(ey / 2)} ${r1(ex)} ${r1(ey)}`;
    // the tip: a short split
    const tx = bx + ex;
    const ty = by + ey;
    tips += `M${r1(tx)} ${r1(ty)}l${r1(Math.cos(a - 0.35) * 6)} ${r1(Math.sin(a - 0.35) * 6)}M${r1(tx)} ${r1(ty)}l${r1(Math.cos(a + 0.35) * 6)} ${r1(Math.sin(a + 0.35) * 6)}`;
  }
  const rim = `M${r1(cx - rimR)} ${r1(rimY)}q${r1(rimR)} 7 ${r1(rimR * 2)} 0`;
  return { lat, spines, under, florets, tips, rim };
}
const bigHead = head(206, 300, 60, 54, 12, 31);
const bud = head(116, 416, 22, 21, 9, 37);

export function ThistlePlate(p: PlateProps) {
  const { id } = p;
  const full = p.detail === "full";
  const url = (k: string) => `url(#${id(k)})`;
  const contour = { vectorEffect: "non-scaling-stroke", style: { strokeWidth: "var(--engrave-line)" } } as const;
  return (
    <>
      <defs>
        <ShadeMasks id={id} />
        <Hatch id={id("h1")} angle={40} spacing={2.6} weight={0.7} />
        <Hatch id={id("h2")} angle={-42} spacing={3} weight={0.65} />
        {leaves.map((l, i) => (
          <path key={i} id={id(`lf${i}`)} d={l.shape} />
        ))}
        {[bigHead, bud].map((h, i) => (
          <clipPath key={i} id={id(`ch${i}`)}>
            <path d={h.lat.outline} />
          </clipPath>
        ))}
      </defs>
      <Duo
        p={p}
        w={THISTLE_W}
        h={THISTLE_H}
        base={
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* leaves */}
            {leaves.map((l, i) => (
              <g key={i}>
                <use href={`#${id(`lf${i}`)}`} {...contour} />
                <path d={l.midrib + l.veins} strokeWidth="0.8" />
                <path d={l.spines} strokeWidth="0.9" />
                {full && <path d={l.shade} strokeWidth="0.6" />}
                <use href={`#${id(`lf${i}`)}`} fill={url("h1")} stroke="none" mask={url("shade")} />
                {full && <use href={`#${id(`lf${i}`)}`} fill={url("h2")} stroke="none" mask={url("core")} />}
              </g>
            ))}
            {/* stem and branch */}
            <path d={stem.sides + branch.sides} {...contour} />
            <path d={stemLines} strokeWidth="0.7" />
            <path d={stemSpines} strokeWidth="0.8" />
            {/* heads */}
            {[bigHead, bud].map((h, i) => (
              <g key={i}>
                <path d={h.florets} strokeWidth="0.75" />
                <g clipPath={url(`ch${i}`)}>
                  <path d={h.lat.lines} strokeWidth="0.75" />
                  <path d={h.under} strokeWidth="1.2" />
                  <path d={h.lat.outline} fill={url("h1")} stroke="none" mask={url("shade")} />
                  {full && <path d={h.lat.outline} fill={url("h2")} stroke="none" mask={url("core")} />}
                </g>
                <path d={h.lat.outline} {...contour} />
                <path d={h.rim} strokeWidth="0.9" />
                <path d={h.spines} strokeWidth="0.8" />
              </g>
            ))}
          </g>
        }
        hi={
          <g fill="none" strokeLinecap="round">
            <path d={bigHead.tips + bud.tips} strokeWidth="1" />
          </g>
        }
      />
    </>
  );
}

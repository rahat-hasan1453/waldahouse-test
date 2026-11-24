/**
 * A grapevine: a woody cane, a serrated five-lobed leaf with veins, a cluster of berries
 * each modelled with sphere hatching (concentric arcs about the highlight, swelling into
 * the shade, hidden behind the berries in front), and spiral tendrils. Highlights: tendrils.
 */

import { contourHatch, Duo, Hatch, lerp, mulberry32, occludedCircle, r1, rel, ShadeMasks, sphereHatch, spiral, smooth, taper, TAU, type PlateProps, type Pt } from "./kit";

export const GRAPES_W = 420;
export const GRAPES_H = 600;

/* the cluster: rows narrowing to a point, with a little irregularity */
type Berry = { cx: number; cy: number; r: number; z: number };
const berries: Berry[] = (() => {
  const rand = mulberry32(7);
  const rows = [4, 5, 4, 4, 3, 2, 1];
  const out: Berry[] = [];
  rows.forEach((count, ri) => {
    const y = 262 + ri * 44;
    const shift = [0, -6, 8, -4, 10, 2, 8][ri];
    for (let k = 0; k < count; k++) {
      const x = 246 + shift + (k - (count - 1) / 2) * 50 + (rand() - 0.5) * 8;
      out.push({ cx: x, cy: y + (rand() - 0.5) * 8, r: 27 + rand() * 4, z: ri * 0.6 + rand() });
    }
  });
  return out;
})();

const berryArt = berries.map((b) => {
  const front = berries.filter((o) => o !== b && o.z > b.z && Math.hypot(o.cx - b.cx, o.cy - b.cy) < o.r + b.r);
  const [light, heavy] = sphereHatch(b.cx, b.cy, b.r, { count: 9, front, start: 0.36 });
  const outline = occludedCircle(b, front);
  // a tiny navel on berries fully in view
  const navel = front.length ? "" : `M${r1(b.cx + b.r * 0.34)} ${r1(b.cy + b.r * 0.46)}l1.5 1.5m0 -1.5l-1.5 1.5`;
  return { light, heavy, outline, navel };
});
const berryLight = berryArt.map((b) => b.light).join("");
const berryHeavy = berryArt.map((b) => b.heavy).join("");
const berryOutline = berryArt.map((b) => b.outline).join("");
const berryNavel = berryArt.map((b) => b.navel).join("");

/* the cane across the top, and the stalk down into the cluster */
const cane = taper([[-10, 118], [90, 100], [200, 88], [300, 78], [430, 70]], 17, 10, 26);
const caneLines = contourHatch(cane.upper, cane.lower, 5, { samples: 18, from: 0.3, to: 0.95, ease: (t) => Math.pow(t, 0.6), seed: 3, compact: true });
const stalk = taper([[262, 82], [258, 130], [250, 180], [246, 230]], 8, 5, 14);
const stalkLines = contourHatch(stalk.upper, stalk.lower, 2, { samples: 12, from: 0.5, to: 0.9, seed: 5, compact: true });
const pedicels = "M250 196q-40 14 -76 58M250 206q30 12 64 52M248 224q-14 18 -22 34M248 226q12 16 22 32";
const knots = "M86 94q4 8 2 16M198 82q5 8 2 17M300 72q5 8 3 15";

/* a five-lobed, serrated leaf behind the cluster, upper left */
const P: Pt = [168, 216]; // petiole joint
const lobeAngles = [-178, -132, -88, -44, -6].map((d) => (d * TAU) / 360);
const leafOutline: Pt[] = (() => {
  const rand = mulberry32(13);
  const pts: Pt[] = [];
  const a0 = (-208 * TAU) / 360;
  const a1 = (22 * TAU) / 360;
  const N = 150;
  for (let i = 0; i <= N; i++) {
    const a = lerp(a0, a1, i / N);
    // lobes peak at the lobe angles; sinuses between
    let lobe = 0;
    for (const la of lobeAngles) lobe = Math.max(lobe, Math.pow(Math.max(0, Math.cos((a - la) * 2.2)), 1.6));
    const R = 150 * (0.5 + 0.5 * lobe) * (i % 3 === 0 ? 1.04 : 0.99) * (0.97 + rand() * 0.03);
    pts.push([P[0] + Math.cos(a) * R, P[1] + Math.sin(a) * R * 0.92]);
  }
  pts.push(P);
  return pts;
})();
const leafShape = rel(leafOutline, true);
const veins = (() => {
  let d = "";
  lobeAngles.forEach((la, i) => {
    const R = 140;
    const tip: Pt = [P[0] + Math.cos(la) * R, P[1] + Math.sin(la) * R * 0.92];
    const mid: Pt = [lerp(P[0], tip[0], 0.5) + Math.sin(la) * 6, lerp(P[1], tip[1], 0.5) - Math.cos(la) * 6];
    d += `M${P[0]} ${P[1]}Q${r1(mid[0])} ${r1(mid[1])} ${r1(tip[0])} ${r1(tip[1])}`;
    // secondary veins, alternating
    for (let k = 1; k <= 3; k++) {
      const t = 0.25 + k * 0.18;
      const bx = lerp(P[0], tip[0], t);
      const by = lerp(P[1], tip[1], t);
      const side = k % 2 ? 1 : -1;
      const off = la + side * 0.85;
      const len = 34 * (1 - t * 0.5);
      d += `M${r1(bx)} ${r1(by)}q${r1(Math.cos(off) * len * 0.5 + Math.cos(la) * 4)} ${r1(Math.sin(off) * len * 0.5 + Math.sin(la) * 4)} ${r1(Math.cos(off) * len + Math.cos(la) * 10)} ${r1(Math.sin(off) * len + Math.sin(la) * 10)}`;
    }
    void i;
  });
  return d;
})();
const petiole = "M168 216q30 -40 60 -100";

/* tendrils */
const tendrils =
  smooth([[318, 76], [340, 96], [352, 128], [366, 150]], false, 0.8) +
  smooth(spiral(376, 166, 14, 3, 2.2, -2.2, 1, 36), false, 0.8) +
  smooth([[62, 104], [44, 128], [38, 150]], false, 0.8) +
  smooth(spiral(30, 158, 9, 2, 1.8, -0.6, -1, 28), false, 0.8);

export function GrapesPlate(p: PlateProps) {
  const { id } = p;
  const full = p.detail === "full";
  const url = (k: string) => `url(#${id(k)})`;
  const contour = { vectorEffect: "non-scaling-stroke", style: { strokeWidth: "var(--engrave-line)" } } as const;
  const clusterMask = berries.map((b) => `M${r1(b.cx - b.r)} ${r1(b.cy)}a${r1(b.r)} ${r1(b.r)} 0 1 0 ${r1(2 * b.r)} 0a${r1(b.r)} ${r1(b.r)} 0 1 0 ${r1(-2 * b.r)} 0Z`).join("");
  return (
    <>
      <defs>
        <ShadeMasks id={id} />
        <path id={id("leaf")} d={leafShape} />
        <Hatch id={id("h1")} angle={34} spacing={2.7} weight={0.7} />
        <Hatch id={id("h2")} angle={-46} spacing={3.1} weight={0.6} />
        <Hatch id={id("h3")} angle={70} spacing={3.6} weight={0.55} />
        <mask id={id("behind")} maskUnits="userSpaceOnUse" x="0" y="0" width="420" height="600">
          <rect width="420" height="600" fill="white" />
          <path d={clusterMask} fill="black" />
          <path d={stalk.shape} fill="black" />
        </mask>
      </defs>
      <Duo
        p={p}
        w={GRAPES_W}
        h={GRAPES_H}
        base={
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* leaf, behind the cluster */}
            <g mask={url("behind")}>
              <use href={`#${id("leaf")}`} {...contour} />
              <path d={veins} strokeWidth="0.8" />
              <path d={petiole} strokeWidth="1.2" />
              {full && <use href={`#${id("leaf")}`} fill={url("h3")} stroke="none" opacity="0.55" />}
              <use href={`#${id("leaf")}`} fill={url("h1")} stroke="none" mask={url("shade")} />
              {full && <use href={`#${id("leaf")}`} fill={url("h2")} stroke="none" mask={url("core")} />}
            </g>
            {/* cane and stalk */}
            <path d={cane.sides} {...contour} />
            <path d={caneLines} strokeWidth="0.7" />
            {full && <path d={knots} strokeWidth="0.9" />}
            <path d={stalk.sides} {...contour} />
            <path d={stalkLines + pedicels} strokeWidth="0.8" />
            {/* berries */}
            <path d={berryLight} strokeWidth="0.55" />
            <path d={berryHeavy} strokeWidth={full ? 1.05 : 0.8} />
            <path d={berryOutline} {...contour} />
            {full && <path d={berryNavel} strokeWidth="0.7" />}
          </g>
        }
        hi={
          <g fill="none" strokeLinecap="round">
            <path d={tendrils} vectorEffect="non-scaling-stroke" style={{ strokeWidth: "var(--engrave-line)" }} />
          </g>
        }
      />
    </>
  );
}

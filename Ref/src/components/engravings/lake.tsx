/**
 * Lake St. Moritz toward the Maloja peaks — a veduta in three depths.
 * Far: snow peaks, shade facets in steep hatch, fall-line hachures. Mid: a closer range in
 * medium hatch. Near: forested shores in stone-pine ticks. Below: ruled water, denser toward
 * the viewer, with the shores reflected as broken dashes. Highlights: the waterline and glints.
 */

import { Duo, Hatch, lerp, mulberry32, r1, rel, type PlateProps, type Pt } from "./kit";

export const LAKE_W = 1600;
export const LAKE_H = 420;
const WL = 300; // waterline

/** Midpoint displacement between control points (x stays monotonic): a rugged crest. */
function rugged(ctrl: readonly Pt[], seed: number, amp: number, depth = 2): Pt[] {
  const rand = mulberry32(seed);
  let pts: Pt[] = ctrl.slice();
  let a = amp;
  for (let d = 0; d < depth; d++) {
    const next: Pt[] = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      next.push([(x0 + x1) / 2 + (rand() - 0.5) * a * 0.6, (y0 + y1) / 2 + (rand() - 0.5) * a]);
      next.push(pts[i]);
    }
    pts = next;
    a *= 0.5;
  }
  return pts;
}

/** y of a polyline at x (linear). */
function yAt(pts: readonly Pt[], x: number) {
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (x <= pts[i][0]) {
      const t = (x - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0] || 1);
      return lerp(pts[i - 1][1], pts[i][1], t);
    }
  }
  return pts[pts.length - 1][1];
}

const below = (pts: readonly Pt[], base: number) => `${rel(pts)}V${base}H${r1(pts[0][0])}Z`;

/* ——— geometry (computed once per server process) ——— */

const farCtrl: Pt[] = [
  [-10, 150], [60, 130], [118, 112], [172, 97], [214, 106], [258, 80], [300, 64], [342, 84], [388, 101], [438, 96],
  [482, 118], [528, 134], [588, 123], [640, 104], [688, 88], [731, 70], [772, 92], [814, 116], [862, 131], [912, 125],
  [962, 110], [1002, 96], [1044, 106], [1090, 90], [1131, 80], [1176, 99], [1232, 119], [1292, 133], [1352, 122],
  [1404, 139], [1462, 150], [1524, 145], [1610, 158],
];
const far = rugged(farCtrl, 11, 9);

const midCtrl: Pt[] = [
  [-10, 168], [90, 150], [170, 160], [250, 177], [330, 170], [420, 190], [500, 206], [565, 221], [625, 233], [700, 240],
  [780, 237], [860, 231], [930, 222], [1000, 209], [1080, 196], [1150, 187], [1230, 171], [1300, 160], [1380, 170],
  [1460, 156], [1540, 150], [1610, 160],
];
const mid = rugged(midCtrl, 23, 7);

/** Shade facets: from each summit down its right-hand (lower-right) flank to the next saddle. */
function facets(ctrl: readonly Pt[], line: readonly Pt[], drop: number, seed: number) {
  const rand = mulberry32(seed);
  let d = "";
  for (let i = 1; i < ctrl.length - 1; i++) {
    const [sx, sy] = ctrl[i];
    if (!(sy < ctrl[i - 1][1] && sy < ctrl[i + 1][1])) continue;
    let j = i + 1;
    while (j < ctrl.length - 1 && ctrl[j + 1][1] > ctrl[j][1]) j++;
    const [ex, ey] = ctrl[j];
    const edge = line.filter(([x]) => x > sx && x < ex);
    const dp = Math.min(drop, 300 - sy);
    // the lower edge wanders back toward the summit; the fall line is broken rock, not a ruler
    const lower: Pt[] = [];
    for (let k = 0; k <= 4; k++) {
      const t = k / 4;
      lower.push([lerp(ex, sx + dp * 0.28, t) + (rand() - 0.5) * 8, lerp(ey + dp * 0.3, sy + dp * 0.95, t) + (rand() - 0.5) * 10]);
    }
    for (let k = 1; k <= 5; k++) {
      const t = k / 6;
      lower.push([sx + dp * 0.28 * (1 - t) + (rand() - 0.5) * 9, sy + dp * 0.95 * (1 - t)]);
    }
    d += rel([[sx, sy], ...edge, [ex, ey], ...lower], true);
  }
  return d;
}
const farFacets = facets(farCtrl, far, 120, 71);
const midFacets = facets(midCtrl, mid, 70, 73);

/* near shores: a spiky line of tree tops over a sloping bank */
function shore(from: number, to: number, bank: (x: number) => number, seed: number): Pt[] {
  const rand = mulberry32(seed);
  const pts: Pt[] = [];
  let x = from;
  while (x <= to) {
    const b = bank(x);
    pts.push([x, b + 3 + rand() * 3]);
    const w = 3 + rand() * 3;
    pts.push([x + w, b - 6 - rand() * 9]); // a crown tip
    x += w * 2 + rand() * 3;
  }
  return pts;
}
const leftBank = (x: number) => lerp(226, WL, Math.pow(Math.min(1, Math.max(0, x / 600)), 1.35));
const rightBank = (x: number) => lerp(WL, 230, Math.pow(Math.min(1, Math.max(0, (x - 1000) / 600)), 0.75));
const nearL = shore(-10, 600, leftBank, 5);
const nearR = shore(996, 1610, rightBank, 7);

/* fall-line hachures from each summit, heavier on the shade side */
function hachures(pts: readonly Pt[], seed: number, depth: number) {
  const rand = mulberry32(seed);
  let d = "";
  for (let i = 2; i < pts.length - 2; i++) {
    const [x, y] = pts[i];
    if (!(y < pts[i - 1][1] && y < pts[i + 1][1] && y < pts[i - 2][1] && y < pts[i + 2][1])) continue;
    const n = 5 + Math.floor(rand() * 4);
    for (let k = 0; k < n; k++) {
      const side = k / (n - 1);
      const sx = x + 2 + side * 34;
      const sy = yAt(pts, sx) + 2;
      const len = depth * (0.45 + rand() * 0.55) * (1 - side * 0.35);
      const lean = 6 + side * 14;
      d += `M${r1(sx)} ${r1(sy)}q${r1(lean * 0.3)} ${r1(len * 0.55)} ${r1(lean)} ${r1(len)}`;
    }
    for (let k = 0; k < 2; k++) {
      const sx = x - 6 - k * 11;
      const sy = yAt(pts, sx) + 3;
      d += `M${r1(sx)} ${r1(sy)}q-2 ${r1(depth * 0.2)} -5 ${r1(depth * 0.36)}`;
    }
  }
  return d;
}
const farHachures = hachures(far, 31, 46);
const midHachures = hachures(mid, 37, 30);

/* stone pines on every other crown tip: a stem and one chevron */
function pines(pts: readonly Pt[], seed: number) {
  const rand = mulberry32(seed);
  let d = "";
  for (let i = 1; i < pts.length; i += 2) {
    if (rand() < 0.35) continue;
    const [x, y] = pts[i];
    const h = 10 + rand() * 7;
    const w = 3.4 + rand() * 1.8;
    d += `M${r1(x)} ${r1(y)}v${r1(h)}m${r1(-w)} ${r1(-h * 0.45)}l${r1(w)} -3l${r1(w)} 3`;
  }
  return d;
}
const nearPines = pines(nearL, 41) + pines(nearR, 43);

/* ruled water: a few long strokes per row; spacing tightens toward the viewer */
function water(seed: number) {
  const rand = mulberry32(seed);
  let back = "";
  let front = "";
  let y = WL + 5;
  while (y < LAKE_H + 2) {
    const t = (y - WL) / (LAKE_H - WL);
    let x = -10 + rand() * 60;
    let row = "";
    while (x < LAKE_W + 10) {
      const dash = lerp(60, 520, Math.pow(t, 0.9)) * (0.4 + rand() * 1.2);
      const end = Math.min(LAKE_W + 10, x + dash);
      row += `M${r1(x)} ${r1(y)}H${r1(end)}`;
      x = end + lerp(70, 10, t) * (0.4 + rand());
    }
    if (t < 0.4) back += row;
    else front += row;
    y += lerp(9, 3, Math.pow(t, 0.75));
  }
  return { back, front };
}
const waterRows = water(53);

/* the shores and the mid range mirrored in the water (compressed) */
const mirror = (pts: readonly Pt[], k: number): Pt[] => pts.map(([x, y]) => [x, WL + (WL - y) * k] as Pt);
const reflL = `${rel(mirror(nearL, 0.9))}L600 ${WL}H-10Z`;
const reflR = `${rel(mirror(nearR, 0.9))}L1610 ${WL}H996Z`;
const reflMid = `${rel(mirror(mid.filter(([x]) => x > 520 && x < 1080), 0.6))}L1080 ${WL}H520Z`;

/* waterline (highlight), broken where the light catches it */
const waterline = `M-10 ${WL}H232M262 ${WL}H742M766 ${WL}H1208M1236 ${WL}H1610`;
/* each glint is a short run of fine, tapering dashes (light broken by ripples), never a solid bar */
const glints = [
  [640, 334, 46],
  [884, 352, 30],
  [1128, 318, 58],
  [1010, 392, 70],
]
  .map(([x, y, w]) => {
    const dashes = [
      [0, 0.34],
      [0.44, 0.7],
      [0.8, 0.92],
    ];
    return dashes.map(([a, b]) => `M${r1(x + a * w)} ${y}h${r1((b - a) * w)}`).join("");
  })
  .join("");

/* cloud wisps: a few long horizontal strokes, as the ruling machine would leave them */
const wisps = [
  [200, 52, 300], [250, 58, 260], [320, 64, 150],
  [980, 36, 260], [1030, 42, 300], [1110, 48, 150],
  [1380, 70, 160], [1420, 76, 110],
]
  .map(([x, y, w]) => `M${x} ${y}q${r1(w / 2)} -1.5 ${w} 0`)
  .join("");

export function LakePlate(p: PlateProps) {
  const { id } = p;
  const full = p.detail === "full";
  const url = (k: string) => `url(#${id(k)})`;
  const ref = (k: string) => `#${id(k)}`;
  const box = { maskUnits: "userSpaceOnUse", x: -10, y: -10, width: 1620, height: 440 } as const;
  return (
    <>
      <defs>
        <path id={id("farS")} d={below(far, WL)} />
        <path id={id("midS")} d={below(mid, WL)} />
        <path id={id("nearL")} d={below(nearL, WL + 1)} />
        <path id={id("nearR")} d={below(nearR, WL + 1)} />
        <Hatch id={id("farH")} angle={0} spacing={4.2} weight={0.5} />
        <Hatch id={id("farF")} angle={64} spacing={3.3} weight={0.6} />
        <Hatch id={id("midH")} angle={-5} spacing={3.3} weight={0.62} />
        <Hatch id={id("midF")} angle={52} spacing={2.8} weight={0.62} />
        <Hatch id={id("nearH")} angle={0} spacing={2.3} weight={0.95} />
        <Hatch id={id("nearX")} angle={-58} spacing={2.8} weight={0.7} />
        <Hatch id={id("refl")} angle={0} spacing={2} weight={0.8} />
        <linearGradient id={id("strata")} gradientUnits="userSpaceOnUse" x1="0" y1="90" x2="0" y2="230">
          <stop offset="0.25" stopColor="black" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient id={id("deep")} gradientUnits="userSpaceOnUse" x1="0" y1={WL} x2="0" y2={WL + 70}>
          <stop offset="0" stopColor="white" />
          <stop offset="1" stopColor="black" />
        </linearGradient>
        <mask id={id("mFar")} {...box}>
          <use href={ref("farS")} fill={url("strata")} />
          <use href={ref("midS")} fill="black" />
        </mask>
        <mask id={id("mFarFacet")} {...box}>
          <use href={ref("farS")} fill="white" />
          <use href={ref("midS")} fill="black" />
        </mask>
        <mask id={id("mOpen")} {...box}>
          <rect x="-10" y="-10" width="1620" height="440" fill="white" />
          <use href={ref("midS")} fill="black" />
        </mask>
        <mask id={id("mMid")} {...box}>
          <use href={ref("midS")} fill="white" />
          <use href={ref("nearL")} fill="black" />
          <use href={ref("nearR")} fill="black" />
        </mask>
        <mask id={id("mRefl")} {...box}>
          <path d={reflL} fill={url("deep")} />
          <path d={reflR} fill={url("deep")} />
          <path d={reflMid} fill={url("deep")} opacity="0.55" />
        </mask>
        <clipPath id={id("cWater")}>
          <rect x="-10" y={WL + 1} width="1620" height="140" />
        </clipPath>
      </defs>
      <Duo
        p={p}
        w={LAKE_W}
        h={LAKE_H}
        base={
          <g>
            {full && <path d={wisps} fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.6" />}
            {/* far range: snow above, strata below, shade facets, fall lines */}
            <rect x="-10" y="60" width="1620" height="250" fill={url("farH")} mask={url("mFar")} opacity="0.8" />
            <path d={farFacets} fill={url("farF")} mask={url("mFarFacet")} />
            <g mask={url("mOpen")} fill="none" stroke="currentColor">
              <path d={farHachures} strokeWidth="0.75" strokeLinecap="round" />
              <path d={rel(far)} vectorEffect="non-scaling-stroke" style={{ strokeWidth: "var(--engrave-fine)" }} />
            </g>
            {/* mid range */}
            <rect x="-10" y="130" width="1620" height="180" fill={url("midH")} mask={url("mMid")} />
            {full && <path d={midFacets} fill={url("midF")} mask={url("mMid")} />}
            <g mask={url("mMid")}>
              <path d={midHachures} fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
            </g>
            <path d={rel(mid)} fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke" style={{ strokeWidth: "var(--engrave-line)" }} />
            {/* near: forested shores */}
            <use href={ref("nearL")} fill={url("nearH")} />
            <use href={ref("nearR")} fill={url("nearH")} />
            {full && (
              <>
                <use href={ref("nearL")} fill={url("nearX")} opacity="0.6" />
                <use href={ref("nearR")} fill={url("nearX")} opacity="0.6" />
              </>
            )}
            <path d={nearPines} fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
            <g fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke" style={{ strokeWidth: "var(--engrave-line)" }}>
              <path d={rel(nearL)} vectorEffect="non-scaling-stroke" />
              <path d={rel(nearR)} vectorEffect="non-scaling-stroke" />
            </g>
            {/* water */}
            <g clipPath={url("cWater")} fill="none" stroke="currentColor" strokeLinecap="round">
              <path d={waterRows.back} strokeWidth="0.6" />
              <path d={waterRows.front} strokeWidth="0.85" />
              <rect x="-10" y={WL} width="1620" height="90" fill={url("refl")} stroke="none" mask={url("mRefl")} />
            </g>
          </g>
        }
        hi={
          <g fill="none" strokeLinecap="round">
            {p.waterline !== false && <path d={waterline} vectorEffect="non-scaling-stroke" style={{ strokeWidth: "var(--engrave-line)" }} />}
            <path d={glints} vectorEffect="non-scaling-stroke" style={{ strokeWidth: "var(--engrave-fine)" }} opacity="0.7" />
          </g>
        }
      />
    </>
  );
}

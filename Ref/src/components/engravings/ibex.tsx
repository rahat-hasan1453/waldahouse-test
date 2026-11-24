/**
 * Alpine ibex (Steinbock) in profile, facing left, on a faceted rock.
 * Scimitar horns with transverse ridges; body modelled with contour lines that follow the
 * barrel, neck and haunch, cross-hatched into the shade (lower right); the rock cut in
 * planes of different hatch angle. Highlights: the horn ridges and the rock's top edge.
 */

import { contourHatch, Duo, Hatch, mulberry32, r1, rel, sampleSpline, ShadeMasks, smooth, taper, type PlateProps, type Pt } from "./kit";

export const IBEX_W = 480;
export const IBEX_H = 600;

const bodyPts: Pt[] = [
  [66, 246], [59, 255], [61, 267], [76, 276], [98, 281], [118, 285], [132, 298], [143, 318], [152, 338], [164, 356],
  [184, 368], [232, 377], [290, 381], [340, 377], [368, 366], [392, 352], [404, 330], [405, 308], [412, 300], [402, 292],
  [380, 287], [330, 283], [270, 283], [224, 273], [192, 256], [164, 232], [150, 214], [138, 203], [120, 203], [106, 211],
  [90, 226], [75, 239],
];
const body = smooth(bodyPts, true, 0.85);

/* horns: the near horn and, a little behind, the far one */
const hornC: Pt[] = [[128, 204], [132, 166], [146, 128], [174, 96], [214, 74], [260, 66], [302, 76], [332, 100], [346, 130], [350, 156]];
const horn = taper(hornC, 28, 5, 32);
const farHorn = taper(
  hornC.map(([x, y]) => [x + 13, y + 6] as Pt),
  24,
  5,
  32,
);

/* ridges across the front of the near horn */
function ridges() {
  let d = "";
  const n = horn.c.length;
  for (let i = 2; i < n * 0.8; i += 1.4) {
    const k = Math.round(i);
    const u = horn.upper[k];
    const l = horn.lower[k];
    const reach = 0.7 - (k / n) * 0.3;
    const mx = u[0] + (l[0] - u[0]) * reach;
    const my = u[1] + (l[1] - u[1]) * reach;
    const t = horn.dir[k];
    d += `M${r1(u[0])} ${r1(u[1])}Q${r1((u[0] + mx) / 2 + Math.cos(t) * 3)} ${r1((u[1] + my) / 2 + Math.sin(t) * 3)} ${r1(mx)} ${r1(my)}`;
  }
  return d;
}
const hornRidges = ridges();
const hornShade = contourHatch(horn.upper, horn.lower, 4, { samples: 22, from: 0.6, to: 0.95, seed: 5, compact: true });
const farHornLines = contourHatch(farHorn.upper, farHorn.lower, 3, { samples: 22, from: 0.3, to: 0.9, seed: 6, compact: true });

/* legs (width profile per joint): near legs in front of the body, far legs behind it */
const legNearFore = taper([[196, 340], [192, 380], [188, 412], [186, 440], [185, 458], [184, 468]], [30, 22, 15, 10, 12, 12], 0, 24);
const legFarFore = taper([[222, 352], [224, 390], [226, 418], [228, 446], [229, 458], [230, 468]], [24, 18, 13, 9, 11, 11], 0, 24);
const legNearHind = taper([[374, 338], [377, 376], [387, 402], [391, 421], [386, 444], [381, 458], [380, 468]], [44, 28, 18, 13, 10, 11, 12], 0, 30);
const legFarHind = taper([[346, 352], [348, 384], [356, 405], [359, 422], [354, 446], [350, 458], [349, 468]], [30, 20, 15, 11, 9, 10, 11], 0, 30);
const legs = [legFarFore, legFarHind, legNearFore, legNearHind];
const legLines = legs
  .map((l, i) => contourHatch(l.upper, l.lower, i < 2 ? 3 : 4, { samples: 16, from: 0.38, to: 0.9, ease: (t) => Math.pow(t, 0.7), seed: 9 + i, compact: true }))
  .join("");
const hooves = [184, 230, 380, 349]
  .map((x) => `M${x - 8} 474L${x - 5} 466H${x + 6}L${x + 8} 474Z`)
  .join("");

/* body modelling: contour lines along the barrel, neck, shoulder and haunch */
const barrel = contourHatch(
  [[200, 270], [262, 285], [330, 286], [396, 296]],
  [[178, 366], [240, 380], [312, 382], [374, 366]],
  14,
  { samples: 18, from: 0.1, to: 1, ease: (t) => Math.pow(t, 0.6), jitter: 0.8, seed: 21, compact: true },
);
const neck = contourHatch(
  [[148, 214], [176, 244], [214, 270]],
  [[112, 286], [138, 306], [156, 344]],
  9,
  { samples: 12, from: 0.2, to: 0.96, ease: (t) => Math.pow(t, 0.7), jitter: 0.6, seed: 23, compact: true },
);
const shoulder = contourHatch(
  [[226, 276], [216, 318], [206, 360]],
  [[178, 292], [170, 326], [174, 358]],
  4,
  { samples: 10, from: 0.15, to: 0.9, seed: 25, compact: true },
);
const haunch = contourHatch(
  [[404, 302], [410, 334], [398, 362]],
  [[346, 300], [340, 336], [356, 370]],
  6,
  { samples: 12, from: 0.05, to: 0.7, seed: 27, compact: true },
);
const face = contourHatch(
  [[74, 240], [92, 224], [110, 210]],
  [[70, 270], [96, 280], [122, 284]],
  4,
  { samples: 10, from: 0.4, to: 0.92, seed: 29, compact: true },
);
const eye = "M106 226q6 -4 11 0q-5 4 -11 0Z";
const ear = "M146 214q14 -8 26 -6q-10 8 -24 12";
const detailLines = "M64 250q3 -2 5 1M62 266q7 2 14 0M112 234q8 10 4 22";

/* the goatee */
const beard = (() => {
  const rand = mulberry32(41);
  let d = "";
  for (let k = 0; k < 9; k++) {
    const x = 76 + k * 2.6;
    const len = 18 + rand() * 14 - Math.abs(k - 3) * 2;
    d += `M${r1(x)} ${r1(276 + k * 0.6)}q${r1(-2 - rand() * 2)} ${r1(len / 2)} ${r1(-4 + rand() * 2)} ${r1(len)}`;
  }
  return d;
})();

/* the rock, in planes */
const rockOutline: Pt[] = [
  [30, 604], [34, 522], [68, 488], [120, 473], [200, 470], [270, 475], [330, 470], [400, 472], [442, 486], [470, 522], [484, 604],
];
const planes: { pts: Pt[]; hatch: string; cross?: string }[] = [
  { pts: [[68, 488], [120, 473], [200, 470], [270, 475], [330, 470], [400, 472], [442, 486], [362, 495], [262, 499], [160, 495]], hatch: "rTop" },
  { pts: [[34, 522], [68, 488], [160, 495], [178, 542], [118, 574], [30, 604]], hatch: "rLeft" },
  { pts: [[160, 495], [262, 499], [272, 550], [178, 542]], hatch: "rFront" },
  { pts: [[262, 499], [362, 495], [374, 562], [272, 550]], hatch: "rShade", cross: "rCross" },
  { pts: [[362, 495], [442, 486], [470, 522], [484, 604], [374, 604], [374, 562]], hatch: "rDeep", cross: "rCross" },
  { pts: [[30, 604], [118, 574], [178, 542], [272, 550], [374, 562], [374, 604]], hatch: "rBase" },
];
const planeEdges = "M68 488L160 495L262 499L362 495L442 486M160 495L178 542L118 574M178 542L272 550L374 562L374 604M262 499L272 550M362 495L374 562";
const rockTop = rel(sampleSpline(rockOutline.slice(1, 10), 3));
const cracks = "M210 510l8 14l-3 12M300 520l10 10M412 530l-8 20l6 16M96 540l14 -8M232 566l18 6";
const grass = (() => {
  const rand = mulberry32(47);
  let d = "";
  for (const [x0, y0] of [[48, 510], [118, 474], [446, 490]] as Pt[]) {
    for (let k = 0; k < 7; k++) {
      const x = x0 + k * 3;
      const h = 8 + rand() * 12;
      d += `M${r1(x)} ${y0}q${r1((rand() - 0.5) * 6)} ${r1(-h / 2)} ${r1((rand() - 0.3) * 8)} ${r1(-h)}`;
    }
  }
  return d;
})();

export function IbexPlate(p: PlateProps) {
  const { id } = p;
  const full = p.detail === "full";
  const url = (k: string) => `url(#${id(k)})`;
  const contour = { vectorEffect: "non-scaling-stroke", style: { strokeWidth: "var(--engrave-line)" } } as const;
  return (
    <>
      <defs>
        <ShadeMasks id={id} />
        <path id={id("body")} d={body} />
        <path id={id("horn")} d={horn.shape} />
        <Hatch id={id("h1")} angle={32} spacing={2.8} weight={0.7} />
        <Hatch id={id("h2")} angle={-48} spacing={3.1} weight={0.65} />
        <Hatch id={id("rTop")} angle={2} spacing={5.5} weight={0.55} />
        <Hatch id={id("rLeft")} angle={62} spacing={3.4} weight={0.65} />
        <Hatch id={id("rFront")} angle={18} spacing={4.2} weight={0.6} />
        <Hatch id={id("rShade")} angle={-34} spacing={2.7} weight={0.75} />
        <Hatch id={id("rDeep")} angle={-62} spacing={2.3} weight={0.8} />
        <Hatch id={id("rBase")} angle={8} spacing={3} weight={0.7} />
        <Hatch id={id("rCross")} angle={28} spacing={3.2} weight={0.6} />
        <clipPath id={id("cBody")}>
          <use href={`#${id("body")}`} />
        </clipPath>
        <mask id={id("mBehind")} maskUnits="userSpaceOnUse" x="0" y="0" width="480" height="600">
          <rect width="480" height="600" fill="white" />
          <use href={`#${id("body")}`} fill="black" />
          <use href={`#${id("horn")}`} fill="black" />
          <path d={legNearFore.shape + legNearHind.shape} fill="black" />
        </mask>
        <mask id={id("mBody")} maskUnits="userSpaceOnUse" x="0" y="0" width="480" height="600">
          <rect width="480" height="600" fill="white" />
          <path d={legNearFore.shape + legNearHind.shape} fill="black" />
          <use href={`#${id("horn")}`} fill="black" />
        </mask>
      </defs>
      <Duo
        p={p}
        w={IBEX_W}
        h={IBEX_H}
        base={
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* rock */}
            {planes.map((pl, i) => (
              <g key={i}>
                <path d={rel(pl.pts, true)} fill={url(pl.hatch)} stroke="none" />
                {full && pl.cross && <path d={rel(pl.pts, true)} fill={url(pl.cross)} stroke="none" opacity="0.7" />}
              </g>
            ))}
            <path d={planeEdges} strokeWidth="0.9" />
            <path d={rel(rockOutline)} {...contour} />
            {full && <path d={cracks} strokeWidth="1.1" />}
            <path d={grass} strokeWidth="0.8" />
            {/* far side: horn and legs behind the body */}
            <g mask={url("mBehind")}>
              <path d={farHorn.outline} {...contour} />
              <path d={farHornLines} strokeWidth="0.7" />
              <path d={legFarFore.sides + legFarHind.sides} {...contour} />
              <path d={legFarFore.shape + legFarHind.shape} fill={url("h1")} stroke="none" />
            </g>
            {/* body */}
            <g mask={url("mBody")}>
              <g clipPath={url("cBody")}>
                <path d={barrel + neck + shoulder + haunch} strokeWidth="0.75" />
                <path d={face} strokeWidth="0.65" />
                <use href={`#${id("body")}`} fill={url("h1")} stroke="none" mask={url("shade")} />
                {full && <use href={`#${id("body")}`} fill={url("h2")} stroke="none" mask={url("core")} />}
              </g>
              <use href={`#${id("body")}`} {...contour} />
            </g>
            <path d={eye} fill="currentColor" strokeWidth="0.6" />
            <path d={detailLines} strokeWidth="0.8" />
            <path d={ear} {...contour} />
            <path d={beard} strokeWidth="0.75" />
            {/* near legs */}
            <path d={legNearFore.sides + legNearHind.sides} {...contour} />
            <path d={legLines} strokeWidth="0.7" />
            <path d={legNearFore.shape + legNearHind.shape} fill={url("h2")} stroke="none" mask={url("shade")} />
            <path d={hooves} fill="currentColor" fillOpacity="0.55" {...contour} />
            {/* near horn */}
            <path d={horn.outline} {...contour} />
            <path d={hornShade} strokeWidth="0.75" />
          </g>
        }
        hi={
          <g fill="none" strokeLinecap="round">
            <path d={hornRidges} strokeWidth="1.2" />
            <path d={rockTop} vectorEffect="non-scaling-stroke" style={{ strokeWidth: "var(--engrave-line)" }} />
          </g>
        }
      />
    </>
  );
}

/**
 * Guilloche (banknote / spirits-label engine turning).
 * Rosette: a hypotrochoid emitted as exact cubic Béziers (Hermite from the analytic tangent),
 * so it stays smooth at any size with very little markup. Wave: parallel phase-shifted sines.
 * Stroke is currentColor; the parent sets the opacity (6–14%).
 */

const f1 = (n: number) => Math.round(n * 10) / 10;

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}

/** x=(R−r)cos t + d·cos((R−r)t/r), y=(R−r)sin t − d·sin((R−r)t/r), t ∈ [0, 2πr/gcd(R,r)]. */
export function rosettePath(R: number, r: number, d: number, perLoop = 3) {
  const k = (R - r) / r;
  const T = (2 * Math.PI * r) / gcd(R, r);
  const loops = R / gcd(R, r);
  const n = Math.round(loops * perLoop);
  const P = (t: number) => [(R - r) * Math.cos(t) + d * Math.cos(k * t), (R - r) * Math.sin(t) - d * Math.sin(k * t)] as const;
  const D = (t: number) => [-(R - r) * Math.sin(t) - d * k * Math.sin(k * t), (R - r) * Math.cos(t) - d * k * Math.cos(k * t)] as const;
  const h = T / n;
  let [px, py] = P(0);
  let out = `M${f1(px)} ${f1(py)}`;
  for (let i = 0; i < n; i++) {
    const t0 = i * h;
    const t1 = t0 + h;
    const [dx0, dy0] = D(t0);
    const [dx1, dy1] = D(t1);
    const [x1, y1] = P(t1);
    // relative cubic: control points from the tangents (Hermite → Bézier)
    const c1x = (dx0 * h) / 3;
    const c1y = (dy0 * h) / 3;
    const c2x = x1 - px - (dx1 * h) / 3;
    const c2y = y1 - py - (dy1 * h) / 3;
    out += `c${f1(c1x)} ${f1(c1y)} ${f1(c2x)} ${f1(c2y)} ${f1(x1 - px)} ${f1(y1 - py)}`;
    // advance by the rounded step so the relative path never drifts
    px += f1(x1 - px);
    py += f1(y1 - py);
  }
  return out + "Z";
}

/** Parallel sines across a w×h field, each line phase-shifted. */
export function wavePath(w: number, h: number, lines = 12, amp = 3.2, period = 40, phase = 0.19) {
  let out = "";
  for (let i = 0; i < lines; i++) {
    const y = (h * (i + 0.5)) / lines;
    const x0 = -period * ((i * phase) % 1) - period;
    out += `M${f1(x0)} ${f1(y)}q${period / 4} ${-amp} ${period / 2} 0`;
    for (let x = x0 + period / 2; x < w + period; x += period / 2) out += `t${period / 2} 0`;
  }
  return out;
}

export const ROSETTE_A = { R: 60, r: 13, d: 42 } as const;
export const ROSETTE_B = { R: 60, r: 17, d: 38 } as const;

export function Guilloche({
  variant,
  className = "",
  layers = 3,
  seed = 0,
  preset = "a",
}: {
  variant: "rosette" | "wave";
  className?: string;
  /** rosette: copies, each turned 4° */
  layers?: number;
  /** rosette: starting turn in degrees; wave: phase shift */
  seed?: number;
  preset?: "a" | "b";
}) {
  if (variant === "rosette") {
    return (
      <svg aria-hidden focusable="false" viewBox="-100 -100 200 200" className={`pointer-events-none ${className}`}>
        <g fill="none" stroke="currentColor" strokeWidth="0.5">
          {Array.from({ length: layers }, (_, i) => (
            <use key={i} href={`#wh-rosette-${preset}`} x="-100" y="-100" width="200" height="200" transform={`rotate(${seed + i * 4})`} />
          ))}
        </g>
      </svg>
    );
  }
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 400 100" preserveAspectRatio="none" className={`pointer-events-none ${className}`}>
      <path d={wavePath(400, 100, 12, 3.2, 40, 0.19 + seed * 0.01)} fill="none" stroke="currentColor" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

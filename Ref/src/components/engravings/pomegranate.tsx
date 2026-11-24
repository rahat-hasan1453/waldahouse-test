/**
 * A pomegranate branch (ref 9): the original engraving, used as drawn. The artwork is black
 * line on white; an SVG filter turns white to transparent and the line to currentColor, so it
 * takes the house gold (or any ink passed to <Engraving color>) like every other plate.
 */

import type { PlateProps } from "./kit";

export const POMEGRANATE_W = 564;
export const POMEGRANATE_H = 841;

export function PomegranatePlate(p: PlateProps) {
  const { id } = p;
  return (
    <>
      <defs>
        <filter id={id("ink")} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          {/* alpha = darkness of the line (1 − luminance); colour discarded */}
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.2126 -0.7152 -0.0722 0 1"
            result="line"
          />
          <feFlood style={{ floodColor: "currentColor" }} result="ink" />
          <feComposite in="ink" in2="line" operator="in" />
        </filter>
      </defs>
      <image
        href="/engravings/pomegranate.png"
        width={POMEGRANATE_W}
        height={POMEGRANATE_H}
        filter={`url(#${id("ink")})`}
        opacity={p.highlight ? p.inkOpacity : 1}
      />
    </>
  );
}

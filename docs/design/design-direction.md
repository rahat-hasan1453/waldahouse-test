# Waldhaus am See: Design Direction

> **Single source of truth for design intent** across Figma, Stitch, mockups and code.
> **Code source of truth for token values:** the `@theme` blocks in `/Users/arshad/Desktop/Waldhaus Hotels/site/src/app/globals.css`. This document mirrors them. If the two ever disagree, `globals.css` wins, and this document is corrected.
> **Rule:** never hardcode colours, fonts, durations or spacing. Always reference a token name.
> **Build spec for the elevation:** `docs/design/elevation-spec.md`.
> **References:** `docs/references/` (index in its README). Refs 1–8 = `moodboard/01…08`; ref 9 = `brand/pomegranate-engraving.png`; ref 12 = `layout/lasala-plaza-hero.webp`; ref 13 = `brand/waldhaus-logo.png`; ref 15 = `brand/devils-place-grapes.svg`; ref 16 = `layout/reservation-ticket-lean.webp`. **Original design (pristine):** `docs/design/original-baseline/`. **Current elevated build:** `Ref.` (working project). **Frozen snapshot:** `site/` (2026-09-29).

## Essence

**Modern, elegant, minimal = restraint around craft.**

Deep saturated grounds, one metallic accent, spaced uppercase type, and a single richly detailed element per view. That element may be ornate because everything around it is quiet. Heritage is made modern through composition, not by stripping things away.

## Principles

1. **One hero per view.** One focal element; everything else whispers (ref 1).
2. **Space is the luxury.** Generous negative space and sparse copy (ref 6).
3. **Extreme scale contrast.** Huge display type or numerals set next to small, widely spaced caps (refs 1, 7).
4. **Ornament as texture.** Line-engraving illustration in one colour, tone on tone (refs 2, 4, 5).
5. **Metal sparingly.** Gold foil only for accents, display type, rules and monograms. One living foil per view.
6. **Details for a second look.** Thin rules, small monograms, cropped type (refs 1, 6, 7).
7. **A modular identity.** One emblem and one type system across the sub-brands (ref 8).

**Elevation layer:** a printed object that catches the light. The motion verbs are *ink draws, light travels, plates reveal*. Full rules are in `elevation-spec.md` §12.

## Tokens

Names are semantic, so values can be swapped without touching usage. The values below are the original design's (`Ref.`), mirrored from `globals.css`.

### Colour (`--color-*`)

| Token | Value | Role |
|---|---|---|
| `ink` | `#0a1c17` | Body text on light; darkest ground (heroes, night, final CTA) |
| `forest` | `#0f2e27` | Primary deep ground (`.cloth`) |
| `pine` | `#16423a` | Tone-on-tone ornament on light; dark buttons (hover); spa figures |
| `emerald` | `#1f5a4c` | Deeper tone-on-tone on cloth |
| `sage` | `#a8c1b4` | Soft tint; success messages on dark |
| `mist` | `#d7e2db` | Pale tint |
| `cream` | `#f4ede0` | Main light surface (`.paper`); text on dark |
| `parchment` | `#ebe1ce` | Warm light tint |
| `linen` | `#faf6ee` | Lightest surface (page background, cards, menu, form) |
| `gold` | `#c49a5a` | The accent: ornaments, rules, selection |
| `gold-light` | `#e4c68f` | Accent on dark grounds: eyebrows, figures, links |
| `gold-deep` | `#9c7338` | Accent on light grounds: eyebrows, figures, prices |
| `copper` | `#b5773f` | Foil stop (inside the gold foil gradient); whisky warmth |
| `burgundy` | `#2e0a15` | Secondary deep ground (`.velvet`) |
| `wine` | `#5a1427` | Tone-on-tone ornament on velvet / light |
| `claret` | `#7a1c35` | Wine-cellar accent on light (Cave Waldhaus); errors on light |

**Derived tokens** (additive, from `elevation-spec.md` §3; the originals above never change):
- `gold-ink` `#86612c`: gold text under 24px on light, meeting AA (4.8:1 on cream).
- `gold-seal` `#d4b079`.
- `foil-highlight` `#f1dcae` and `foil-glint` `#e9cf9c`: the original foil stops.
- `foil-shadow`.
- `ink-muted` and `cream-muted`: micro labels at AA.
- `rule-ink` and `rule-gold` (each with a `-strong` variant), and `rule-cream`.
- `error-on-dark` `#e7a3ae`.

**Metal:**
- `.foil`: the gradient `gold-deep → gold-light → gold → foil-highlight → copper → gold-light` at 115°, with a deeper variant on light grounds.
- `.foil-bg`: primary buttons.
- `.metal`: flat gold for supporting numerals.

### Typography

| Token / class | Value | Use |
|---|---|---|
| `--font-display` | Marcellus (fallback Optima, serif) | Headlines, numerals, wordmarks: `.display` |
| `--font-serif` | Cormorant Garamond 400/500/600, roman and italic (fallback Garamond) | Reserved; no longer used for body text since 2026-11-16 |
| `--font-sans` | Jost 300/400/500 (fallback Futura, system-ui) | Labels, nav, eyebrows, UI: `.eyebrow` |
| `.eyebrow` | Jost 0.7rem, tracking 0.38em, uppercase, 500 | Section labels |
| `.display` | Marcellus, uppercase, tracking 0.06em, line-height 1.02 | All display type |
| `.editorial` | Jost 300, upright | Leads, body and running text, captions in prose (since 2026-11-16) |

- **Scale:** high-contrast clamps (home h1 `clamp(3rem,9vw,8.5rem)` down to labels at 0.7rem). The full list of protected sizes is in `elevation-spec.md` §2.1.
- **Cascade note:** the type classes are unlayered, so they override Tailwind utilities. Every eyebrow renders at 0.7rem and every display at 0.06em / 1.02, whatever utilities sit beside them.
- **New roles** (additive): `.caption` (Jost 0.6rem, 0.3em), `.figure`, `.chapter-numeral`, `.colossal` (cropped, one per page), `.initial` (drop cap), and `text-numeral` / `text-numeral-xl`.

### Surfaces

| Surface | Class | Ground | Used for |
|---|---|---|---|
| Paper | `.paper` | cream plus a fine dot texture (plus laid lines and grain in the elevation) | Editorial light sections: welcome, story, spa, rooms, contact, Cave |
| Linen | `bg-linen` | linen | Lists and objects: rooms carousel, services, lounge, facts, menu card, form card |
| Cloth | `.cloth` | forest bookcloth weave | The house's signature ground: Devil's Place, whisky hero and regions, weekly package, events, heritage timeline, activities, footer, mobile menu, 404 |
| Velvet | `.velvet` | burgundy with a wine glow | Dining and celebration: Eat & Drink, Stübli, cigar lounge and shop, the NYE card, the Forbes quote |
| Ink | `bg-ink` | ink, usually under photography | Heroes, heritage strip, final CTA, scrolled header |

**Audience mapping:**
- Stay → paper, linen and cloth.
- Dine & Drink → velvet (dining) and cloth (whisky), with gold.
- Wine → paper with a claret accent.
- Celebrate & Meet → velvet and cloth.
- Heritage → ink and cloth.

**Surface scopes.** Each surface declares `--surface`, `--accent-ink`, `--metal`, `--foil`, `--rule` and `--focus-ring`, so shared components adapt automatically. See `elevation-spec.md` §3.3.

### Ornament

| Token | Value |
|---|---|
| `ornament.style` | Line engraving, single ink, tone on tone; optional gold-foil highlight strokes (ref 2). Inline SVG. |
| `ornament.subjects` | Lake St. Moritz and Maloja peaks, Swiss stone pine, Alpine ibex, thistle, grapevine, gentian, pomegranate (ref 9; Devil's Place) |
| `ornament.rule` | Hairline (1px) rules in gold; dotted rules and dot leaders; the lozenge as the shared mark |
| `ornament.label` | Ref 3 vocabulary: roundel fact badges, label plates with scooped corners, tickets with notches, guilloche fields |

### Motion

| Token | Value |
|---|---|
| Easing | `--ease-silk` (the original curve) · `--ease-settle` · `--ease-curtain` · `--ease-exit` |
| Durations | `--dur-*` from 250ms (quick) to 2.8s (candle); Ken Burns 22s |
| Grammar | eyebrow → title lines → ornament → lead → actions (`--seq-*`); heroes use `--intro-*` |

All motion is disabled or collapsed under `prefers-reduced-motion`.

### Identity system

One emblem family and one type system, with stacked, horizontal and compact lockups for Waldhaus am See, Devil's Place, Cave Waldhaus and Fondue Stübli. Each brand is distinguished by its emblem frame: square, roundel, vault arch and gable. See `elevation-spec.md` §4.19.

## Changelog

- 2026-09-28: Initial direction from references 1–8.
- 2026-09-28: Synced to original design (Ref.) tokens; elevation spec added. The tokens section now mirrors `site/src/app/globals.css` (16 colours, three families, four surfaces, the type classes) instead of the earlier placeholder palette. `docs/design/elevation-spec.md` adds derived tokens, surface scopes, primitives, motion and page-level rules.
- 2026-09-29: Elevation built in `site/` per `elevation-spec.md` (foundation + all pages). Visual QA fixes: home hero ticket kept above the fold on short desktop viewports; lake-plate glints broken into fine dashes; mobile booking ticket button wraps cleanly, nights label shown from `sm` up. Pristine original snapshot: `docs/design/original-baseline/`.
- 2026-09-29: New engraving plate `pomegranate`: the ref 9 artwork used as drawn (`public/engravings/pomegranate.png`), recoloured by an SVG filter so its line takes `currentColor` (white drops out). Replaces the thistle behind the home page's Devil's Place section, inked in `gold-light` at 20%, 376×560 in the lower right under the section's photo.
- 2026-09-29: Home Devil's Place: the whisky-shelf photo is replaced by a silent video sequence (`public/video/devils-place.mp4` then `devils-place-2.mp4`, cross-fading, looping) via `AmbientVideo` (same `.photo` frame, curtain and 3:4 box; plays only on screen; paused under reduced motion).
- 2026-09-29: Home Devil's Place: "2,500" no longer bleeds off the left edge; it sits on the text column's left line, sized `clamp(6rem,16vw,15rem)` (max 240px, was 272px) so it always fits its column.
- 2026-09-29: Home Rooms & Suites cards → `RoomGallery` (ref: screen recording): desktop (fine pointer, motion allowed) pins the section and scroll moves a curved row; cards tilt in perspective (±24°) and turn flat at centre; the centre/hovered card reveals description, price and size; ring cursor; progress thread. Phones/tablets/reduced motion: swipe row with details always shown. Header (eyebrow, title, lead, arrows, "All rooms & prices") unchanged.
- 2026-09-29: Home hero recomposed after ref 12 (Lasala Plaza): full-bleed film of the house (`public/video/hero.mp4`, poster `hero-poster.jpg`) under an ink grade with a darker centre; centred location line + the same headline; lead, plate frame and Pl. I caption removed; booking ticket docked bottom centre (max 1120px), the 2,500+ seal as a solid badge on its corner. Header logo hides over `#hero` and fades in after it.
- 2026-09-29: Home hero: house logo (`public/brand/waldhaus-logo.png`, ref 13) centred above the headline in a 200×200 box (renders 200×121); the 2,500+ seal badge removed from the hero; spacing tightens on screens ≤820px tall.
- 2026-09-29: Home hero headline reduced to `clamp(2.75rem,7.6vw,7.25rem)` (was `clamp(3rem,9vw,8.5rem)`), at the owner's request. Hero film is now `hero-loop.mp4`: the clip forwards then reversed (turn frames dropped), 19.9 s, no audio, 3.6 MB, looping natively.
- 2026-09-30: Booking ticket: native date inputs replaced by `StayCalendar` (one range picker for arrival → departure): ink panel, gold hairlines, foil discs on the chosen days, gold wash across the nights, hover preview, Monday-first weeks, past days struck through, 18 months ahead; two months from md, one on phones; opens above the ticket, or below where space is short; full keyboard support (arrows, PageUp/Down, Home/End, Enter, Escape).
- 2026-09-30: Devil's Place emblem: the DP ligature inside the horned roundel is replaced by the owner's grape-cluster glyph (ref 15, `docs/references/brand/devils-place-grapes.svg`), filled in currentColor at 1.15× in the ring.
- 2026-09-30: Booking ticket leans back in 3D (ref 16): `rotateX(var(--ticket-tilt))` = 18deg over `--ticket-perspective` = 1200px, pivoting on its bottom edge, md+ only (flat on phones); it turns flat on hover, focus and while the stay calendar is open (the calendar never tilts). Tablet: the CTA label wraps up to lg so the guests field is not clipped.
- 2026-09-30: Hero film replaced by the drone flight (source `Downloads/Drone Shot/videoplayback.webm`, 2560×1440 50 fps, 91 s, 135 MB): segment 3.0–8.5 s at 0.5× (50 fps → 25 fps real frames, no interpolation), 1080p lanczos + light sharpen, light temporal denoise, forwards then reversed (turn frames dropped) = 21.9 s loop, no audio. Files: `hero-drone-1080.webm` (VP9 2-pass, 5.0 MB), `hero-drone-1080.mp4` (H.264 2-pass, 6.8 MB, fallback), `hero-drone-720.mp4` (3.1 MB, phones / data-saver), poster `hero-drone-poster.jpg`. `HeroVideo` now takes `sources` and picks the file in the browser.
- 2026-09-30: Home Welcome ("A house with its own character"): the large plate is now the owner's autumn photo of the house across the lake (`public/images/welcome-lake-autumn.jpg`, 1200×1370, 286 KB; `images.welcomeAutumn`), caption "Pl. II — The house across the lake, autumn". The small mounted inset is unchanged.
- 2026-09-30: New plate modifier `.photo.push-in`: a slow Ken Burns push (scale 1 → `--zoom-push`, default 1.12) over `--dur-kenburns` (22 s), linear, starting as the curtain lifts, then holding; paused until revealed, off under reduced motion. Applied to the Welcome autumn plate.
- 2026-09-30: Hero film is now the full drone flight, forwards only (reverse loop removed at the owner's request): whole 91 s source at 0.5× = 2:59.88, with a 2 s crossfade from the last shot into the first baked in, so the loop is seamless. `hero-drone-full-1080.webm` (VP9 2-pass 1.1 Mbps, 24.8 MB), `hero-drone-full-1080.mp4` (H.264 1.6 Mbps, 36.1 MB), `hero-drone-full-720.mp4` (0.8 Mbps, 18.0 MB, phones), poster `hero-drone-full-poster.jpg`. `HeroVideo` uses `preload="metadata"` so the long film streams instead of downloading up front.
- 2026-09-30: Header: phone number and Reserve button hidden on the home page only (the hero carries the booking ticket); other pages and the mobile menu keep them.
- 2026-09-30: Header layout: chapters (Stay · Dine · Whisky & Wine · Spa & Alps · Heritage) left-aligned, EN | DE (+ phone/Reserve off home) right-aligned. Over the home hero the hidden logo collapses (max-width 0), so "Stay" sits on the 40px page gutter; past the hero the logo slides back in and the chapters follow it.
- 2026-10-01: English | German. The EN | DE switch in the header (now also in the mobile menu) translates the whole site in place. Copy lives in SELISE Blocks Localization (modules `common`, `home`, `stay`, `dine`, `whisky-wine`, `spa`, `heritage`, `contact`; cultures `en-US`, `de-DE`). Pages are still rendered in English (crawlers, first paint); German loads on demand via `/api/i18n/de` and the choice is remembered. Dates follow the language (`de-CH`). German text hyphenates (`html:lang(de)`), so long compounds never overflow a phone.
- 2026-11-16: Body font: Jost. The `.editorial` class (leads, body, running text, captions) moves from Cormorant Garamond italic to Jost 300 upright, and form fields follow it. Headlines stay Marcellus (`.display`), labels and nav stay Jost (`.eyebrow`). `--font-serif` (Cormorant) is kept as a token but is no longer used for text. Requires Asgar's go-ahead per the project rule; the Welcome section was previewed in Jost before this change.

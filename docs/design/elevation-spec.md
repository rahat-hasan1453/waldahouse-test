# Waldhaus am See: Elevation Spec

> **Status:** Build spec. Final call by the creative director, synthesising three proposals: A (Material & Craft), B (Cinematic Motion) and C (Editorial Composition & Identity).
> **Scope:** `/Users/arshad/Desktop/Waldhaus Hotels/site` only. `Ref.` is the pristine original and is never edited.
> **Companion docs:** `docs/design/design-direction.md` (essence, principles, token mirror) and `docs/research/waldhaus-audit.md` (facts and risks).
> **Keywords:** **MUST** is required. **SHOULD** is expected unless it breaks something. **MAY** is optional polish.

---

## 0. Verdict on the three concepts

A single brief runs through all three: *the website is a printed object of the house that catches the light.* Each concept supplied one layer of it. A supplied the material, B the time and C the page.

| Taken | From | Why |
|---|---|---|
| Inline-SVG engraving library behind the existing `<Engraving>` API | A, C | Every engraving currently 404s (`site/public` does not exist), so the ornament layer the design relies on is invisible. This is the single biggest lift. |
| Surface scopes (`--surface`, `--accent-ink`, `--rule`, `--foil`, …) | A | Primitives become tone-aware automatically, and all hardcoded hexes go. |
| Foil census, with a flat-metal role for supporting numerals | A, C | Foil is used 26+ times, so none of it reads as precious. |
| Living foil: light travels across it with scroll | A, B | Foil only exists because it catches light (refs 1, 7). |
| Motion tokens, JS-gated reveals, a sequence grammar, line-mask headings, photo curtains | B | Motion that feels authored, and content that is never hidden without JS. |
| Counter on "2,500" | B | It is the hero asset. It counts once and is SSR-safe. |
| Candlelight entrance on the whisky hero | B | Mood with no gimmick; CSS only. |
| Heritage spine that draws as you read | B | Time made visible; CSS scroll timeline. |
| Emblem and lockup system for four brands | A, C | Ref 8; principle 7. |
| Plates, captions, chapter numerals, drop caps, colossal cropped numerals, colophon footer | C | Heritage made modern through composition (refs 6, 7). |
| Ticket booking bar and ticket rate card, fact badges, label plates, dot leaders, frames with fleurons | A, C | The ref 3 label vocabulary. |
| Letterhead inquiry form and wax-seal success | A, C | The one conversion page becomes the most personal. |

| Dropped | Why |
|---|---|
| Copper foil for Devil's Place (A) | It changes how colour applies in that section. Gold stays the only foil metal; copper stays a stop inside it. Deferred to Asgar. |
| Full-screen desktop Index replacing dropdowns (C) | It changes navigation behaviour. Instead, dropdowns become crafted menu cards. |
| "Register" replacing the rooms carousel (C) | It replaces the user's composition. The carousel is elevated instead. |
| Hero veils parting (B) | The veils hide the lake, which is the product. The plate frame draws on instead. |
| Site-wide Folio grid mandate (C) | Too much churn. Container tokens and an optional `.folio` utility ship instead. |
| Side section index, running head, page transitions, header hide-on-scroll, scroll cue, digit roll, cursor FoilLight, deckled edge, specular-lighting filter, open-now dot, timetable graphic, live summary slip, service pictograms, cask heads, "CDIV", seal scroll-rotation, room-to-hero morph | Each is either gimmicky, heavy, a second mover in the same view, or needs a config change or server restart. Restraint is the brief. |
| Auto-scrolling awards marquee | It loops forever (WCAG 2.2.2, and principle "nothing loops"). Replaced by a static Distinctions band. |

---

## 1. Elevation thesis

**Keep the voice, and add the fourth dimension: light.** The original is right about everything that matters: deep grounds, one metal, spaced caps, Cormorant italics. What it lacks is the physical truth of the objects it quotes. Foil that never catches light. Engravings that never render. Labels without a label's craft.

The elevation turns every surface into real stock (paper, bookcloth, velvet) and every accent into a real process: hot-foil stamping, line engraving, blind deboss, letterpress, guilloche.

Time is added with the same restraint. **Ink draws** (hairlines, frames, ornaments). **Light travels** (across foil, only as the page moves). **Plates are revealed** (curtains in the section's own colour).

Every view keeps one foil hero and one mover. Everything else becomes quieter than it is today, so that the one thing that shines feels like the eleventh sky.

---

## 2. Invariants (must not change)

### 2.1 Type scale (HC1)

- **Families:** `--font-display: var(--font-marcellus), "Optima", serif` · `--font-serif: var(--font-cormorant), "Garamond", serif` · `--font-sans: var(--font-jost), "Futura", system-ui, sans-serif`.
- **Loaded weights:** Marcellus 400 · Cormorant Garamond 400/500/600, normal and italic · Jost 300/400/500.
- **Class definitions, byte for byte:**
  - `.eyebrow{font-family:var(--font-sans);font-size:.7rem;letter-spacing:.38em;text-transform:uppercase;font-weight:500}`
  - `.display{font-family:var(--font-display);text-transform:uppercase;letter-spacing:.06em;line-height:1.02;font-weight:400}`
  - `.editorial{font-family:var(--font-serif);font-style:italic;font-weight:400}`
- **Every size in use stays.** None of these values may change:
  - **Headings:** `clamp(3rem,9vw,8.5rem)` (home h1) · `clamp(3rem,8vw,7.5rem)` (whisky h1) · `clamp(2.6rem,7vw,6rem)` (PageHero h1) · `clamp(2.6rem,7vw,5.5rem)` (contact h1) · `clamp(2.4rem,6vw,5rem)` (final CTA) · `clamp(2.2rem,5vw,4.2rem)` (events) · `clamp(2.2rem,4.5vw,3.8rem)` · `clamp(2.2rem,4.5vw,3.6rem)` · `clamp(2rem,4.6vw,3.6rem)` (SectionHeading) · `clamp(2rem,4vw,3.2rem)` · `clamp(2rem,3.5vw,3rem)` (NYE h3) · `clamp(1.9rem,3.4vw,2.8rem)` (room h2) · `clamp(1.8rem,3vw,2.4rem)` (form title) · `clamp(1.6rem,3.4vw,2.9rem)` (Devil's h2).
  - **Numerals and seal:** `clamp(6rem,19vw,17rem)` ("2,500") · `clamp(1.4rem,3.2vw,2.2rem)` (seal centre).
  - **Leads:** `clamp(1.3rem,2vw,1.7rem)` · `clamp(1.3rem,2vw,1.6rem)` · `clamp(1.25rem,2vw,1.6rem)` · `clamp(1.2rem,1.8vw,1.45rem)`.
  - **Fixed sizes:** body sizes `1.4rem`, `1.35rem`, `1.3rem`; label sizes `0.5rem` to `1.05rem`; every Tailwind `text-*` size currently on an element.
- **Cascade contract.** This is critical and easy to break. `.eyebrow`, `.display`, `.editorial`, `.foil`, `.foil-bg`, `.paper`, `.cloth`, `.velvet`, `.field`, `.reveal` and `.link-underline` are **unlayered** and sit after `@import "tailwindcss"`. Unlayered CSS beats Tailwind's `@layer utilities`. As a result:
  - every `text-[0.55rem]` and similar on an `.eyebrow` is inert, so all eyebrows render at 0.7rem;
  - every `tracking-[…]` and `leading-[…]` on a `.display` is inert, so all display text renders at 0.06em / 1.02. That includes the logo's `tracking-[0.16em]` and the "2,500"'s `leading-[0.85]`.

  **That is the rendered scale the client loves, and it is what we keep.** So:
  - **MUST NOT** move these classes into any `@layer`.
  - **MUST NOT** "fix" the inert utilities.
  - New role classes go in `@layer components`, so utilities can override them. The only new unlayered rules are the surface-scope variable declarations and the AA override in §3.4.

### 2.2 Colour application (HC2)

- **The 16 colour tokens keep their hex values:**
  - ink `#0a1c17` · forest `#0f2e27` · pine `#16423a` · emerald `#1f5a4c` · sage `#a8c1b4` · mist `#d7e2db`
  - cream `#f4ede0` · parchment `#ebe1ce` · linen `#faf6ee`
  - gold `#c49a5a` · gold-light `#e4c68f` · gold-deep `#9c7338` · copper `#b5773f`
  - burgundy `#2e0a15` · wine `#5a1427` · claret `#7a1c35`
- **Every section keeps its surface:**

  | Page | Section → surface |
  |---|---|
  | Home | hero → ink · USP → paper · Welcome → paper · Devil's Place → cloth · Stay → linen · Eat & Drink → velvet · Spa → paper · Heritage strip → ink · Seasonal → paper with a velvet card · Final CTA → ink |
  | Stay | hero → ink · rooms → paper · package → cloth · services → linen |
  | Room detail | hero → ink · body → paper with a cloth aside · more rooms → linen |
  | Dine | hero → ink · restaurant → paper with a linen menu card · Stübli → velvet · lounge → linen · events → cloth |
  | Whisky & Wine | hero → cloth · story → paper · regions → cloth · cigar/shop → velvet · Cave → paper with a claret accent |
  | Spa | hero → ink · body → paper with a cloth stat box · activities → cloth |
  | Heritage | hero → ink · family → paper · timeline → cloth · facts → linen |
  | Contact | hero → ink · body → paper with a linen card, cloth and linen aside |
  | Global | 404 → cloth · footer → cloth · mobile menu → cloth · scrolled header → ink/92 |

- **Gold stays the accent in the same roles:**
  - eyebrows: gold-deep on light, gold-light on dark;
  - ornaments: `--color-gold` on every surface;
  - seals: `#d4b079`, becoming `--color-gold-seal`;
  - foil display spans and primary buttons (`.foil-bg`);
  - rules and hairlines;
  - Cave keeps its claret accent; the home and whisky-story stat numerals keep gold-light / gold-deep; the spa `dl` keeps pine.
- **Derived tokens only** (§3). The single perceptible shift is an accessibility fix: gold text **smaller than 24px on light grounds** renders in `--color-gold-ink` (`#86612c`, a deeper gold-deep) instead of gold-deep, which moves 3.66:1 up to 4.80:1 on cream. It is the same role and the same hue family. Flagged for Asgar (§17).

### 2.3 Content (HC3)

- `src/lib/site.ts` existing exports are frozen. Additive exports are listed in §15.
- New micro-copy is limited to: plate captions (existing alt text only), chapter numerals, letter date, "No. 0n", nights count and "One moment…".
- Captions **never** make claims about stock photographs. Write nothing like "towards Maloja" under a Pexels lake.

---

## 3. Tokens to add (`src/app/globals.css`)

Nothing below edits the existing `@theme` block, except that `--animate-slow-zoom` may read its duration from a token (the value stays 22s).

### 3.1 `@theme static`: utility-generating tokens (additive)

```css
@theme static {
  /* colour — derived; the 16 originals are untouched */
  --color-gold-ink: #86612c;          /* gold text <24px on light: 4.80:1 cream, 5.18:1 linen */
  --color-gold-seal: #d4b079;         /* migrated from <Seal> */
  --color-foil-highlight: #f1dcae;    /* migrated from .foil stop */
  --color-foil-glint: #e9cf9c;        /* migrated from .foil-bg stop */
  --color-foil-shadow: color-mix(in oklab, var(--color-gold-deep) 70%, var(--color-ink));
  --color-ink-muted: color-mix(in oklab, var(--color-ink) 66%, transparent);     /* ≥5.1:1 on cream */
  --color-cream-muted: color-mix(in oklab, var(--color-cream) 62%, transparent); /* ≥5.4:1 on forest */
  --color-rule-ink: color-mix(in oklab, var(--color-ink) 15%, transparent);
  --color-rule-ink-strong: color-mix(in oklab, var(--color-ink) 32%, transparent);
  --color-rule-gold: color-mix(in oklab, var(--color-gold) 25%, transparent);
  --color-rule-gold-strong: color-mix(in oklab, var(--color-gold) 50%, transparent);
  --color-rule-cream: color-mix(in oklab, var(--color-cream) 16%, transparent);
  --color-error-on-dark: #e7a3ae;     /* claret family, 7.1:1 on forest; replaces text-red-300 */

  /* new type roles (existing roles untouched) */
  --text-caption: 0.6rem;
  --text-chapter: 0.95rem;
  --text-numeral: clamp(2rem, 3.2vw, 2.6rem);        /* booking-bar day numerals */
  --text-numeral--line-height: 1;
  --text-numeral-xl: clamp(6rem, 10vw, 9rem);        /* NYE "31" */
  --text-numeral-xl--line-height: 0.85;
  --text-colossal: clamp(9rem, 28vw, 26rem);         /* cropped colossal type, max 1 per page */
  --text-colossal--line-height: 0.78;

  /* easing */
  --ease-silk: cubic-bezier(0.2, 0.7, 0.1, 1);       /* the original reveal curve, named */
  --ease-settle: cubic-bezier(0.16, 1, 0.3, 1);      /* long weighted landing: lines, frames */
  --ease-curtain: cubic-bezier(0.76, 0, 0.24, 1);    /* symmetrical wipes, curtains, sheen */
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);           /* departures */

  /* depth */
  --shadow-plate: 0 1px 0 color-mix(in oklab, var(--color-ink) 6%, transparent),
                  0 30px 80px -30px color-mix(in oklab, var(--color-ink) 35%, transparent);
  --shadow-mount: 0 24px 50px -28px color-mix(in oklab, var(--color-ink) 45%, transparent);
  --shadow-press: inset 0 1px 0 color-mix(in oklab, var(--color-foil-highlight) 55%, transparent),
                  inset 0 -1px 0 color-mix(in oklab, var(--color-foil-shadow) 50%, transparent);
  --shadow-press-deep: inset 0 2px 3px color-mix(in oklab, var(--color-foil-shadow) 45%, transparent);

  /* layout */
  --container-wide: 1440px;
  --container-content: 1320px;
}
```

### 3.2 `:root`: non-utility tokens

```css
:root {
  /* one light source for foil, sheen, hatching and deboss */
  --light-angle: 115deg;

  /* hairlines & craft geometry */
  --hairline: 1px;
  --hairline-fine: 0.5px;
  --frame-inset: clamp(0.75rem, 1.6vw, 1.5rem);
  --frame-gap: 6px;
  --plate-mount: 10px;
  --notch: 10px;
  --leader-gap: 6px;
  --leader-dot: 0.7px;
  --arrow-length: 28px;
  --arrow-reach: 12px;

  /* durations */
  --dur-quick: 250ms;   --dur-hover: 500ms;   --dur-base: 700ms;
  --dur-reveal: 1100ms; --dur-line: 1100ms;   --dur-curtain: 1400ms;
  --dur-draw: 1600ms;   --dur-sheen: 1400ms;  --dur-stamp: 700ms;
  --dur-count: 2400ms;  --dur-zoom: 1600ms;   --dur-candle: 2800ms;
  --dur-kenburns: 22s;
  --reveal-distance: 28px;
  --zoom-hover: 1.04;
  --stagger: 90ms;
  --stagger-line: 110ms;

  /* sequence grammar (section arrivals) */
  --seq-eyebrow: 0ms; --seq-title: 120ms; --seq-media: 150ms;
  --seq-ornament: 520ms; --seq-lead: 650ms; --seq-actions: 800ms;

  /* intro grammar (above-the-fold heroes, CSS keyframes, no JS) */
  --intro-frame: 200ms; --intro-eyebrow: 500ms; --intro-title: 650ms; --intro-header: 900ms;
  --intro-lead: 1000ms; --intro-seal: 1150ms; --intro-bar: 1300ms; --intro-sheen: 1600ms;

  /* metal */
  --foil-gold: linear-gradient(var(--light-angle), var(--color-gold-deep) 0%, var(--color-gold-light) 22%,
    var(--color-gold) 40%, var(--color-foil-highlight) 55%, var(--color-copper) 75%, var(--color-gold-light) 100%);
  --foil-gold-bg: linear-gradient(var(--light-angle), var(--color-gold-deep) 0%, var(--color-gold-light) 30%,
    var(--color-gold) 55%, var(--color-foil-glint) 80%, var(--color-copper) 100%);
  --foil-gold-on-light: linear-gradient(var(--light-angle), var(--color-foil-shadow) 0%, var(--color-gold-deep) 28%,
    var(--color-gold) 46%, var(--color-gold-light) 55%, var(--color-gold) 64%, var(--color-gold-deep) 82%, var(--color-foil-shadow) 100%);
  --sheen: linear-gradient(var(--light-angle), transparent 38%,
    color-mix(in oklab, var(--color-foil-highlight) 55%, transparent) 50%, transparent 62%);

  /* grain: keyword colours only, no hex in data URIs */
  --grain-dark: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .09 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  --grain-light: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  --grain-size: 220px;
  --laid-lines: repeating-linear-gradient(90deg, color-mix(in oklab, var(--color-ink) 1.6%, transparent) 0 1px, transparent 1px 24px);

  /* layers (current values preserved: menu 40, header 50, toggle 60) */
  --z-raised: 10; --z-sticky-bar: 35; --z-overlay: 40; --z-header: 50; --z-toggle: 60;
}
```

`--dur-kenburns` feeds the existing `--animate-slow-zoom: slow-zoom var(--dur-kenburns) ease-out forwards` (still 22s).

### 3.3 Surface scopes (unlayered, variables only)

```css
/* 1 — full LIGHT set (every light selector gets every variable) */
:root, .paper, .bg-cream, .bg-parchment, .bg-linen, .surface-light, .surface-linen {
  --surface: var(--color-cream);       --surface-raised: var(--color-linen);
  --on-surface: var(--color-ink);      --accent-ink: var(--color-gold-ink);
  --metal: var(--color-gold-deep);     --foil: var(--foil-gold-on-light);
  --rule: var(--color-rule-ink);       --rule-strong: var(--color-rule-ink-strong);
  --rule-accent: var(--color-rule-gold-strong);
  --deboss-hi: color-mix(in oklab, white 75%, transparent);
  --deboss-lo: color-mix(in oklab, var(--color-ink) 14%, transparent);
  --focus-ring: var(--color-gold-ink);
}
/* 2 — full DARK set (every dark selector gets every variable) */
.cloth, .bg-forest, .surface-cloth, .velvet, .surface-velvet, .bg-ink, .surface-ink {
  --surface: var(--color-forest);      --surface-raised: var(--color-pine);
  --on-surface: var(--color-cream);    --accent-ink: var(--color-gold-light);
  --metal: var(--color-gold-light);    --foil: var(--foil-gold);
  --rule: var(--color-rule-gold);      --rule-strong: var(--color-rule-gold-strong);
  --rule-accent: var(--color-rule-gold-strong);
  --deboss-hi: color-mix(in oklab, white 7%, transparent);
  --deboss-lo: color-mix(in oklab, black 45%, transparent);
  --focus-ring: var(--color-gold-light);
}
/* 3 — ground overrides (declared after 1 and 2) */
.bg-linen, .surface-linen { --surface: var(--color-linen);    --surface-raised: var(--color-cream); }
.velvet, .surface-velvet   { --surface: var(--color-burgundy); --surface-raised: var(--color-wine); }
.bg-ink, .surface-ink      { --surface: var(--color-ink);      --surface-raised: var(--color-forest); }
```

- Every scope sets the **full** variable set, because scopes nest. The velvet NYE card sits inside a `.paper` section, and a `bg-linen` menu card sits inside paper.
- The `.surface-*` helpers set variables only, never a background. Use them where the ground comes from a photo or an opacity utility: the header, the hero booking bar and `bg-ink/90` cells.
- `.tempo-calm` (spa) overrides `--dur-reveal:1600ms; --dur-line:1400ms; --stagger:130ms; --dur-kenburns:36s`.

### 3.4 Roles, keyframes and properties

```css
@property --foil-pos { syntax: "<percentage>"; inherits: false; initial-value: 0%; }
@property --glow     { syntax: "<percentage>"; inherits: false; initial-value: 0%; }
```

**Unlayered, in place:**
- `.foil`: `background-image: var(--foil); background-size: 200% 100%; background-position: var(--foil-pos) 50%;` plus the existing clip and transparent colour. At rest it looks identical on dark grounds. On light grounds the highlight no longer washes out, because the old `#f1dcae` stop measured 1.16:1 on cream.
- `.foil-bg`: `background-image: var(--foil-gold-bg)`.
- `.paper`: append `var(--laid-lines), var(--grain-dark)` to its background layers.
- `.cloth` and `.velvet`: append `var(--grain-light)`.
- All existing layers stay.
- AA override:
  ```css
  .eyebrow.text-gold-deep, .caption.text-gold-deep { color: var(--color-gold-ink); }
  ```

**`@layer components` (new roles):**

| Class | Definition |
|---|---|
| `.metal` | `color: var(--metal)`. Flat gold for supporting numerals ≥24px. |
| `.figure` | `font-family: var(--font-display); font-variant-numeric: lining-nums;`. Data numerals; size comes from the existing class. |
| `.letterpress` | `text-shadow: 0 1px 0 var(--deboss-hi)`. |
| `.deboss` | `color: var(--surface); text-shadow: 0 max(1px,.012em) 0 var(--deboss-hi), 0 calc(-1*max(1px,.012em)) 0 var(--deboss-lo)`. Blind, tone on tone. |
| `.foil-emboss` | `display:inline-block; filter: drop-shadow(0 1px 0 var(--deboss-lo))`. Hero numerals only. Verify in Safari; drop the filter if the text clip breaks. |
| `.caption` | Jost, `var(--text-caption)`, `letter-spacing:.3em`, uppercase, 500, `color: var(--accent-ink)`. |
| `.chapter-numeral` | Marcellus, `var(--text-chapter)`, `letter-spacing:.12em`. |
| `.colossal` | Marcellus, `var(--text-colossal)`, `line-height: var(--text-colossal--line-height)`, uppercase, `letter-spacing:.01em`, `pointer-events:none; user-select:none`. |
| `.initial::first-letter` | Marcellus, `float:left; font-size:4.1em; line-height:.8; margin:.06em .12em 0 0; color: var(--metal)`. Add `@supports (initial-letter: 3)` using `initial-letter:3`. |
| `.gilt-edge` | `position:relative`. `::before` is a top hairline painted with `var(--foil-gold)` at 60%. |
| `.perforation-x`, `.perforation-y` | Dotted lines from `radial-gradient(circle, var(--rule-strong) var(--leader-dot), transparent calc(var(--leader-dot) + .2px))` repeated every `var(--leader-gap)`. |
| `.ticket` | `--tear: 50%`. Semicircle notches of radius `var(--notch)` cut at `0 var(--tear)` and `100% var(--tear)` with two `radial-gradient(… transparent 98%, black)` mask layers (keyword `black`, not hex). |
| `.leaders` | Flex baseline row. `.leaders-fill` is `flex:1`, a dotted underline using the perforation recipe, lifted `translate: 0 -.28em`. |
| `.drift`, `.drift-y` | Scroll-linked ornament and depth drift. See §12. |
| `.candlelight` | See §9.5. |
| `.spine`, `.spine-fill` | See §9.7. |
| `.btn*` | See §4.9. |

**Keyframes** (all compositor-only except `foil-*` and `candle`): `foil-travel` (`--foil-pos` 0%→100%), `foil-sheen` (100%→0%, once), `sheen-pass` (translateX −120%→120%), `stamp` (scale 1.12, opacity 0 → scale .985, opacity 1 at 60% → none), `rise` (translateY 105% → none), `fade-up` (12px), `wipe-in` (`clip-path: inset(0 100% 0 0)` → `inset(0)`), `draw-x` (`scale: 0 1` → `1 1`), `draw-y`, `grow-x` (scaleX 0→1), `drift` (`translate: var(--drift-from) 0` → `var(--drift-to) 0`), `drift-y` (`translate: 0 var(--drift-from)` → `0 var(--drift-to)`), `candle` (`--glow` 0%→130%), `crest` (`clip-path: inset(100% 0 0 0)` → `inset(0)`).

**Existing rules to change:**
- `html{scroll-behavior:smooth}` moves inside `@media (prefers-reduced-motion: no-preference)`.
- `.spin-slow` and `rotate-slow` stay defined for compatibility but nothing uses them.
- `.img-zoom:hover img` becomes `scale: var(--zoom-hover)` (the property, not transform) over `var(--dur-zoom) var(--ease-silk)`.

### 3.5 Hex migration (HC5)

| Where | Now | Becomes |
|---|---|---|
| `ui.tsx` Ornament | `#c49a5a` / `#0a1c17` | `var(--color-gold)` / `var(--color-ink)` |
| `ui.tsx` Seal | `#d4b079` / `#16423a` | `var(--color-gold-seal)` / `var(--color-pine)` |
| `globals.css` `.foil` / `.foil-bg` stops | hex values | `--foil-gold`, `--foil-gold-bg` (colour tokens) |
| `.guilloche` data URI | `%23c49a5a` | White mask shape on a pseudo-element with `background-color: var(--color-gold)` at the old 22% alpha. Keep the class name. |
| `select.field` chevron | `%239c7338` | Masked pseudo-element tinted `var(--accent-ink)`, or an inline SVG in the component |
| `.field` border and placeholder | rgba | `var(--color-rule-ink-strong)` (25%→32%, SHOULD) and `var(--color-ink-muted)` |
| Header shadow | `rgba(196,154,90,.25)` | gilt progress hairline (§5) |
| Dine / Contact shadows | rgba arbitrary | `shadow-plate` |
| Newsletter error | `text-red-300` | `text-error-on-dark` |

After the build this must return nothing new:

```
grep -rnE "#[0-9a-fA-F]{3,8}\b|rgba\(" src/components src/app --include=*.tsx
```

---

## 4. Shared primitives

The foundation owns all of these. Pages import them.

**Barrels:**
- `@/components/ui` keeps `Engraving`, `Ornament`, `Seal`, `Button`, `SectionHeading`, `PageHero` and `Photo`, with a backward-compatible API.
- `@/components/craft`: `Frame`, `Lozenge`, `Leaders`, `LabelPlate`, `FactBadge`, `FactBadgeGroup`, `Colossal`, `Chapter`, `Distinctions`, `EngravedArrow`, `WaxSeal`.
- `@/components/identity`: `Emblem`, `Lockup`, `BrandId`.
- `@/components/motion/lines`: `Lines`.
- `@/components/motion/counter`: `Counter`.
- `@/components/reveal`: `Reveal`.
- `@/components/rail-controls`: `RailControls`.

Everything is a server component unless marked **client**.

### 4.1 `CraftDefs`: `components/craft-defs.tsx`, rendered first in `<body>` of `app/layout.tsx`

- A hidden `<svg aria-hidden width="0" height="0" style={{position:"absolute"}}>`. **Never** use `display:none`, because Firefox then drops cross-SVG references.
- Contents, with ids prefixed `wh-`:
  - `wh-foil` and `wh-foil-light`: linear gradients whose stops are set as `style={{ stopColor: "var(--color-gold-deep)" }}` and so on, mirroring `--foil-gold` / `--foil-gold-on-light`;
  - `wh-wax`: a radial gradient from wine to claret;
  - `<symbol id="wh-fleuron">` (a 24×24 corner flourish: L-shaped double hairline, a tiny lozenge and one curl);
  - `<symbol id="wh-lozenge">`;
  - `<symbol id="wh-rosette-a">` and `wh-rosette-b` (from §4.18).
- Budget: 12KB of markup or less.
- **Gotcha:** gradients with `objectBoundingBox` units vanish on perfectly horizontal or vertical strokes, because the bounding box has zero height. Use `gradientUnits="userSpaceOnUse"` for strokes.

### 4.2 Engraving system: `components/engravings/*`, re-exported from `ui.tsx`

```ts
type EngravingName = "ibex" | "lake" | "thistle" | "pine" | "grapes" | "gentian";
Engraving(props: {
  name: EngravingName;
  className?: string;
  color?: string;            // default "var(--color-gold)" (unchanged), becomes SVG currentColor
  style?: CSSProperties;     // legacy mask* keys are stripped silently
  highlight?: boolean;       // duo mode: selected strokes in foil (ref 2)
  inkOpacity?: number;       // base layer opacity for duo mode (default 1)
  fit?: "contain" | "cover"; // replaces maskSize; default contain
  align?: "center" | "bottom" | "top";   // replaces maskPosition
  detail?: "full" | "emblem";            // "emblem" for renders ≤160px: contour + one hatch level
  drift?: boolean;           // scroll-linked ±3% drift (only for ≥400px ornaments)
})
```

- **Rendering.** An outer `<div aria-hidden className={`pointer-events-none select-none ${className}`} style={{ color, ...style }}>`. That is the same box as today, so existing sizing and positioning classes keep working, including `-translate-y-1/2`. Inside it sits `<svg focusable="false" class="h-full w-full">`, with `preserveAspectRatio` mapped from `fit` and `align` (for example, `cover` + `bottom` gives `xMidYMax slice`). Every stroke and fill uses `currentColor`. `drift` animates the **inner** svg, never the outer box, because Tailwind v4 `translate-*` utilities use the same `translate` property.
- **Patterns** are defined **inside each engraving's own `<svg>`**, so `currentColor` resolves. Never put them in `CraftDefs`.
- **Ids** come from `useId()` (allowed in server components) with non-alphanumerics stripped.
- **Highlight strokes** use a local `userSpaceOnUse` foil gradient sized to that viewBox.
- **Duo mode:** do not put a wrapper opacity class on the element. Use `inkOpacity` for the base layer; highlights render at 0.9.
- **Kit** (`engravings/kit.tsx`):
  - `mulberry32(seed)`, a seeded PRNG so output is deterministic and hydration-safe;
  - `<Hatch id angle spacing weight>` pattern (0.6 unit line, 2.4–3.2 gap);
  - cross-hatch by overlaying a second hatch at −angle;
  - `sphereHatch(cx, cy, r)`: 9–12 offset ellipse arcs clipped to a circle for berries and cones;
  - `ridge(points, seed)`: a mountain ridge path with slope hatching, denser on the side away from `--light-angle` (light from the upper left, shade to the lower right);
  - `waterLines(y0, y1, seed)`: horizontal dashed lines, denser toward the shore, with `strokeDasharray` from the PRNG.
- Every stroke gets `vector-effect="non-scaling-stroke"` at 0.6–0.9px.
- **Budget:** 400 elements or fewer per plate. Patterns count once.

**Subjects.** Each is drawn by hand as SVG paths. **Do not download artwork.**

| Name | viewBox | Composition | Highlight strokes |
|---|---|---|---|
| `lake` | 1600×420 | Lake St. Moritz toward the Maloja peaks. Three ridgelines at three depths: far is sparse, mid is medium, near is a forest band of stone-pine ticks. Below is lake water in horizontal line hatching whose density rises toward the foreground, with a peak reflection as broken dashes. | The single waterline and 3–5 glints |
| `pine` | 600×600 | A Swiss stone pine (arolla) branch on a diagonal. Bark in short curved hatching, needles in fans of five, two cones with overlapping scale arcs, and cross-hatched shadow on the lower right. | Cone scale edges |
| `ibex` | 480×600 | An Alpine ibex in profile facing left, standing on a faceted rock. Long, ridged, back-curved horns drawn with transverse ridge strokes; body shaded with contour-following hatch; beard; rock in cross-hatched facets. **Quality gate:** if a naturalistic ibex does not read as an engraving, ship the heraldic Graubünden ibex (a silhouette with interior hatching) instead. | Horn ridges, rock edge |
| `thistle` | 420×900 | A tall thistle. Spiny serrated leaves with a midrib and side hatch; a bulbous head with a diamond cross-hatched involucre; a crown of radiating florets. | Floret tips |
| `grapes` | 420×600 | A vine: a cluster of 18–24 berries using `sphereHatch`, a serrated leaf with veins, and spiral tendrils. | Tendrils |
| `gentian` (SHOULD) | 420×600 | Two trumpet gentians with lanceolate leaves. It falls back to `pine` if not ready. | Petal rims |

**Line weight tuning.** The existing page opacities (0.08–0.25) were set for raster masks. Tune the SVG line weight so those opacities read as "visible at a second look" on their grounds. Page agents may raise an opacity by at most ×1.5.

### 4.3 Foil, metal and impression: the census rule

- **One living foil text per viewport.** Foil stays on four things only:
  - the hero headline span;
  - a section's single display numeral;
  - a price in its own view;
  - colossal type.
- **Buttons.** `.foil-bg` primary buttons are unchanged, with one primary per view.
- **Supporting numerals.** Indices, lists of years, stat grids and course numbers become `.metal` (flat gold: gold-deep on light, gold-light on dark) or `text-gold-ink` when smaller than 24px. **Sizes are unchanged.**
- **Living foil.** Under `prefers-reduced-motion: no-preference` and `@supports (animation-timeline: view())`, every `.foil:not([data-sheen])` gets:
  ```css
  animation: foil-travel linear both;   /* shorthand first */
  animation-timeline: view();
  animation-range: cover 10% cover 90%;
  ```
  The light crosses the letters as they cross the viewport.
- **One-off sheen.** `.foil[data-sheen]` instead plays `foil-sheen` once over `--dur-sheen` with `--ease-curtain` when it is revealed (inside `.is-visible`) or in the intro.
- **Performance.** Background-position repaint is acceptable only because the census keeps living foil to one or two nodes per viewport.

### 4.4 New type roles (additive)

`.caption` · `.figure` · `.chapter-numeral` · `.colossal` · `.initial` · plus the utilities `text-numeral`, `text-numeral-xl` and `text-colossal`, and `.metal`, `.letterpress`, `.deboss` (§3.4).

**Caption contrast:** gold-ink on light is 4.8:1 or better, and gold-light on dark is 8.8:1 or better.

### 4.5 `Reveal`, sequences and `Lines`

```ts
Reveal({ children, delay?: number, className?, as?: ElementType,
         variant?: "fade" | "sequence", threshold?: number })   // client
```

- **Backward compatible.** `delay` is written as `--reveal-delay: {delay}ms`.
- **Shared observers.** One `IntersectionObserver` per options key (a module-level `Map`), not one per element. The element gets `.is-visible` once. If it is already in view on mount, it gets it immediately.
- **JS gating.** The root layout injects this into `<head>`:
  ```js
  document.documentElement.classList.add('js');
  try { sessionStorage.getItem('wh-intro') && document.documentElement.classList.add('intro-seen');
        sessionStorage.setItem('wh-intro','1') } catch(e) {}
  ```
  Add `suppressHydrationWarning` on `<html>`. All hidden states are written as `.js .reveal:not(.is-visible) …`, so **content is visible without JS**.
- **`fade`** (classes `reveal`) is the original block motion: 28px, 1.1s, `--ease-silk`.
- **`sequence`** (classes `reveal reveal-seq`) has no block motion: `.js .reveal.reveal-seq { opacity: 1; transform: none }`. Children tagged `data-seq="eyebrow|title|ornament|lead|actions|media"` (plus optional `style={{"--i": n}}`) animate at `calc(var(--reveal-delay) + var(--seq-*) + var(--i,0) * var(--stagger))`:
  - eyebrow: `wipe-in`;
  - lead and actions: `fade-up` 12px;
  - ornament: its own draw;
  - media: Photo curtains.
- **Rule:** any block that contains `Lines` or `data-seq` children uses `variant="sequence"`.

```ts
Lines({ children: ReactNode, mode?: "reveal" | "intro" })
```

- Server component. It walks the children:
  - each word becomes `<span class="line-mask"><span class="line-inner" style="--line:n">word</span></span>` (spaces are kept as text);
  - `<br/>` is kept and increments `n`;
  - **any element child** (for example `<span className="foil">`) is wrapped **whole** in one mask and never split, so a foil gradient never restarts per word.
- It outputs `<span className="sr-only">{plainText}</span><span aria-hidden>{split}</span>`.
- CSS:
  - `.line-mask{display:inline-block;overflow:clip;padding-block:.14em;margin-block:-.14em}`;
  - hidden state `translateY(105%)`;
  - transition `--dur-line` with `--ease-settle`, delayed by `--seq-title + --line * --stagger-line`;
  - `mode="intro"` uses the `rise` keyframe with `--intro-title` instead.
- It does not change the heading's size, tracking or line-height.

### 4.6 `Photo` (plates and curtains): `ui.tsx`

```ts
Photo({ src, alt, className?, plate?: string /* "I", "II" … */, caption?: string | false,
        curtain?: "up" | "down" | "left" | "right" | "none" /* default "up" */,
        mount?: boolean /* cream mount, --plate-mount, inner deboss line, shadow-mount */ })
```

- **Markup.** Renders `<figure>` when `plate` or `caption` is set, otherwise `<div class="photo">`. The caption reads `Pl. {plate} — {caption ?? alt}` in `.caption`, right-aligned under a 2rem `--rule` hairline.
- **No hover zoom by default.** Zoom lives only in `a:hover .photo img, a:focus-visible .photo img { scale: var(--zoom-hover) }`, so it appears only where a click exists.
- **Curtain.** `::after` in `var(--surface)`, with a 1px `--color-gold` leading edge on the side it travels toward.
  - Its covered state exists **only** as `.js .reveal:not(.is-visible) .photo[data-curtain]::after`, so photos outside a `Reveal` are never covered.
  - It lifts over `--dur-curtain` with `--ease-curtain` at `--seq-media`.
  - The image settles `transform: scale(1.12) → none` over `calc(var(--dur-curtain) * 1.2)`.
- **Composition rules.** Entrance uses `transform`, hover uses `scale`, drift uses `translate`. They compose.
- **Captions per page:** 2–4 key editorial photos only. Never on cards.

### 4.7 `Ornament`: `ui.tsx`

```ts
Ornament({ className?, tone?: "gold" | "ink", variant?: "full" | "short", draw?: boolean /* default true */ })
```

- **`full`** is today's 220×14 mark with tokenised colours.
- **`short`** is new: a 120×14 mark with a lozenge at the start, a 96px rule running right and a terminal dot. It is for left-aligned headings.
- **Draw.** Inside a revealed ancestor, the rules grow outward from the lozenge with `pathLength="1"` and dashoffset 1→0 (the left rule is drawn from x=92 to 0), and the lozenge scales in from 0.6 over 1.2s at `--seq-ornament`. It renders drawn with no JS and under reduced motion.

### 4.8 `Seal`: `ui.tsx`

```ts
Seal({ top, bottom, center, sub?, className?, tone?: "gold" | "ink",
       variant?: "line" | "emboss", emblem?: BrandId, spin?: boolean /* deprecated, ignored */ })
```

- **Static.** `spin` becomes a no-op, so light moves and the seal does not.
- **Entrance:** the outer circle draws over `--dur-draw` (`pathLength`), then the whole seal `stamp`s over `--dur-stamp`.
- **`emblem`** replaces `center` text with the brand emblem, while `sub` stays.
- **`variant="emboss"`** renders a blind notary emboss: the seal drawn three times in `var(--surface)` with hi/lo copies offset ±0.6 units. It has no colour, only light and shadow. The centre text stays in `.foil` (the one foil).

### 4.9 `Button` and `.btn*`: `ui.tsx` plus globals

```ts
Button({ href, children, variant?: "gold" | "outline-light" | "outline-dark" | "dark" | "quiet-light" | "quiet-dark",
         className?, arrow?: boolean /* default true */ })
```

- **Shared classes.** `.btn` (the current layout: `eyebrow inline-flex gap-3 px-7 py-4 text-[0.68rem]`), `.btn-foil`, `.btn-outline-light`, `.btn-outline-dark`, `.btn-dark` and `.btn-quiet`. Form `<button>`s (booking, inquiry, 404) use the same classes, so everything shares one behaviour.
- **Gold:**
  - `.foil-bg` plus `shadow-press`;
  - hover: an `::after` using `var(--sheen)` with `mix-blend-mode: soft-light` crosses once (`sheen-pass`, `--dur-sheen`, `--ease-curtain`);
  - `:active`: `translate: 0 1px` and `shadow-press-deep`;
  - `hover:brightness-110` is removed.
- **Outline:** the border colour transitions as today.
- **Quiet:** eyebrow text plus `link-underline` plus arrow, with no box. It is for tertiary actions.
- **Arrow.** `EngravedArrow` replaces "→": a 1px shaft of `--arrow-length`, an open head at ±35° and a 3px lozenge tail. On hover or focus the head travels `--arrow-reach` and the shaft grows. The box has a fixed width, so there is no layout shift. It is `aria-hidden`.
- **Transitions.** `transition-all` becomes explicit `color, background-color, border-color, box-shadow, translate`.

### 4.10 `SectionHeading`: `ui.tsx`

```ts
SectionHeading({ eyebrow, title, lead?, tone?, align?, className?,
                 index?: string /* lowercase roman sub-chapter, e.g. "ii" */,
                 ornament?: "auto" | "full" | "short" | "none" })
```

- It renders inside its own `Reveal variant="sequence"`. Pages must not wrap it in another `Reveal`; none do today.
- The title is wrapped in `Lines`.
- `ornament="auto"` gives `full` when centred and `short` when left-aligned.
- `index` prefixes the eyebrow as a `Chapter` marker.
- Classes and sizes are unchanged.

### 4.11 `PageHero`: `ui.tsx`

```ts
PageHero({ eyebrow, title, lead?, image, engraving?, chapter?: string /* "I"–"V" */, caption?: string,
           variant?: "plate" | "type", colossal?: string })
```

- **`plate` (default).**
  - Keep the current layout, `min-h-[78vh]`, the gradient, the h1 and lead classes and `animate-slow-zoom`.
  - Add a lg+ `Frame` inset `--frame-inset` (corners `fleuron`, draw `intro`).
  - Show the engraving: `highlight` on, `inkOpacity` about 0.22, right-hand side.
  - Add a bottom-right `.caption` when `caption` is given.
  - The eyebrow becomes `<Chapter numeral={chapter} label={eyebrow}>` when `chapter` is set.
- **Intro choreography** (CSS only, `--intro-*`): frame draws, eyebrow wipes, `Lines mode="intro"`, lead fades up, then the title's foil span plays one `foil-sheen` at `--intro-sheen`.
- **Scroll depth** (`scroll(root)`, `animation-range: 0 70vh`): the image `translate`s down to 12vh and the copy lifts −6vh while fading to 0.25. Gradients never move, so contrast holds.
- **`type` variant (Heritage only).**
  - Ink ground with no full-bleed photo.
  - `Colossal text={colossal} tone="foil" bleed="right-bottom"` cropped by the section's right and bottom edges, drifting.
  - The `image` becomes a small `Photo mount` plate: lg `absolute right-[8%] top-[20%] w-[min(22vw,320px)] aspect-[4/5]`, slightly overlapping the top of the colossal, with a caption if given.
  - The h1 and lead are unchanged in size.

### 4.12 `Chapter`: `craft.tsx`

```ts
Chapter({ numeral: string, label: ReactNode, className? })
```

It renders `<span class="chapter-numeral text-[accent]">III</span>` + a 3rem hairline (`--rule-accent`) + `<span class="eyebrow">{label}</span>`. The eyebrow colour and size are unchanged. Numerals come from the `chapters` export (§15). **Home sections do not use chapters**, so they never collide with the USP I–IV.

### 4.13 `Counter` (client): `motion/counter.tsx`

```ts
Counter({ value: string /* "2,500" | "2,500+" | "1,300+" */, from?: number, className?, sheen?: boolean })
```

- SSR renders the final string.
- When revealed, a `rAF` loop writes `textContent` directly, never React state. It uses exponential ease-out over `--dur-count` (read with `getComputedStyle`) and `Intl.NumberFormat("en-US")`, and keeps the prefix and suffix.
- The final value stays reserved invisibly in the same grid cell, because Marcellus has no tabular figures, so there is no layout shift.
- The animated span is `aria-hidden`, with an `sr-only` final value.
- Under reduced motion, or with no JS, it shows the final value.
- `sheen` triggers `foil-sheen` when it lands.
- **Uses:** home "2,500" and the Heritage facts (2,500+, 1,300+ and 365 finish together). Nowhere else. Prices and years never count.

### 4.14 `FactBadge` and `FactBadgeGroup`: `craft.tsx` (ref 3)

```ts
FactBadge({ value: ReactNode, unit: string, size?: "sm" | "md" | "lg", accent?: "gold" | "claret", className? })
FactBadgeGroup({ children, className? })   // overlapping row: -ml-[12%] after the first; wraps on mobile without overlap
```

- **SVG (200×200 viewBox):**
  - an outer ring at r96, 1.4 stroke, `url(#wh-foil)` (or claret);
  - a ring at r92, 0.6 stroke;
  - a dotted ring at r86 with `strokeDasharray="0 5.2" strokeLinecap="round"` (true dots);
  - a disc at r84 filled with `var(--surface-raised)`;
  - a `Guilloche variant="wave"` field clipped to r80 at 10% `--accent-ink`.
- **HTML overlay:** the value keeps its current class (e.g. `display text-3xl text-gold-deep`), and the unit is set in `.caption` on up to two lines.
- **Sizes:** sm 8rem, md 11rem, lg 13rem.
- **Motion:** the rings draw when revealed, then the badge stamps.
- **Used only** in Whisky Story and Cave. That is the whisky-label world.

### 4.15 `Frame`: `craft.tsx`

```ts
Frame({ className?, inset?: string /* CSS length, default "0" */, inner?: "solid" | "dotted" | "none",
        corners?: "fleuron" | "tick" | "none", draw?: "none" | "reveal" | "intro" | "hover" })
```

- An absolute overlay, so its parent must be `relative`. It is `pointer-events-none` and `aria-hidden`.
- **Outer rule:** four edge `div`s at `--hairline` in `var(--rule-accent)`.
- **Inner rule:** at `--frame-gap`, 0.5px, solid or dotted.
- **Corners:** `<use href="#wh-fleuron">` rotated 0/90/180/270 in `var(--accent-ink)`. `tick` is a 14px L.
- **Draw:** edges `scale` from 0 along their axis from the corners over `--dur-draw` with `--ease-settle`, then the corners fade.
  - `reveal` is triggered by an ancestor `.is-visible`.
  - `intro` is triggered by keyframes at `--intro-frame`.
  - `hover` is triggered by the nearest ancestor link or group: `:is(a, .group):is(:hover, :focus-visible) .frame[data-draw="hover"]`. Hover frames are hidden at rest and drawn on hover.
- **Reduced motion:** renders drawn.

### 4.16 `LabelPlate`: `craft.tsx`

```ts
LabelPlate({ children, shape?: "plate" | "band", className? })
```

- **`plate`:** concave (scooped) corners of radius `--notch` cut by a four-layer radial mask. The inner double rule is four inset hairline divs plus four quarter-circle SVG corner arcs, so the geometry is never distorted. There is an optional wave-guilloche field at 6%.
- **`band`:** a cigar-band ribbon with pointed ends (`clip-path` polygon) and foil hairlines top and bottom.
- **Uses:** the Forbes quote (Home), the package inclusions (Stay), the Whisky Shop card (plate) and the Cigar Lounge eyebrow (band). Nowhere else.

### 4.17 `Lozenge`, `Leaders`, `Distinctions`, `WaxSeal`, `Colossal`

- **`Lozenge({ size?: "xs"|"sm"|"md", fill?: "outline"|"solid"|"foil", className? })`** replaces all three ad-hoc diamonds:
  - `h-2 w-2 rotate-45 border` → `sm outline`;
  - `h-1.5 w-1.5 rotate-45 bg` → `xs solid`;
  - the timeline `h-3 w-3` → `md outline`.

  Colour is `currentColor`.
- **`Leaders({ label, value, as?: "div"|"li", labelClassName?, valueClassName? })`** renders a `.leaders` row. Use it for hours, room specs and times. Wrap it in `<dl>` or `<ul>` semantics where the page needs them.
- **`Distinctions({ variant?: "band" | "roll" })`** reads `awards`:
  - `band` (footer): titles in `display text-[0.95rem]` as `.metal` (no foil), subs in editorial 0.95rem `text-cream-muted`, separated by `Lozenge xs` in a 2-col (mobile) / 5-col grid, with no box borders;
  - `roll` (Heritage): typeset rows with the title in display, the sub in editorial and hairlines between rows.

  Edit claims in one place. There is **no auto-scrolling marquee**.
- **`WaxSeal({ className? })`** is an irregular seeded blob filled with `url(#wh-wax)`, with the W monogram debossed as offset hi/lo strokes. It `stamp`s in. It replaces "✦".
- **`Colossal({ text, tone?: "deboss"|"foil"|"outline", bleed?: "none"|"left"|"right"|"bottom"|"right-bottom", drift?: boolean, className? })`** renders an `aria-hidden` `.colossal` span. Its parent must use `overflow-clip`, not `hidden`, so sticky still works.
  - `outline` is `-webkit-text-stroke: 1px color-mix(in oklab, var(--metal) 45%, transparent); color: transparent`.
  - **Limit:** one colossal per page.

### 4.18 `Guilloche`: `components/guilloche.tsx`

```ts
Guilloche({ variant: "rosette" | "wave", className?, layers?: number, seed?: number })
```

- **Rosette:** a hypotrochoid `x=(R−r)cos t + d·cos((R−r)t/r)`, `y=(R−r)sin t − d·sin((R−r)t/r)`, with `t ∈ [0, 2πr/gcd(R,r)]`, about 900 points at 1-decimal precision, 3 layers phase-offset 4°. Presets `R60 r13 d42` and `R60 r17 d38` are also emitted as `wh-rosette-a` and `wh-rosette-b` symbols.
- **Wave:** 10–14 parallel phase-shifted sines, used for badge fields, the ticket header band and the plate fields.
- **Stroke:** `currentColor` at 0.5, opacity set by the parent (6–14%).
- The legacy `.guilloche` class stays as a CSS band (§3.5).

### 4.19 Identity: `components/identity.tsx`, with `logo.tsx` kept

```ts
type BrandId = "waldhaus" | "devils" | "cave" | "stubli";
Emblem({ brand, className?, highlight?: boolean })
Lockup({ brand, layout?: "horizontal" | "stacked" | "compact", descriptor?: string,
         href?: string, tone?: "light" | "dark", className? })
```

**Emblems.** A 64×64 viewBox, `currentColor`, non-scaling strokes. One family, differentiated by frame:

| Brand | Frame | Glyph |
|---|---|---|
| `waldhaus` | Square double rule (the existing `Monogram`) | W-peaks with lake line |
| `devils` | Roundel with a dotted inner ring | A "DP" ligature. The two top serifs of the ring break into tiny horns: the second-look detail. |
| `cave` | Round vault arch | A seven-berry cluster with sphere hatching |
| `stubli` | Gable (pentagon) | A stone-pine sprig |

**Lockups**, following ref 8:
- **`horizontal`:** emblem + name (`display`) + descriptor (`eyebrow`). The existing `Logo` equals `Lockup brand="waldhaus" layout="horizontal"` with **identical** classes and sizes (`text-[1.05rem]`, sub `text-[0.52rem]`).
- **`stacked`:** emblem above; the name set over two lines; a hairline; the descriptor; then "Est. 1885" for waldhaus only.
- **`compact`:** initials over emblem over descriptor.

**Rules:**
- All names use `.display` (the rendered 0.06em).
- `aria-label="{name}, {descriptor}"` goes on the wrapper, and the parts are `aria-hidden`.
- **Colour follows the existing `Logo`:**
  - emblem: `text-gold-light` on dark, `text-gold-deep` on light;
  - name: `text-cream` on dark, `text-ink` on light;
  - descriptor: `text-gold-light/90` on dark, gold-deep on light (which the AA override turns into gold-ink);
  - Cave uses claret on paper, matching its section accent.

  Gold is the only metal.
- `Monogram` and `Logo` keep their exports and signatures, because `admin/page.tsx` imports `Logo`.

### 4.20 `RailControls` (client) and `StickyReserve` (client)

- **`RailControls({ targetId, label })`** renders two 44px hairline-circle buttons with `EngravedArrow`. They call `el.scrollBy({ left: ±cardWidth, behavior: reduce ? "auto" : "smooth" })` and are shown at md+.
  - The rail gets `scroll-timeline: --rail inline`.
  - A sibling progress thread uses `timeline-scope`, and is `display:none` when unsupported.
- **`StickyReserve()`** is rendered in `app/(site)/layout.tsx` and shown below `sm` only.
  - It slides up (`--dur-base`, `--ease-settle`) when every `[data-reserve-sentinel]` has left the viewport.
  - It hides (`--dur-quick`, `--ease-exit`) while any `[data-reserve-hide]` is visible, and on `/contact`.
  - Two cells: `.btn-foil` "Reserve your stay" and outline "Call" (`hotel.phoneHref`).
  - `ink` ground, gilt top edge, `padding-bottom: env(safe-area-inset-bottom)`, `z-(--z-sticky-bar)`.
  - Observers write `dataset` attributes, not React state.

---

## 5. Header and navigation: `components/header.tsx`

- **Surface.** The header carries `.surface-ink`, so focus rings and rules resolve for dark.
- **Condense.** Keep `py-6 → py-3` on scroll, but transition only `padding-block` and `background-color` (no `transition-all`). The `bg-ink/92` layer fades in. **Remove `backdrop-blur`.** The logo's "St. Moritz · Est. 1885" subline collapses via `grid-template-rows: 1fr → 0fr` once scrolled.
- **Gilt progress edge.** A 1px bottom hairline in `--color-gold` at 60%, `transform-origin:left`, `animation: grow-x linear both; animation-timeline: scroll(root block)`. This replaces the rgba shadow. Without timeline support it becomes a static full hairline at `--color-rule-gold` when scrolled. It is hidden at the top.
- **Nav items.** Size and classes are unchanged. A 4px `Lozenge` sits under the item: the active route shows it solid; on hover or focus it `stamp`s in (scale 1.4→1, `--dur-quick`).
- **Dropdowns become menu cards.**
  - Solid `bg-ink` (no /97, no blur), `Frame corners="tick"`, and a header row `Chapter numeral label` in `.caption` style.
  - Items stay editorial `text-lg` with the same hover.
  - Open with `clip-path: inset(0 0 100% 0) → inset(0)` over `--dur-hover` with `--ease-settle` and a 120ms open delay (hover intent); items rise 4px, 40ms apart. Close over `--dur-quick` with no stagger.
  - **MUST** add `group-focus-within:visible group-focus-within:opacity-100`.
- **Reserve.** Uses `.btn .btn-foil`, with the sheen.
- **Hamburger.** A two-step morph: the lines meet (250ms), then rotate (350ms). Add `aria-expanded` and `aria-controls="site-menu"`.
- **Mobile menu:**
  - **Semantics:** `id="site-menu" role="dialog" aria-modal="true" aria-label="Menu"`. Escape closes. Focus moves to the first link, then returns to the toggle. Set `inert` on `<main>` and `<footer>` while open.
  - **Open:** a curtain drop, `clip-path: inset(0 0 100% 0) → inset(0)` over 900ms `--ease-curtain`. Close over 450ms `--ease-exit`.
  - **Items:** `.caption` numerals I–V beside the `display text-3xl` labels (unchanged). Labels rise via `Lines`, 70ms apart; children fade 150ms after their parent. Separators become a dotted plus hairline double rule.
  - A large blind `.deboss` stacked Waldhaus lockup sits centred behind the list. The foil "Reserve your stay" is the only foil.
- **Lint fix (MUST).** Remove `useEffect(() => setOpen(false), [pathname])`. Instead store the previous pathname in state and compare during render:
  ```ts
  if (pathname !== lastPath) { setLastPath(pathname); setOpen(false); }
  ```
  Also close from each link's `onClick`.
- **EN/DE.** Keep it as is, add `aria-pressed`, and flag it to Asgar (§17).

---

## 6. Footer: `components/footer.tsx` (the colophon)

From top to bottom, all on `cloth`:

1. `.gilt-edge` on top.
2. `Engraving name="lake" fit="cover" align="bottom" highlight`, as a band at the top (`inkOpacity` about 0.1, foil waterline).
3. **The house family:** four `Lockup layout="horizontal"` (waldhaus, devils, cave, stubli) divided by hairlines, each linking to its section (`/`, `/whisky-wine`, `/whisky-wine#cave`, `/dine`).
4. **Colophon grid** (existing 12 columns):
   - columns 1–4: the stacked Waldhaus lockup, description and address (unchanged copy);
   - columns 5–9: an index of all five chapters (currently the first three) with `.caption` numerals and editorial children, plus "Letters from the lake" and the newsletter;
   - columns 10–12: "Open 365 days", with the hours as `Leaders`.
5. `Distinctions variant="band"`. The foil titles go (5 foils → 0).
6. Bottom bar: © line, `Ornament full`, links. "Staff" is quieted to `.caption text-cream-muted`. `text-cream/50` becomes `text-cream-muted` (AA).
7. `Colossal text="Waldhaus" tone="deboss" bleed="bottom"`, cropped by the footer's bottom edge (a blind emboss in the cloth).

**Motion:** the lake drifts, and the hours rows follow the stagger. Nothing else moves.

---

## 7. Booking bar: `components/booking-bar.tsx` (the ticket)

- **Object.**
  - A solid `bg-ink` with `.surface-ink` (no `/55`, no blur) and `border border-gold/30`.
  - `.ticket` notches (`--tear: 50%`) on both short ends.
  - Dividers are `.perforation-y`, not solid borders.
  - A `Guilloche variant="wave"` field at 4% behind the cells.
  - On the home hero at lg+, the bar sits centred on the plate frame's bottom rule, and the rule passes into the notches.
- **Date cells** (ref 1 scale contrast):
  - a `.caption` label (Arrival or Departure) in gold-light;
  - the day in `.figure text-numeral text-cream`;
  - the month in `.eyebrow text-gold-light`;
  - the weekday in `.editorial text-lg text-cream-muted`.

  The native `<input type="date">` stays for accessibility and mobile pickers, positioned `absolute inset-0 opacity-0 cursor-pointer` with `onClick={e => { try { e.currentTarget.showPicker() } catch {} }}`. The formatted display is `aria-hidden`, and the `<label>` still names the input. The focus ring comes from `.cell:focus-within { outline: 1px solid var(--focus-ring); outline-offset: -6px }`. **Remove `outline-none`.**
- **Nights.** "{n} nights" appears in `.caption` on the arrival/departure perforation at md+, and after the departure weekday on mobile.
- **Guests.** The native `select` stays, with editorial `text-xl` as today and a tokenised chevron.
- **Logic.**
  - A local ISO date helper replaces `toISOString().slice(0,10)`. The old helper is UTC and can shift the default date near midnight in Zurich.
  - If departure is on or before arrival, departure becomes arrival + 1.
  - Push via `useTransition`: while pending, the CTA reads "One moment…" with `aria-busy` and the sheen.
- **CTA:** `.btn-foil`, full height, press state, 44px minimum.
- **Mark:** `data-reserve-sentinel` for `StickyReserve`.

---

## 8. Forms

### 8.1 `.field` (globals)

- The border becomes the token.
- **Focus:** a foil underline draws from the left. The background is `var(--foil-gold-on-light) no-repeat left bottom / 0% 2px`, transitioning to `100% 2px` over `--dur-hover` with `--ease-settle`. It is 2px, so it meets focus visibility. `select.field` keeps its chevron as a second layer.
- **Invalid:** `[aria-invalid="true"]` gets a claret dotted underline.
- The placeholder becomes `--color-ink-muted`.

### 8.2 `inquiry-form.tsx`: the reservation letter

- **New optional prop `letterDate?: string`.** The contact page passes it, computed on the server with `Intl.DateTimeFormat("en-GB", { day:"numeric", month:"long", year:"numeric", timeZone:"Europe/Zurich" })`.
- **Letterhead:** `Lockup brand="waldhaus" layout="horizontal" tone="dark"` on the left, "St. Moritz, {letterDate}" in editorial on the right, then a hairline.
- **Type chips become index tabs.** A `.caption` numeral (i–v) plus the existing label. Selected keeps `bg-forest text-cream` and gains a foil `Lozenge xs`.
  - Semantics: `role="radiogroup" aria-label="Type of request"`, each tab `role="radio" aria-checked`, roving tabindex, arrow keys.
- **Type switch.** A progressive enhancement: `document.startViewTransition(() => flushSync(() => setType(t)))` when supported and motion is allowed.
  - `view-transition-name`: `inquiry-title`, and one per field wrapper (`field-name`, `field-email` …).
  - `::view-transition-group(*)` runs at `--dur-quick` with `--ease-settle`.
  - The fallback is an instant swap.
- **Submit.** `.btn .btn-foil` with `EngravedArrow`. While pending, `aria-busy` is set and the sheen repeats; this is the only permitted loop, and it ends with the request.
- **Errors:** `text-claret` with `role="alert"`.
- **Success:** `WaxSeal` stamps in, then "Thank you" (unchanged class), an `Ornament full` that draws, and the unchanged copy. Focus moves to the heading, and a `role="status"` wrapper is present.

### 8.3 `newsletter-form.tsx`

- The underline foil-draws on `focus-within`. **Remove `outline-none`** and rely on the ring plus the draw.
- "Subscribe" gets `EngravedArrow`.
- Error uses `text-error-on-dark`.
- Messages get `role="status"`, and the button gets `aria-busy` while loading.

---

## 9. Pages

Every page:
- replaces left-aligned hand-built `Ornament` with `variant="short"`;
- converts heading blocks to `Reveal variant="sequence"` with `data-seq` and `Lines` on the h2;
- migrates micro labels from `text-ink/50|/55` to `text-ink-muted` and `text-cream/50` to `text-cream-muted`;
- applies the foil census (§10).

### 9.1 Home: `app/(site)/page.tsx`

- **Hero** (ink; the frontispiece)
  - Keep the photo, `animate-slow-zoom`, the gradients, the h1, the lead and the seal position.
  - **Remove every `Reveal`.** Use intro classes: eyebrow `wipe-in`, h1 `Lines mode="intro"` ("Since 1885." stays whole, gets `data-sheen`, and is the view's foil), lead `fade-up`, seal `stamp`, booking bar rise.
  - Add a lg+ `Frame inset="var(--frame-inset)" corners="fleuron" draw="intro"`.
  - Add a bottom-right `.caption`: "Pl. I — Lake St. Moritz with the Engadin mountains" (the existing alt).
  - Seal: static (no `spin`; `hover:scale-105` removed; `stamp` entrance).
  - With `html.intro-seen`, delays compress by 70% and the frame renders drawn.
- **USP ribbon** (paper)
  - The I–IV numerals go from foil to `.metal` (`text-3xl` kept).
  - The `border-r` dividers become hairlines with `Lozenge xs` terminals top and bottom that draw from the top (140ms stagger).
- **Welcome** (paper)
  - The pine engraving is now visible.
  - Main photo: `Photo plate="II" curtain="up"`.
  - Inset photo: `Photo mount` (the 10px cream mount kept; `shadow-2xl` becomes `shadow-mount`), wrapped in `.drift-y` (`--drift-from: 24px; --drift-to: -24px`), so it floats forward over the still main photo.
  - The first paragraph gets `.initial`.
  - `Ornament short`.
  - Sign-off: a 2rem hairline, then the italic "— Sandro Bernasconi, Host" (**no fabricated handwriting**).
- **Devil's Place** (cloth; the home page's single richest view)
  - `Lockup brand="devils" layout="horizontal"` replaces the eyebrow span (same text via `descriptor`).
  - "2,500": `Counter value="2,500" sheen`, `.foil .foil-emboss`, with the size and classes unchanged. Bleed ~4% off the viewport's left edge at lg+ with `margin-left: calc(-1 * max(2.5rem, (100vw - var(--container-wide)) / 2 + 2.5rem) - .04em)`; the section is `overflow-clip`.
  - The h2 lines rise after the count lands.
  - Thistle: `highlight`, `drift`, `inkOpacity` about 0.12.
  - Stats row: unchanged figures (gold-light display). The border-y becomes a double hairline (0.5px + 1px, 3px gap).
  - Forbes quote: `LabelPlate` on velvet. The foil quote mark becomes `.metal`.
  - `.gilt-edge` at the top.
- **Stay carousel** (linen)
  - Keep the rail. Add `id="rooms-rail"` and `RailControls` beside "All rooms & prices".
  - Add a progress thread under the rail.
  - Cards: a "No. 0n" `.caption` above the name. The size chip becomes a `.caption` label on `bg-linen/90` (kept). `Frame corners="fleuron" draw="hover"` sits over the photo. "CHF {from}" becomes `text-gold-ink` (text-xl, below 24px).
  - Hover zoom comes from the link rule. The scrollbar uses `scrollbar-color: var(--color-gold-deep) transparent`.
- **Eat & Drink** (velvet)
  - Grapes engraving visible.
  - Cards: curtains lift in burgundy with a 160ms stagger. The `inset-3 border-gold/0 → /50` hover becomes `Frame inset="0.75rem" corners="fleuron" draw="hover"`.
  - "Discover" gets `EngravedArrow`; keep `img-zoom`.
  - `.gilt-edge` at the top.
- **Spa** (paper)
  - Keep the three-photo collage with curtains: sauna first, then the right column at +200 and +400ms.
  - Hover zoom removed (not links). `Ornament short`. The `dl` keeps pine.
- **Heritage strip** (ink)
  - The lake engraving (`fit="cover" align="bottom" highlight drift`) is **this view's hero**.
  - Years go from foil to `.metal` (`text-6xl` kept). `.gilt-edge` at the top.
- **Seasonal** (paper with a velvet card; the invitation)
  - Text panel: `Frame inner="dotted" corners="fleuron" draw="reveal"`, plus a `Guilloche variant="rosette"` watermark at 6% behind the text.
  - The eyebrow "Seasonal · 31 December" is recomposed in the ref 1 arrangement:
    - "Seasonal" as the eyebrow;
    - the foil "31" in `.figure text-numeral-xl` (the view's foil);
    - "December" as an eyebrow on its baseline, with a hairline between.
  - The h3 stays cream at its size. The guilloche band is tokenised.
  - **MAY** add the site's single tassel: an SVG cord and knot with about 28 strands in `url(#wh-foil)` (seeded lengths) hanging from the card's lower-right corner. It sways 2° on hover only and is still under reduced motion. Ship it only if it reads as silk at 1×.
  - Hide the card once `seasonal.nye.until` has passed (§15). The page SHOULD add `export const revalidate = 86400`.
- **Final CTA** (ink)
  - The ibex (`highlight`) `crest`s in via `clip-path` (1.6s settle), then the lines rise, then the buttons.
  - `.gilt-edge` at the top.

### 9.2 Stay: `stay/page.tsx`

- **Hero:** `PageHero chapter="I" caption=…` with the pine engraving visible.
- **Rooms:**
  - Foil "01–05" **stay foil** (each article is its own view) with `.foil-emboss`.
  - Photo curtains open away from the text (`i % 2 ? "right" : "left"`).
  - `Ornament short`.
  - The `dl` grid keeps its structure, with the vertical dividers as `.perforation-y`. "From CHF" becomes `text-gold-ink` (text-xl).
- **Weekly package** (cloth):
  - `Colossal text="VII" tone="deboss" bleed="left"` behind the heading.
  - The ibex is visible, with `drift`.
  - "CHF 1,370" is the view's only foil (`text-6xl`, `.foil-emboss`).
  - The inclusions move into `LabelPlate` (replacing `border border-gold/30`), with `Lozenge sm outline` bullets.
- **Services** (linen): foil "01–08" become `.metal` (`text-2xl`). Keep the grid.

### 9.3 Room detail: `stay/[slug]/page.tsx`

- **Hero:** `PageHero chapter="I" caption={room.name}`.
- **Body:**
  - The first paragraph gets `.initial`.
  - The Amenities eyebrow gets `Ornament short`.
  - Features use `Lozenge xs solid` with dotted row rules.
  - Gallery: `Photo plate="I|II|III"` with the existing alts as captions.
- **Aside: the rate card as a ticket.**
  - `.ticket` with `--tear` at the stub line.
  - A `Guilloche variant="wave"` header band.
  - A `.caption` "No. 0{index+1} · {room.name}".
  - The foil price (`text-6xl`) is the page's only foil.
  - `Leaders` for Size, View and Occupancy.
  - A `.perforation-x` tear line, then the stub with the two buttons and the "Best rate…" line.
  - Mark it `data-reserve-sentinel`.
- **You may also like:** the title hover colour jump becomes a `link-underline` drawn with `--foil`. Prices become `text-gold-ink`.

### 9.4 Dine: `dine/page.tsx`

- **Hero:** `PageHero chapter="II"` with the grapes engraving visible.
- **Restaurant** (paper)
  - Heading: `Ornament short`.
  - The phone link becomes `Button variant="quiet-dark"`-styled or keeps `link-underline` (same copy).
  - The bottom photo gets `plate="I"`.
- **Menu card** (the page's hero object)
  - `lg:sticky lg:top-28 self-start`, with `shadow-plate`.
  - A triple rule: outer `gold/50`, inner `gold/25`, and a new dotted innermost rule (ref 3), all drawn with `Frame draw="reveal"`.
  - A `Guilloche` band at the top. The pine engraving is visible (`detail="emblem"`).
  - Courses: numerals I–V go from foil to `text-gold-ink` (text-lg). They arrive one at a time, 180ms apart (`data-seq` with `--i`).
  - There is no foil in the card.
- **Stübli** (velvet)
  - `Lockup brand="stubli" layout="stacked" descriptor="Stüvetta & Fonduestübli"` replaces the eyebrow.
  - The two photos become plates with their alts as captions. The `mt-16` offset is kept and becomes depth: the second photo is wrapped in `.drift-y`.
  - `.gilt-edge`.
- **Lounge & Terrace** (linen)
  - Each article header becomes `Leaders label=title value=time`, where the `border-b` becomes the dotted leader. Times stay `.eyebrow text-gold-deep`, which the AA override turns into gold-ink.
- **Events** (cloth, the invitation)
  - The text column sits in `Frame inner="dotted" corners="fleuron" draw="reveal"`.
  - The lake is visible with `highlight`. The centred `Ornament full` stays (a printed object).

### 9.5 Whisky & Wine: `whisky-wine/page.tsx`

- **Hero** (cloth)
  - `Lockup brand="devils" layout="stacked" descriptor="Est. in the Waldhaus"` replaces the eyebrow.
  - The h1 uses `Lines mode="intro"`; "largest" is the only foil (`data-sheen`).
  - The whisky-wall `<img>` gets `.candlelight` (foundation CSS) and keeps its `opacity-25`:
    ```css
    .candlelight {
      mask-image: radial-gradient(circle at var(--glow-x,78%) var(--glow-y,50%),
                                  black var(--glow), transparent calc(var(--glow) + 40%));
      animation: candle var(--dur-candle) var(--ease-settle) 200ms both;
    }
    ```
    The pool widens from the seal like eyes adjusting to a dim bar. On mobile, `--glow-x: 50%; --glow-y: 72%`. Under reduced motion, `--glow: 130%` statically.
  - Thistle: `highlight`, `drift`, right 45%.
  - Seal: static, `stamp` entrance.
- **Story** (paper)
  - `Photo plate="I"` with a curtain. `Ornament short`.
  - The stats become `FactBadgeGroup` with three `FactBadge`s: "1,000" / "Bottles · 1996", `figures.whiskies` / "Bottlings · 1999", "1878" / "Oldest Macallan". Values keep `display text-3xl text-gold-deep`.
- **Regions** (cloth): foil "01–04" become `.metal` (`text-4xl`). A deliberately quiet section.
- **Cigar Lounge and Shop** (velvet)
  - Cigar: the eyebrow sits on `LabelPlate shape="band"`; the card keeps `border-gold/30 p-3`.
  - Shop: the card becomes `LabelPlate`. "Book a shop visit" stays primary, and "World of Whisky" becomes `quiet-light`.
  - Photos are not links, so there is no zoom.
- **Cave Waldhaus** (paper, claret)
  - `Lockup brand="cave" layout="stacked" descriptor="The wine cellar"` in claret replaces the eyebrow.
  - The stats become a `FactBadgeGroup` with `accent="claret"`; values keep `display text-2xl text-claret`.
  - Grapes are visible in wine.
  - The collage stays, with curtains descending (`curtain="down"`) in the order arch → rack → bottles, and captions from the alts.

### 9.6 Spa: `spa/page.tsx`

- **Tempo.** Wrap the page in `.tempo-calm` (`--dur-reveal:1600ms; --dur-line:1400ms; --stagger:130ms; --dur-kenburns:36s`). The spa is the slowest page on the site.
- **Hero:** `PageHero chapter="IV"`, with `engraving="gentian"` (falls back to pine).
- **Private by design** (paper)
  - `Colossal text="8" tone="outline" bleed="left"` behind the heading, with the rail caption "Never more than eight guests" (from existing copy).
  - The cloth stat box goes from foil to `.metal` (`text-2xl`).
  - The collage keeps its curtains, with no zoom.
  - Facilities "01–05" go from foil to `text-gold-ink` (text-xl).
- **Activities** (cloth)
  - The ibex is visible.
  - "Winter" and "Summer" go from foil to `.metal` (`text-4xl`).
  - Cards keep `border-gold/30 p-3`; bullets use `Lozenge xs solid`.

### 9.7 Heritage: `heritage/page.tsx`

- **Hero:** `PageHero variant="type" chapter="V" colossal="1885"` (ref 7, the colossal foil). The h1's "since 1885" span becomes `.metal`, so there is one foil.
- **Family** (paper)
  - The seal loses the cream disc and `shadow-xl`, and becomes `Seal variant="emboss"` pressed into the paper, overlapping the photo corner. "1885" is foil.
  - `Ornament short`.
- **Timeline** (cloth)
  - The `ol` gets `.spine` (`view-timeline: --history block`).
  - Behind the existing 30% track, `.spine-fill` (gold-light) grows from the top: `animation: draw-y linear both; animation-timeline: --history; animation-range: cover 15% cover 85%`.
  - Each node is a `Lozenge md outline` that fills to gold-light as the tip passes, using `animation-timeline: view(); animation-range: contain 40% contain 45%`.
  - Years go from foil to `.metal` (`text-5xl`). Items slide 24px in from their own side.
  - Without timeline support: a static full fill and filled nodes.
- **Facts** (linen)
  - Keep the grid.
  - "1885" stays foil (`text-4xl`, `.foil-emboss`). The other seven become `.metal`.
  - "2,500+", "1,300+" and "365" use `Counter` and land together. The rest are static.
- **Awards:** the five "✦" seals become `Distinctions variant="roll"`. The press button stays.

### 9.8 Contact: `contact/page.tsx`

- **Hero:** unchanged composition, with `Lines mode="intro"` on the h1. "to host you" stays foil.
- **Form card**
  - `shadow-plate`.
  - `InquiryForm letterDate={…}` (server-computed, Zurich).
  - Mark it `data-reserve-hide`.
- **Find us** (cloth): the ibex is visible (`detail="emblem"`). The phone stays the card's gold-light display. `Ornament short`.
- **Hours** (linen): rows become `Leaders`.
- **Map**
  - Mounted as a plate: `Frame corners="fleuron"` and the caption "Via Dim Lej 6 · {geo.label}".
  - Keep the grayscale and sepia filter. It warms to `filter: none` on `:hover` and `:focus-within` over 900ms.

### 9.9 Not found: `app/not-found.tsx`

- `Colossal text="404" tone="foil" bleed="bottom"`, cropped by the viewport bottom. The visible "404" line is replaced, and an `sr-only` "Error 404, page not found" is added.
- The ibex uses `highlight`.
- "Lost in the Engadin" rises via `Lines mode="intro"`, then `Ornament full` draws.
- The five chapters appear as a way back: `.caption` numerals plus editorial labels, from `chapters`.
- The link uses `.btn .btn-foil` with `EngravedArrow` (the text "Return to the Waldhaus" is kept).

---

## 10. Foil census (before → after)

| Page | Before | After | Foil kept |
|---|---|---|---|
| Home | 11 | 3 | "Since 1885.", "2,500", NYE "31" (new). USP, quote mark and the heritage years become metal. |
| Footer (every page) | 5 | 0 | Awards become the Distinctions band. |
| Stay | 15 | 7 | Hero span, 01–05 (one per article view), CHF 1,370. The services 01–08 become metal. |
| Room detail | 1 | 1 | Price |
| Dine | 6 | 1 | Hero span. Menu I–V become gold-ink. |
| Whisky & Wine | 5 | 1 | "largest". Regions 01–04 become metal. |
| Spa | 11 | 1 | Hero span. Stats, facilities, Winter and Summer become metal or gold-ink. |
| Heritage | 16 | 3 | Colossal 1885, the family seal's 1885, the facts' 1885 (never in the same view). The hero span and timeline years become metal. |
| Contact | 2 | 1 | "to host you". ✦ becomes the wax seal. |
| 404 | 1 | 1 | Colossal 404 |

Foil buttons (`.foil-bg`) are unchanged: one primary per view.

---

## 11. Restraint list (remove or quiet)

| # | What | Replacement |
|---|---|---|
| R1 | `spin` / `.spin-slow` on both seals; `hover:scale-105` on the hero seal | Static. Light moves; the seal is still. |
| R2 | Foil on supporting numerals | `.metal` / `text-gold-ink` (§10) |
| R3 | Full `Ornament` under every left-aligned heading | `Ornament short`. `full` stays on centred headings and printed objects (menu, invitation, success, 404, footer). |
| R4 | Glassmorphism (`backdrop-blur`) on the header, booking bar and dropdowns | Solid ink or cloth |
| R5 | `hover:brightness-110` on foil CTAs | Sheen plus press |
| R6 | `img-zoom` on non-link photos | Zoom only inside links, at 1.04 |
| R7 | `transition-all` (header, Button, chips, dropdown, mobile menu) | Explicit properties |
| R8 | Three ad-hoc diamond bullets | `Lozenge` |
| R9 | "✦" and "→" glyphs | `WaxSeal`, `EngravedArrow` |
| R10 | `shadow-2xl`, `shadow-xl`, rgba arbitrary shadows | `shadow-plate`, `shadow-mount`, `shadow-press` |
| R11 | JPG-mask engraving path (404 requests) | Inline SVG, zero requests |
| R12 | Five identical award seals with "✦"; foil award titles in the footer | `Distinctions` roll and band |
| R13 | `Reveal` around above-the-fold hero content | CSS intro (no JS dependency, LCP-safe) |
| R14 | `text-red-300`, `text-ink/50–55`, `text-cream/50` micro labels | Tokens (AA) |
| R15 | Cream disc and `shadow-xl` behind the Heritage seal | Blind emboss |

**Kept on purpose** (the user's design): inner-hero Ken Burns (tokenised), the photo collages, the rooms carousel, primary-plus-outline button pairs, the home seal and whisky seal, and the centred dark SectionHeadings.

---

## 12. Motion rules

1. **Ink draws, light travels, plates reveal.** These are the only three motion verbs. Nothing bounces, pulses, blinks or spins.
2. **Arrivals run on time; scroll drives only light, depth and progress.** That covers the foil travel, the engraving and colossal `drift`, the PageHero depth, the header progress, the heritage spine and the rail thread. Nothing a reader is reading scrubs backwards.
3. **One mover per view.** Secondary elements only fade. A section arrives with one grammar: eyebrow wipe → title lines → ornament draw → lead → actions, with media at +150ms.
4. **Arrive slowly, leave quickly.** Entrances run 1.1–1.6s with `--ease-settle` or `--ease-silk`. Exits run 0.25–0.45s with `--ease-exit`.
5. **Nothing loops.** Ken Burns runs once. The only repeat is the sending-state sheen, bounded by the request.
6. **Quantities count, dates settle, prices never move.** Counters appear on home "2,500" and the Heritage facts only.
7. **Hover confirms and never reveals content.** Hover motion appears only where a click exists.
8. **Tokens only.** Every duration, easing, delay and distance reads a `--dur-*`, `--ease-*`, `--seq-*`, `--intro-*`, `--stagger*` or `--reveal-distance` token. `.tempo-calm` retunes a page by overriding them.
9. **Compositor first.** Animate `transform`, `translate`, `scale`, `opacity` and `clip-path` only. The exceptions are the census-limited foil `background-position` and the candlelight mask.
   - Entrances use `transform`, drift and parallax use `translate`, hover uses `scale`.
   - Never animate `translate` on an element that carries a Tailwind `translate-*` class (the Devil's thistle has `-translate-y-1/2`); put `drift` on an inner wrapper.
10. **Scroll-driven syntax.** Write the `animation` shorthand **before** `animation-timeline`. Gate with `@supports (animation-timeline: view())`. The fallback is always the static final state.
11. **No per-frame React state.** Motion writes classes, `dataset` and CSS variables from refs. This keeps the React Compiler lint rules green.

**Drift:**
```css
.drift   { --drift-from: -3%; --drift-to: 3%;
           animation: drift linear both; animation-timeline: view(); }
.drift-y { --drift-from: 24px; --drift-to: -24px;
           animation: drift-y linear both; animation-timeline: view(); }
```
- Both are gated by `@supports (animation-timeline: view())` and `no-preference`.
- Below `md`, the drift is halved.
- Use them only on ornaments (engravings of 400px or more, colossal type) and on the two layered-depth photos (Welcome inset, Stübli second photo). Content photos otherwise hold still.

---

## 13. Accessibility rules

1. **Reduced motion.** Under `prefers-reduced-motion: reduce`:
   - every token-driven transition collapses (`--reveal-distance:0; --dur-reveal:250ms; --dur-line, --dur-curtain, --dur-draw: 1ms; --stagger*:0ms; --dur-kenburns:0s`);
   - these have `animation: none`: `.drift`, living foil, `[data-sheen]`, `.candlelight`, `.spine-fill`, node ignition, the progress thread, stamps, crests, intros, the tassel and the Ken Burns;
   - counters show their final value, and view transitions are skipped;
   - final states always render (frames drawn, curtains lifted, ornaments drawn).
2. **No JS.** Content is visible (`.js` gating). Heroes use CSS intros that end visible.
3. **Focus.** Put this in `@layer base`:
   ```css
   :where(a,button,input,select,textarea,summary,[tabindex]) {
     outline: var(--hairline) solid transparent; outline-offset: 8px;
     transition: outline-offset var(--dur-quick) var(--ease-settle), outline-color var(--dur-quick);
   }
   :focus-visible { outline-color: var(--focus-ring); outline-offset: 4px; }
   ```
   It settles from 8px to 4px. The focus ring is gold-ink on light (4.8:1) and gold-light on dark (8.9:1).
   - Remove `outline-none` from the booking bar and newsletter.
   - `.field` signals focus with its 2px foil underline.
   - Booking cells use `:focus-within`.
   - **Never** use a bare `outline:none`.
4. **Keyboard navigation.**
   - Desktop dropdowns open on `focus-within`.
   - The mobile menu is a modal dialog (focus in, Escape, return focus, `inert` behind).
   - Inquiry tabs are a radiogroup with arrow keys.
   - `RailControls` are real buttons with labels.
5. **Contrast (AA).**
   - Small gold on light uses gold-ink (via the automatic eyebrow and caption override, plus `text-gold-ink` for sub-24px prices and numerals).
   - Muted micro labels use `--color-ink-muted` (5.1:1) and `--color-cream-muted` (5.4:1).
   - Errors are claret on light and `--color-error-on-dark` (7.1:1) on dark.
   - Body copy opacities (`/60–/85`) already pass and stay.
6. **Decorative versus meaningful.**
   - Engravings, frames, guilloche, colossal type, lozenges and arrows are `aria-hidden`.
   - Split lines and counters carry `sr-only` text.
   - Lockups carry an `aria-label`.
   - Every photo keeps meaningful alt text; hero backgrounds stay `alt=""`.
7. **Targets and zoom.** Interactive targets are at least 44×44px (booking cells, rail buttons, tabs, sticky bar). Never export a `viewport` with `maximumScale` or `userScalable:false`.
8. **Live regions.** Form success and error states use `role="status"` / `role="alert"`. Pending buttons use `aria-busy`.
9. **Smooth scroll** applies only under `no-preference`.

---

## 14. Performance guardrails

- **Zero new dependencies.**
- **Client JS added:** `Counter`, `RailControls` and `StickyReserve` (each under 60 lines), plus the upgraded `Reveal`, `Header`, `BookingBar`, `InquiryForm` and `NewsletterForm`. Everything else is a server component or CSS.
- **Engravings** are server components, so their code ships no client JS, and each page's HTML contains only the plates it renders. Each plate has 400 elements or fewer, and hatching uses `<pattern>` fills rather than thousands of lines.
- **`CraftDefs`** is 12KB or less.
- **Grain tiles** are static and cached. Never animate them, and never use `background-attachment: fixed`.
- **Living foil and counters:** no more than two animating nodes per viewport.

---

## 15. `src/lib/site.ts`: additive exports only

```ts
export const toRoman = (n: number) => ["I","II","III","IV","V","VI","VII","VIII","IX","X"][n - 1] ?? String(n);
export const chapters = nav.map((n, i) => ({ ...n, numeral: toRoman(i + 1) }));   // I Stay … V Heritage
export type BrandId = "waldhaus" | "devils" | "cave" | "stubli";
export const brands: Record<BrandId, { name: string; descriptor: string; est?: number; href: string }> = {
  waldhaus: { name: hotel.name, descriptor: "St. Moritz", est: hotel.founded, href: "/" },
  devils:   { name: "Devil's Place", descriptor: "Whisky Bar", href: "/whisky-wine" },
  cave:     { name: "Cave Waldhaus", descriptor: "The wine cellar", href: "/whisky-wine#cave" },
  stubli:   { name: "Fondue Stübli", descriptor: "Stüvetta & Fonduestübli", href: "/dine" },
};
export const geo = { lat: 46.4921, lon: 9.8375, label: "46°29′32″ N · 9°50′15″ E" };  // from the existing map marker
export const seasonal = { nye: { until: "2027-01-01" } };
```

No existing string, figure, price or image changes.

---

## 16. File ownership, build order and verification

**FOUNDATION agent** owns:
- `src/app/globals.css`, `src/app/layout.tsx` and `src/app/(site)/layout.tsx`;
- `src/lib/site.ts` (additive exports only);
- all of `src/components/*`: `ui.tsx`, `logo.tsx`, `reveal.tsx`, `header.tsx`, `footer.tsx`, `booking-bar.tsx`, `newsletter-form.tsx`, `inquiry-form.tsx`, and every new shared file: `craft-defs.tsx`, `craft.tsx`, `identity.tsx`, `guilloche.tsx`, `engravings/*`, `motion/lines.tsx`, `motion/counter.tsx`, `rail-controls.tsx`, `sticky-reserve.tsx`.

**PAGE agents** own only:
- `src/app/(site)/page.tsx`;
- `stay/page.tsx` and `stay/[slug]/page.tsx`;
- `dine/page.tsx`;
- `whisky-wine/page.tsx`;
- `spa/page.tsx`;
- `heritage/page.tsx`;
- `contact/page.tsx`;
- `src/app/not-found.tsx`.

**Page agent rules:**
- Consume foundation primitives. Never edit a component, `globals.css` or `site.ts`. If something is missing, request it.
- Page-specific one-off CSS is expressed with tokens via Tailwind arbitrary values (`z-(--z-raised)`, `duration-(--dur-base)`, `ease-(--ease-settle)`). No hex or rgba.
- `src/app/admin/*` and `src/app/api/*` are out of scope, but `Logo` must keep working there.

**Order:**
1. Foundation: tokens, scopes, roles, keyframes; `CraftDefs`; `Reveal` and `Lines`; `Engraving` kit plus `lake` and `pine` first (they fill the most slots); `ui.tsx` upgrades; `craft.tsx`; `identity.tsx`; header, footer, booking bar and forms; then the remaining engravings.
2. Pages in parallel, against the published APIs in §4.

**Verify after each step:**
```bash
cd "/Users/arshad/Desktop/Waldhaus Hotels/site" && PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit
PATH=/opt/homebrew/bin:$PATH npx eslint <changed files>   # baseline had 1 error: header.tsx:23 (fixed by §5)
for r in / /stay /stay/single /stay/double-lake-view /dine /whisky-wine /spa /heritage /contact "/contact?type=room"; do
  curl -s -o /dev/null -w "%{http_code} $r\n" "http://localhost:3100$r"; done          # all 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3100/nope                     # 404 page renders
curl -s http://localhost:3100/ | grep -E "__next_error__|Unhandled Runtime Error|Application error" # nothing
curl -s http://localhost:3100/ | grep -c "engravings/"                                  # 0 (no JPG requests)
grep -rnE "#[0-9a-fA-F]{3,8}\b|rgba\(" src/components src/app --include=*.tsx          # nothing
```

- **Do not** start, stop or restart the dev server, and do not use browser tools.
- If the server is down, report it rather than restarting it.
- Scroll-driven effects, curtains and reduced motion still need a human visual pass in a browser, including one pass with reduced motion on.

---

## 17. Open questions for Asgar

1. **`--color-gold-ink` (`#86612c`)** for gold text under 24px on light grounds. It is an AA fix, and a slightly deeper shade of the same role.
2. **Copper foil for Devil's Place:** deferred. Gold remains the only foil.
3. **EN/DE toggle:** it only flips local state, which misleads guests. Keep it, hide it, or disable DE until translations exist?
4. **Content conflicts with the audit** (not changed, because `site.ts` is frozen):
   - "Free parking": the audit says parking is paid;
   - the Guinness "since 1999" and Wine Spectator claims need verification;
   - "Best 3-Star Hotel" needs a date.
5. **The NYE tassel:** yes or no?
6. **NYE expiry:** is `seasonal.nye.until = 2027-01-01` correct?

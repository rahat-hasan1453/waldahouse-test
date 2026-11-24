export const meta = {
  name: 'waldhaus-elevate',
  description: 'Elevate the Waldhaus site design: 3 concepts, judge into spec, build foundation, elevate pages in parallel, review',
  phases: [
    { title: 'Concept', detail: 'three independent elevation concepts from different angles' },
    { title: 'Spec', detail: 'judge + synthesize one elevation spec, update design docs' },
    { title: 'Foundation', detail: 'tokens, primitives, engravings, header/footer' },
    { title: 'Pages', detail: 'one agent per page group, in parallel' },
    { title: 'Review', detail: 'consistency + correctness review and fixes' },
  ],
}

const ROOT = '/Users/arshad/Desktop/Waldhaus Hotels'
const SITE = ROOT + '/site'

const CONTEXT = `
PROJECT: Redesign of Hotel Waldhaus am See, St. Moritz (3-star Superior, lakeside, since 1885, home of Devil's Place whisky bar with 2,500+ whiskies, Cave Waldhaus wine cellar).
The user built an ORIGINAL design (Next.js 16 App Router, React 19, Tailwind CSS v4 via @theme in src/app/globals.css). It is copied to ${SITE} (work here). The pristine original is ${ROOT}/Ref. — NEVER edit anything in Ref.
User's brief (verbatim intent): "Design the next level. Things we can keep the same: Typography Scales, How the color applies. I actually love what I have. But elevate my love as high as the 11th sky."
Design direction doc: ${ROOT}/docs/design/design-direction.md (essence: "restraint around craft" — deep saturated grounds, one metallic accent, spaced uppercase type, one richly detailed element per view, heritage made modern through composition).
Reference images (look at them with the Read tool): ${ROOT}/docs/references/moodboard/01-aged-21-copper-foil-on-green.png (copper foil "Aged 21" on green cloth: scale contrast, debossed foil), 02-green-engraving-gold-foil.png (tone-on-tone green engraving with gold foil highlights), 03-rum-label-badges.png (label badges with guilloche + dotted borders + gold rules), 04-engraved-fruit-black.png and 05-engraved-peach-gold.png (line engravings of fruit, black and gold), 06-heritage-residence-brochure.png (gold serif caps on cream paper, huge whitespace, monogram, burgundy ground, tassel), 07-ginori-1735-copper-foil.png (Ginori 1735: huge cropped flared serif in copper foil on aubergine), 08-westminster-kennel-club.png (Westminster Kennel Club modular logo system: stacked/horizontal/compact lockups around one engraved emblem).
Audit of the business: ${ROOT}/docs/research/waldhaus-audit.md.

HARD CONSTRAINTS
1. KEEP the typography scale: font families (Marcellus display, Cormorant Garamond editorial italic, Jost sans), the .eyebrow/.display/.editorial class definitions, and every existing clamp()/text-size value used for headings, leads and labels. You may add NEW type roles (e.g. a numeral style, a micro-caption) but must not resize existing ones.
2. KEEP how colour applies: each section keeps its surface (paper/linen light, .cloth forest, .velvet burgundy, bg-ink dark) and gold/foil stays the accent in the same roles. Existing colour tokens keep their hex values; you may add derived tokens (tints, foil stops, hairline alphas) in @theme.
3. Content and facts in src/lib/site.ts must not be changed (you may ADD new fields/exports, never alter existing copy, figures, prices or images).
4. No new npm dependencies. Pure React + CSS + inline SVG. Keep it performant.
5. Design system must stay dynamic: every new colour, duration, easing, radius, hairline, texture value is a CSS custom property / @theme token in src/app/globals.css and components reference tokens — no new hardcoded hex values in components (migrate the existing hardcoded hexes in ui.tsx to tokens).
6. Accessibility: honour prefers-reduced-motion for every animation, visible :focus-visible states, no zoom blocking, meaningful alt text, sufficient contrast for body text.
7. A dev server is ALREADY running at http://localhost:3100 (npm run dev in ${SITE}). Do NOT start, stop or restart any server and do NOT use the browser tools. Verify with: cd "${SITE}" && PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit ; PATH=/opt/homebrew/bin:$PATH npx eslint <your files> ; and curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/<route> (must be 200), plus curl the HTML and grep for obvious runtime error markers.
8. Next.js 16 specifics: route params/searchParams are Promises; the global PageProps type exists. If unsure about an API, read node_modules/next/dist/docs or the existing code patterns.
`

// ---------------- Concept ----------------
phase('Concept')
const ANGLES = [
  { key: 'craft', title: 'Material & Craft', brief: 'Elevate through material honesty translated to screen: foil (hot-foil stamping that catches light on scroll/hover), deboss/emboss/letterpress effects, paper and cloth grain, a real engraving illustration system (Alpine subjects: ibex, Lake St. Moritz + Maloja peaks, Swiss stone pine/arolla, gentian/edelweiss/thistle, grapes, whisky still/barrel), guilloche rosettes, seals, spirits-label fact badges, hairline frames with corner ornaments, monogram and sub-brand lockups (Waldhaus, Devil\'s Place, Cave Waldhaus, Fondue Stübli). Refs 1,2,3,4,5,6,7,8.' },
  { key: 'motion', title: 'Cinematic Motion & Choreography', brief: 'Elevate through time: an orchestrated entrance for the hero, masked line-by-line reveals for display headings, scroll-linked parallax and foil shimmer, slow Ken Burns, image curtain/clip-path reveals, count-up numerals (2,500), hover micro-interactions on cards/buttons/links, menu choreography, a progress/section indicator. Everything slow, weighted and quiet — luxury pacing, never gimmicky; CSS-first (scroll-driven animations with fallbacks, IntersectionObserver), reduced-motion safe.' },
  { key: 'editorial', title: 'Editorial Composition & Identity', brief: 'Elevate through layout and brand architecture: magazine-grade grids, asymmetry, oversized cropped numerals and words bleeding off the edge (ref 7), extreme scale contrast (ref 1), generous negative space (ref 6), chapter numbering (roman numerals), captions and marginalia, a modular identity system with sub-brand lockups (ref 8), a more luxurious booking experience, full-screen navigation with imagery, footer as a colophon, and how each page gets one hero moment.' },
]

const concepts = await parallel(ANGLES.map(a => () => agent(
  `${CONTEXT}

YOUR TASK (read-only, do NOT edit files): You are a world-class art director at a luxury hospitality branding studio. Study the current site code in ${SITE}/src (read globals.css, components/*, lib/site.ts and every page under app/(site)), the reference images, and the design direction doc. Propose how to ELEVATE this design from the angle: **${a.title}**.
Angle brief: ${a.brief}

Respect the HARD CONSTRAINTS (especially: keep type scale + colour application). Be concrete and implementable: for each proposal give (a) what/where (component or page + section), (b) exact visual behaviour, (c) implementation sketch (CSS/SVG/React technique, token names), (d) why it elevates (which reference). Cover: shared primitives, header/nav, hero, every home section, each inner page (stay, stay/[slug], dine, whisky-wine, spa, heritage, contact, not-found), footer, forms, booking bar. Also: what to REMOVE or quiet down to gain restraint. Rank proposals by impact. Aim for 40-70 concrete proposals. Return markdown.`,
  { label: `concept:${a.key}`, phase: 'Concept' }
)))

// ---------------- Spec ----------------
phase('Spec')
const specResult = await agent(
  `${CONTEXT}

YOUR TASK: You are the creative director making the final call. Three art directors proposed elevations from different angles. Judge them, then SYNTHESIZE one coherent, restrained, implementable elevation spec. Pick the strongest, most cohesive ideas; drop anything gimmicky, heavy, off-brand, or that violates the constraints; resolve conflicts. The result must feel like one hand designed it: modern, elegant, minimal, crafted.

=== CONCEPT A: Material & Craft ===
${concepts[0] || '(missing)'}

=== CONCEPT B: Cinematic Motion & Choreography ===
${concepts[1] || '(missing)'}

=== CONCEPT C: Editorial Composition & Identity ===
${concepts[2] || '(missing)'}

Before writing, read ${SITE}/src (globals.css, components, lib/site.ts, pages) so the spec is precise about current code.

WRITE these files:
1. ${ROOT}/docs/design/elevation-spec.md — the build spec. Structure:
   - "Elevation thesis" (5-8 lines)
   - "Invariants" (type scale + colour application kept — list the exact classes/values that must not change)
   - "Tokens to add" — exact CSS custom property names + values for globals.css (@theme and :root): foil stops, hairline alphas, grain, easing curves (e.g. --ease-silk), durations, shadows (deboss/emboss), z-layers, frame insets, etc.
   - "Shared primitives" — for each: name, file, props API, visual + motion behaviour. Must include: Engraving system (inline SVG line-engraving artworks as React components, drawn with hatching/cross-hatching strokes in currentColor, subjects: ibex, lake (St. Moritz lake + Maloja peaks), pine (Swiss stone pine branch with cone), thistle or gentian/edelweiss, grapes; keep the existing <Engraving name=... color=...> API working), foil text with light-catching shimmer, Seal, Ornament, Button, SectionHeading, PageHero, Photo (curtain reveal), Reveal (+ line-mask heading reveal), counters, fact badges, framed/corner-ornament cards, monogram + sub-brand lockups, marquee/awards band, section chapter numbering.
   - "Header & navigation", "Footer", "Booking bar", "Forms"
   - Per page sections: Home (every section), Stay, Stay detail, Dine, Whisky & Wine, Spa, Heritage, Contact, Not found — each with concrete changes.
   - "Restraint list" — what to remove/quiet.
   - "Motion rules" and "Accessibility rules".
   - "File ownership": FOUNDATION owns src/app/globals.css, src/app/layout.tsx, src/components/* (ui.tsx, logo.tsx, reveal.tsx, header.tsx, footer.tsx, booking-bar.tsx, newsletter-form.tsx, inquiry-form.tsx and any NEW shared components such as engravings.tsx, motion components). PAGE agents own only their page files under src/app/(site)/... and src/app/not-found.tsx, and consume foundation primitives.
2. Update ${ROOT}/docs/design/design-direction.md so its Tokens section matches the REAL token system in ${SITE}/src/app/globals.css (colours: ink, forest, pine, emerald, sage, mist, cream, parchment, linen, gold, gold-light, gold-deep, copper, burgundy, wine, claret; fonts: Marcellus display, Cormorant Garamond editorial, Jost sans; surfaces paper/cloth/velvet/ink and which audience/section uses which), state that ${SITE}/src/app/globals.css @theme is the code source of truth mirrored by this doc, reference elevation-spec.md, and add a changelog entry "2026-09-28: Synced to original design (Ref.) tokens; elevation spec added". Keep its essence/principles.

Return a concise summary (<= 40 lines) of the thesis and the top 15 decisions.`,
  { label: 'spec:synthesize', phase: 'Spec' }
)
log('Spec written to docs/design/elevation-spec.md')

// ---------------- Foundation ----------------
phase('Foundation')
const BUILD_SCHEMA = {
  type: 'object',
  properties: {
    files_changed: { type: 'array', items: { type: 'string' } },
    summary: { type: 'string' },
    primitives_api: { type: 'string', description: 'For foundation: exact exports/props page agents should use. Else empty.' },
    verification: { type: 'string', description: 'tsc/eslint/curl results' },
    open_issues: { type: 'array', items: { type: 'string' } },
  },
  required: ['files_changed', 'summary', 'primitives_api', 'verification', 'open_issues'],
}

const foundation = await agent(
  `${CONTEXT}

RESUME NOTE: The folder ${ROOT}/Ref. is now EMPTY (do not touch it). The pristine original baseline is at ${ROOT}/docs/design/original-baseline/src (read-only; use it for diffs). A previous attempt of this foundation task was interrupted by a usage limit after it had already (a) appended additive exports to src/lib/site.ts (toRoman, chapters, brands, geo, seasonal) and (b) written src/components/engravings/kit.tsx (seeded engraving geometry helpers). Review and reuse/continue that work rather than starting over.

YOUR TASK: Implement the FOUNDATION layer of the elevation exactly per ${ROOT}/docs/design/elevation-spec.md (read it fully first; also read the reference images). You own: src/app/globals.css, src/app/layout.tsx, and everything in src/components/ (ui.tsx, logo.tsx, reveal.tsx, header.tsx, footer.tsx, booking-bar.tsx, newsletter-form.tsx, inquiry-form.tsx) plus any NEW shared component files. Do NOT edit page files under src/app/(site)/ except where an existing primitive's API change would otherwise break a page — prefer keeping existing APIs backward compatible so pages keep compiling (add new props/components rather than renaming).

Must deliver:
- All spec tokens in globals.css (@theme / :root) and utilities; migrate hardcoded hexes in components to tokens.
- A real ENGRAVING system: inline SVG line-engraving artworks as React components (e.g. src/components/engravings.tsx) — genuinely crafted, recognisable subjects (ibex, lake with Maloja peaks, Swiss stone pine branch with cone, thistle, grapes; add gentian or edelweiss if the spec asks), built from many fine hatching / cross-hatching / contour strokes in currentColor so they read like steel engravings (refs 4, 5, 2). Use <pattern>s of fine lines clipped to shapes plus hand-drawn contour paths; vary hatch angle per form to model volume. The existing <Engraving name color className style/> API must keep working (render the SVG instead of the missing /engravings/*.jpg mask) so current pages instantly show artwork.
- Elevated shared primitives per spec (foil shimmer, Seal, Ornament, Button, SectionHeading, PageHero, Photo reveal, Reveal + heading line reveal, counters, fact badges, framed cards, monogram + sub-brand lockups, awards marquee, chapter numbers — whatever the spec lists), header/nav (incl. full-screen menu), footer, booking bar, forms.
- Everything reduced-motion safe with focus-visible styles.
Verify: tsc clean, eslint clean on your files, every route (/ /stay /stay/double-lake-view /dine /whisky-wine /spa /heritage /contact /does-not-exist[404 expected]) returns expected status via curl, and fetched HTML contains no error overlay text.
In primitives_api return the precise import paths, component names and props that page agents must use (this is handed to them verbatim).`,
  { label: 'build:foundation', phase: 'Foundation', schema: BUILD_SCHEMA }
)
log('Foundation done: ' + (foundation ? foundation.files_changed.length + ' files' : 'FAILED'))

// ---------------- Pages ----------------
const PAGES = [
  { key: 'home', files: 'src/app/(site)/page.tsx', routes: '/' },
  { key: 'stay', files: 'src/app/(site)/stay/page.tsx and src/app/(site)/stay/[slug]/page.tsx', routes: '/stay /stay/double-lake-view /stay/single' },
  { key: 'dine', files: 'src/app/(site)/dine/page.tsx', routes: '/dine' },
  { key: 'whisky-wine', files: 'src/app/(site)/whisky-wine/page.tsx', routes: '/whisky-wine' },
  { key: 'spa-heritage', files: 'src/app/(site)/spa/page.tsx and src/app/(site)/heritage/page.tsx', routes: '/spa /heritage' },
  { key: 'contact-404', files: 'src/app/(site)/contact/page.tsx and src/app/not-found.tsx', routes: '/contact /contact?type=event /nope (404)' },
]

const pageResults = await parallel(PAGES.map(p => () => agent(
  `${CONTEXT}

RESUME NOTE: The folder ${ROOT}/Ref. is now EMPTY (do not touch it). The pristine original baseline is at ${ROOT}/docs/design/original-baseline/src (read-only; use it for diffs). 

YOUR TASK: Elevate the page(s) you own per ${ROOT}/docs/design/elevation-spec.md (read the whole spec, focus on your page sections). The foundation layer is already built. Your page file(s) may already contain partial edits from an interrupted earlier attempt of this same task; review them against the spec and complete/correct them rather than reverting.
You own ONLY: ${p.files}. Do NOT edit src/components/*, globals.css, layout.tsx, lib/site.ts or other pages (other agents are editing them in parallel). If you need something small and page-specific, define it inside your own page file. If a shared primitive is missing or buggy, note it in open_issues instead of editing it.

Foundation primitives API (use these, keep visual language consistent across the site):
${foundation ? foundation.primitives_api : '(foundation failed — read src/components to discover the API)'}

Foundation summary: ${foundation ? foundation.summary : ''}

Rules: keep all existing copy/data (from lib/site.ts and inline copy) — you may re-compose layout, add captions/marginalia that restate existing facts, but do not invent new facts, prices, awards or claims. Keep type scale and each section's colour surface. Give the page ONE clear hero moment and apply the spec's restraint list.
Verify: tsc clean, eslint clean on your files, curl ${p.routes} returns expected status and no error markers in the HTML.`,
  { label: `page:${p.key}`, phase: 'Pages', schema: BUILD_SCHEMA }
)))

// ---------------- Review ----------------
phase('Review')
const pageSummaries = PAGES.map((p, i) => `## ${p.key}\n${pageResults[i] ? pageResults[i].summary + '\nOpen issues: ' + JSON.stringify(pageResults[i].open_issues) : 'FAILED'}`).join('\n\n')

const review = await agent(
  `${CONTEXT}

RESUME NOTE: The folder ${ROOT}/Ref. is now EMPTY (do not touch it). The pristine original baseline is at ${ROOT}/docs/design/original-baseline/src (read-only; use it for diffs). 

YOUR TASK: Final consistency + correctness pass across the whole elevated site in ${SITE}, as a meticulous design-engineering lead. The spec is ${ROOT}/docs/design/elevation-spec.md.

Page agents reported:
${pageSummaries}

Foundation open issues: ${foundation ? JSON.stringify(foundation.open_issues) : 'foundation failed'}

Do:
1. Resolve every open issue above (you may edit any file in ${SITE}/src now).
2. Diff against ${ROOT}/docs/design/original-baseline/src and ${ROOT}/docs/design/original-baseline/package.json (e.g. diff -ru) to confirm invariants: typography scale values and colour application unchanged; lib/site.ts existing content unchanged; no new dependencies in package.json.
3. Check consistency: same primitives used the same way everywhere; no hardcoded hex colours in components/pages (tokens only); reduced-motion coverage for every animation/keyframe; focus-visible states; alt text; no layout-breaking overflow on mobile (check for fixed widths without max-w, horizontal scroll risks).
4. Fix bugs: hydration-risky code (Date/Math.random in render, window access during SSR), client/server component boundaries ("use client" where hooks are used), keys, unused imports.
5. Verify: tsc clean; eslint clean on src; every route (/ /stay /stay/double-lake-view /stay/single /stay/apartment-suite /dine /whisky-wine /spa /heritage /contact /contact?type=event) returns 200 and /nope returns 404; fetched HTML has no error markers. Also run PATH=/opt/homebrew/bin:$PATH npx next build is NOT allowed (it would conflict with the running dev server) — skip build.
Return: files changed, what you fixed, remaining risks.`,
  { label: 'review:consistency', phase: 'Review', schema: BUILD_SCHEMA }
)

return {
  spec: specResult,
  foundation: foundation && { files: foundation.files_changed, summary: foundation.summary, issues: foundation.open_issues, verification: foundation.verification },
  pages: PAGES.map((p, i) => ({ page: p.key, summary: pageResults[i] && pageResults[i].summary, issues: pageResults[i] && pageResults[i].open_issues, verification: pageResults[i] && pageResults[i].verification })),
  review: review && { files: review.files_changed, summary: review.summary, issues: review.open_issues, verification: review.verification },
}

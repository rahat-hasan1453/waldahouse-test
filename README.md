# Waldhaus am See: Website Redesign

Redesign of [waldhaus-am-see.ch](https://www.waldhaus-am-see.ch), the lakeside hotel, restaurant and Devil's Place whisky bar in St. Moritz, Switzerland.

## What's in this repository

| Path | What it is |
|---|---|
| `Ref/` | **The working website** (Next.js 16, React 19, Tailwind CSS v4). All current work happens here. |
| `site/` | A frozen snapshot of the site as of 2026-09-29. Do not edit. |
| `docs/research/waldhaus-audit.md` | Research audit: business, offerings, information architecture, user flows, UX defects, reviews, competitors. |
| `docs/design/design-direction.md` | The design system: tokens, typography, surfaces, motion, identity, and a changelog of every design change. |
| `docs/design/elevation-spec.md` | The detailed build spec for the elevated design. |
| `docs/references/` | **Every supplied reference in one place**: moodboard, brand assets, layout references, feedback screenshots, original photos and footage (index in its README). |
| `docs/design/original-baseline/` | The original design's source, before the elevation. |
| `CLAUDE.md` | Project brief and rules for AI-assisted work. |
| `.claude/` | Local preview config and workflow scripts. |

## Run the website locally

Requires Node.js 20 or later.

```bash
cd Ref
npm install
cp .env.example .env.local   # then adjust if needed
npm run dev
```

Open http://localhost:3000.

Other commands (run in `Ref`): `npm run build`, `npm run lint`, `npm run typecheck`. In a fresh copy, run `npx next typegen` once before `npm run typecheck`.

## Assets

- Hero film: `Ref/public/video/hero-drone-full-*` (WebM for most browsers, MP4 fallback, 720p for phones) and its poster.
- Devil's Place films: `Ref/public/video/devils-place*.mp4`.
- Brand logo: `Ref/public/brand/waldhaus-logo.png`.
- Photography: `Ref/public/images/`; further stock images are loaded from Pexels (see `Ref/src/lib/site.ts`).
- Engravings are drawn in code (`Ref/src/components/engravings/`); the pomegranate plate uses `Ref/public/engravings/pomegranate.png`.

## Notes

- The enquiry form, newsletter and `/admin` need a Postgres database (`DATABASE_URL`); all pages render without one.
- **Languages (EN | DE):** all site copy lives in SELISE Blocks Localization, one module per page plus `common`. Edit translations in the Blocks portal or with the `blocks localization` CLI; German changes show on the live site within about ten minutes. English is bundled from `Ref/blocks/localization/*.en-US.json`: after changing English copy in Blocks, refresh those files with `blocks localization pull --module <name> --language en-US --out blocks/localization/<name>.en-US.json` (run in `Ref`) and redeploy. In code, use `<T m="module" k="key" />` (server components) or `useT()` (client components) from `src/lib/i18n/provider.tsx`.
- Some award and record claims in the copy are flagged as unverified in the research audit. Confirm them with the hotel before launch.

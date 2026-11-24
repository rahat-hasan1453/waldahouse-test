# Waldhaus am See: Website Redesign

## Project Context
- **Product:** Redesign of https://www.waldhaus-am-see.ch (3★S lakeside hotel, restaurant and whisky bar in St. Moritz)
- **Phase:** Design approved by Asgar (2026-09-28); elevated build in `Ref` (the working project). `site/` is a frozen snapshot of the 2026-09-29 version: do not edit it. New direction changes still need Asgar's go-ahead.
- **Stack:** Next.js 16.3 (App Router) · React 19 · Tailwind CSS v4 (tokens in `src/app/globals.css` `@theme`) · Drizzle + Postgres (inquiries/newsletter/admin)
- **Commands** (run in `Ref`): dev: `npm run dev` · build: `npm run build` · typecheck: `npm run typecheck` (run `npx next typegen` first in a fresh copy) · lint: `npm run lint`
- **Design source:** TBD (Figma link)
- **Booking engine (existing):** Mews. Plan tier unknown (widget/deep links vs Enterprise API).

## Design System
All design work (Figma, Stitch, mockups, code) must follow this direction and reference its tokens by name, never hardcoded values. When the direction changes, update this file first (and its changelog), then propagate.

@docs/design/design-direction.md

## Research
Full audit of the business, offerings, IA, user flows, UX defects, tech stack, reviews and competitors:

@docs/research/waldhaus-audit.md

<!-- blocks-skills:start -->
## SELISE Blocks

For Blocks work in this repo, read [AGENTS.md](./AGENTS.md) and follow the Blocks section there.

This block scopes Blocks rules only; it says nothing about the rest of this file. Keep Blocks
guidance in `AGENTS.md` rather than duplicating it here — a second copy will drift.
<!-- blocks-skills:end -->

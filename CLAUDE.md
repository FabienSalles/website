# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm ci                          # Install dependencies (CI uses Node 20, .nvmrc pins v23.8.0)
npm run dev                     # Dev server at localhost:4321
npm run build                   # Regenerates src/data/sitemap-dates.json, then astro build → dist/
npm test                        # Run all vitest tests
npx vitest run tests/linkedin/service.test.ts   # Run a single test file
npm run test:coverage           # Tests with coverage
npm run optimize-image -- <input> [output] [--quality N] [--width N]   # Convert image to WebP
```

## Architecture

Personal website (fabiensalles.com) built with Astro 5, statically generated, deployed on Netlify. Tailwind for styling, React only for interactive islands (e.g. `ImageWithCaption.tsx`), MDX for blog content.

### Content collections (`src/content/config.ts`)

Two collections with Zod schemas: `blog` and `cv`. Blog frontmatter drives site behavior:

- `draft: true` excludes a post from **production** builds only; every route that lists posts repeats the filter `import.meta.env.PROD ? !data.draft : true` (`src/pages/blog/index.astro`, `blog/[...slug].astro`, `blog/categories/[category].astro`, `rss.xml.ts`, and the root `[...slug].astro`). Adding a new listing route means adding this filter too.
- `service` links a post to a service page (formation-phpunit, audit, accompagnement…) for CTAs.
- `linkedinPostUrl` enables the LinkedIn metrics display.

### Root catch-all route (`src/pages/[...slug].astro`)

Duplicates the site's routing: it statically imports the page components (index, about, blog index, CV, formations, blog posts, categories) and maps slugs to them via `getStaticPaths` + a route/component map. Changes to blog or category routing must be mirrored there.

### LinkedIn metrics

- `src/linkedin/` is the domain module (`extract-post-id`, `access-token`, `get-metrics`, `cache`) plus a client-side `LinkedInService` that fetches `/.netlify/functions/linkedin-metrics`.
- `netlify/functions/linkedin-metrics.ts` is the serverless function wiring those API helpers together.

### Sitemap lastmod dates

`scripts/generate-sitemap-dates.mjs` derives each page's last-modified date from `git log` and writes `src/data/sitemap-dates.json`, which `astro.config.mjs` reads in the sitemap `serialize` hook. A GitHub Action (`.github/workflows/update-sitemap-dates.yml`) regenerates and auto-commits this file on pushes to `main` touching `src/content/` or `src/pages/` — don't edit the JSON by hand.

### Configuration

- Path aliases in `tsconfig.json`: `@components/*`, `@utils/*`, `@pages/*`, `@linkedin/api/*`, `@linkedin` (vitest resolves them via `vite-tsconfig-paths`).
- Feature flags and secrets live in `.env` (`TRANSLATION_ENABLED`, `NEWSLETTER_ENABLED`, `GOOGLE_ANALYTICS_ID`…), read through `import.meta.env`.
- Tests: vitest, node environment, `globals: true`, files matched by `**/*.test.ts` under `tests/` (mirroring `src/` structure).

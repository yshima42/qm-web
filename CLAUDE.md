# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QuitMate — a multilingual SNS for addiction recovery (alcohol, gambling, smoking, porn, etc.). Yarn monorepo with Turborepo. The web app is deployed on Vercel; the LP (Astro) is deployed on Cloudflare Pages (`wrangler.toml` in `apps/lp/`).

## Monorepo Structure

- **apps/web** — Main SNS app (Next.js 15, React 19, Supabase, TanStack Query, shadcn/ui)
- **apps/lp** — Landing pages + blog + legal docs for each "mate" app (Astro 5, Tailwind v4, Content Collections)
- **apps/webv1** — Legacy/archived version (do not modify)
- **packages/ui** — Shared UI components (@quitmate/ui)
- **packages/analytics** — Google Analytics 4 wrapper (@quitmate/analytics)
- **packages/utils** — Utility functions like `cn()` (@quitmate/utils)

## Common Commands

```bash
# Install dependencies
yarn install

# Dev servers (run from root)
yarn dev:web:local    # Web app with .env.local
yarn dev:web:dev      # Web app with .env.dev
yarn dev:web:prod     # Web app with .env.prod
yarn dev:lp           # Landing page

# Build
yarn turbo run build --filter=web
yarn build:lp

# Lint & format
yarn workspace web lint
yarn workspace web lint:fix
yarn workspace web lint:type    # TypeScript type checking
yarn workspace lp lint
yarn format                     # Prettier (all)

# Add packages to a workspace
yarn workspace web add <package>
yarn workspace lp add <package>
yarn workspace @quitmate/ui add <package>
```

## Pre-commit Hooks (Husky + lint-staged)

Commits trigger: lint-staged (ESLint + Prettier) → `lint:type` on web → full web build. Be aware the pre-commit hook runs a build, so commits take time.

## Architecture Notes

### Web App (`apps/web/src/`)
- **App Router** with `(main)/` group for authenticated routes and `auth/` for login flows
- **Feature modules** in `features/` (articles, habits, profiles, reports, settings, stories) — each feature encapsulates its own components, hooks, and logic
- **Supabase** for DB and auth — clients in `lib/supabase/{client,server,admin}.ts`
- **Data fetching** via TanStack React Query
- **UI components** in `components/ui/` follow shadcn/ui "new-york" style
- **i18n** via `next-intl` — locales: `en`, `ja` — messages in `apps/web/messages/`

### LP App (`apps/lp/src/`)
- **Astro 5** with `output: "static"`; per-locale page directories (`pages/en/`, `pages/ja/`) instead of dynamic `[locale]` routing
- **Namespaces** for each mate app defined in `i18n/config.ts`: `alcohol`, `kinshu`, `porn`, `tobacco` — with `namespaceToPath` mapping (e.g. `alcohol` → `/challenge`, `kinshu` → `/alcohol`)
- **Content Collections** in `src/content/` (`blog/{en,ja}`, `documents/{namespace}/{locale}`) — schemas in `content.config.ts`
- Shared section components in `components/sections/` are `.astro` files (`Hero.astro`, `Features.astro`, `FinalCTA.astro`, `StoreBadges.astro`, `FAQ.astro`, etc.)
- Store links (Apple/Google Play) configured in `components/sections/StoreBadges.astro` per namespace
- **i18n** via Astro's built-in i18n (`astro.config.mjs`); messages in `src/i18n/messages/{en,ja}.json`
- Single root layout in `layouts/BaseLayout.astro`
- **OG images** generated dynamically with `satori` + `@resvg/resvg-js` (see `pages/og/`)
- **Sitemap** via `@astrojs/sitemap` with `lastmod` pulled from blog frontmatter at build time
- **CJK-friendly markdown** via `remark-cjk-friendly` (important for Japanese line-breaking)
- Uses **Tailwind CSS v4** via `@tailwindcss/vite`

### Shared Packages
- `@quitmate/ui` exports reusable components (buttons, dialogs, category icons, etc.)
- Path alias `@/*` maps to `./src/*` in both apps

## Key Conventions

- **Language**: Japanese is the primary language for UI text, commit messages, and comments
- **Main branch**: `dev` (not `main`)
- **Formatting**: Prettier with double quotes, semicolons, 2-space indent, 100 char width, LF line endings
- **Styling**: Tailwind CSS with `tailwindcss-animate` plugin; dark mode via class strategy (web) / media query (lp)
- **Fonts**: Noto Sans JP + Inter (web)

## Environment Variables

Web app requires `.env.local` / `.env.dev` / `.env.prod` with:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Deployment

- Web: https://www.quitmate.app/ — Vercel
- LP: https://about.quitmate.app/ — Cloudflare Pages (config in `apps/lp/wrangler.toml`)

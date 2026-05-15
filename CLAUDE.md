# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
# Development
npm run dev          # Start Next.js dev server

# Build & lint
npm run build        # Production build
npm run lint         # ESLint

# Database
npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:migrate   # Run migrations (uses DIRECT_URL from prisma.config.ts)
npm run db:push      # Push schema without migrations (prototyping only)
npm run db:studio    # Open Prisma Studio
```

After editing `prisma/schema.prisma`, always run `npm run db:generate` before starting the dev server — the generated client lives in `lib/generated/prisma/` and the dev server will 500 on missing delegates if it's stale.

## Environment Variables

Copy `.env.example` to `.env`. Required vars:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Pooled Postgres URL (runtime queries) |
| `DIRECT_URL` | Direct Postgres URL (migrations via `prisma.config.ts`) |
| `ADMIN_EMAIL` | Admin login email (default: `admin@dignity.local`) |
| `ADMIN_PASSWORD` | Admin login password (local default: `admin12345`) |
| `ADMIN_AUTH_SECRET` | Secret for HMAC-signed session cookie (recommended in prod) |

## Architecture

### Tech Stack

- **Next.js 16** (App Router) — see `AGENTS.md` for breaking-change notice; read `node_modules/next/dist/docs/` before writing new Next.js patterns
- **React 19**, **TypeScript 5**, **Tailwind CSS 4**
- **Prisma 7** with `@prisma/adapter-pg` — serverless-friendly pg driver adapter
- **PostgreSQL** (Neon in production)

### Route Groups

| Group | Path | Purpose |
|---|---|---|
| `(admin)` | `/admin/*` | Protected CMS (blog management, course editing) |
| `(auth)` | `/admin/login` | Login form — outside the protected group |
| _(root)_ | everything else | Public marketing site |

`AppFrame` (`app/components/AppFrame.tsx`) suppresses `SiteHeader`/`Footer` for all `/admin` and `/api` paths — the admin shell has its own layout (`app/(admin)/admin/layout.tsx`).

### Authentication

Cookie-based, no external auth library. Two implementations that must stay in sync:

- `lib/admin-auth.ts` — Node.js runtime (Server Actions, Route Handlers): signs/verifies with `crypto.createHmac`
- `middleware.ts` — Edge runtime: signs/verifies with `crypto.subtle` (Web Crypto API)

Both sign a literal string `"admin"` with `ADMIN_AUTH_SECRET`. The session cookie (`dignity_admin_session`) is scoped to `path=/` and is valid for 8 hours.

### Database / Prisma

- Schema: `prisma/schema.prisma`
- Client output: `lib/generated/prisma/` (non-default path — import from there, not from `@prisma/client`)
- Singleton client: `lib/prisma.ts` — uses `PrismaPg` adapter with the pooled `DATABASE_URL`; migrations use the direct `DIRECT_URL` via `prisma.config.ts`

**Models:**
- `Post` — blog posts with `DRAFT | REVIEW | PUBLISHED` status; HTML stored in `contentHtml`
- `PublicCourse` + `PublicCourseLesson` — CMS-managed copy and video lessons for the public free forex courses; rows are auto-seeded on first request via `ensurePublicCourseByKey` in `lib/public-course.ts`

### Blog System

New blog flow: `/admin/blogs/new` → details step → write step → save to DB.  
Edit flow: `/admin/blogs/edit/[id]/details` and `/admin/blogs/edit/[id]/write`.

Draft state is persisted to `localStorage` during creation (see `app/(admin)/admin/blogs/new/components/blogDraftState.ts`). The Quill rich-text editor is used for blog body content.

Public blog data is fetched server-side via `lib/blog-public.ts` (`getPublishedBlogPosts`) and by slug via `lib/blog-html.ts`.

### Public Course CMS

Three courses are editable from `/admin/courses/*`. Their default content is defined in `lib/public-course-defaults.ts` and seeded automatically on first request. Course keys:
- `forex-free-beginner` — displayed at `/learn-forex` via `ForexBeginnerCourseView.tsx`
- `forex-free-intermediate` — displayed at `/learn-forex-intermediate` via `ForexIntermediateCourseView.tsx`
- `professional-advance` — displayed at `/learn-forex-advanced` via `ProfessionalAdvanceCourseView.tsx`

### Tools Page

`/tools` contains Dukascopy iframe-based widgets split into sub-routes: `/tools/pip-calculator`, `/tools/position-sizing-calculator`, `/tools/market-hours`, `/tools/economics-calendar`. The wrapper components live in `app/components/Dukascopy*.tsx`.

### lib/ Utilities

| File | Purpose |
|---|---|
| `lib/admin-auth.ts` | Session creation, validation, login/logout Server Actions |
| `lib/admin-actions.ts` | Server Actions for admin CRUD |
| `lib/blog-public.ts` | Public read queries for published posts |
| `lib/blog-html.ts` | Fetch post HTML by slug |
| `lib/blog-draft.ts` | Blog draft type + localStorage key |
| `lib/public-course.ts` | `ensurePublicCourseByKey`, course query helpers |
| `lib/public-course-defaults.ts` | Hardcoded seed content for courses |
| `lib/utils.ts` | `cn()` (clsx + tailwind-merge) |

### UI Components

`components/ui/` — shadcn-style primitives (badge, button, card, chart, input, label, sonner).  
`app/components/` — site-specific: `SiteHeader`, `Footer`, `AppFrame`, animation components (Aurora, BlurText, DotGrid, LightRays, StarBorder, StickyCursor), TradingView widget wrappers, Dukascopy widget wrappers.

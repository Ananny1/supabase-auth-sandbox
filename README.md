# Supabase Deployment Sandbox

A throwaway practice project for learning a Supabase + Vercel deployment
workflow. It is **not** a real product — just a minimal React + TypeScript
(Vite) app with Supabase auth wired up, used to practice getting an app from
local dev to a live deployment.

## Current state

This project now has a full dev/prod split set up:

- **Two Supabase projects**: `production` and `development` — completely
  separate databases, auth users, and settings. Nothing you do in one
  affects the other.
- **Two git branches**: `main` (production) and `development` (safe to
  break, test in here first).
- **One Vercel project**, connected to this GitHub repo, with environment
  variables scoped so each branch automatically talks to the matching
  Supabase project.

There is still no database migrations folder and no automated tests —
this is a practice project focused on the deploy workflow itself, not a
real app.

## What's here

- Vite + React + TypeScript scaffold
- Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com) components
  (`src/components/ui/`)
- `@supabase/supabase-js` client (`src/lib/supabase.ts`), configured to read
  its URL and anon key from environment variables — never hardcoded

### Project structure

Code is organized by feature, not dumped into one file, so it stays easy to
extend:

```
src/
  lib/
    supabase.ts       # Supabase client setup
    utils.ts          # shadcn helper (cn())
  auth/
    AuthContext.tsx   # session state + signUp/signIn/signOut — the only
                       # place that talks to supabase.auth directly
    AuthPage.tsx       # sign up / log in UI, consumes useAuth()
  home/
    HomePage.tsx        # post-login welcome screen, consumes useAuth()
  components/ui/         # shadcn primitives (button, input, card, label)
  App.tsx                 # composition root: wraps everything in
                           # <AuthProvider>, picks AuthPage vs HomePage
                           # based on session state
```

**Why it's split up this way:**
- `AuthContext` is the single source of truth for auth — all Supabase auth
  calls live there. Pages never call `supabase.auth.*` directly; they call
  `useAuth()` instead. This means the login form and the welcome page don't
  need session state passed down as props, and if the auth logic ever
  changes (e.g. adding OAuth), it only changes in one file.
- Each screen lives in its own folder named after what it does (`auth/`,
  `home/`). Adding a new screen later (e.g. a profile page) means adding a
  new folder, not editing a giant `App.tsx`.
- `lib/` holds shared, non-UI setup code (the Supabase client, small
  utilities) — things every feature might need.

## Environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase project values:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Find these in your Supabase project dashboard under **Project Settings > API**.
`.env.local` is gitignored and should never be committed. The same two
variable names need to be set in Vercel's project environment variables when
deploying.

## Running locally

```
npm install
npm run dev
```

## More

See **[WORKFLOW.md](./WORKFLOW.md)** for the deploy workflow, safety
checklist, and troubleshooting log.

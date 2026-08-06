# Supabase Deployment Sandbox

This is a practice project. It is **not** a real app — it's a small
React + TypeScript app used to learn how to connect Supabase and Vercel
together and deploy an app the right way.

## What's set up right now

- **Two Supabase projects**: `production` and `development`. They are
  two totally separate databases. Nothing you do in one touches the
  other.
- **Two git branches**: `main` (production) and `development` (safe to
  test things in).
- **One Vercel project**, connected to the GitHub repo. It knows which
  Supabase project to use based on which branch you push to.

There are no database migrations and no automated tests yet. This
project is only about learning the deploy workflow, not about building
a real product.

## What's inside the code

- Vite + React + TypeScript
- Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com) for the look of
  the buttons/inputs/cards (`src/components/ui/`)
- The Supabase client (`src/lib/supabase.ts`) — reads the project URL
  and key from environment variables, never hardcoded in the code

### How the code is organized

The code is split into folders by what each part does, instead of one
giant file:

```
src/
  lib/
    supabase.ts       # sets up the Supabase connection
    utils.ts          # small shadcn helper
  auth/
    AuthContext.tsx   # holds login state, only file that talks to Supabase auth
    AuthPage.tsx       # the sign up / log in screen
  home/
    HomePage.tsx        # the screen you see after logging in
  components/ui/         # shadcn's button/input/card pieces
  App.tsx                 # decides: show AuthPage or HomePage?
```

**Why it's organized this way:**
- Only `AuthContext` talks to Supabase directly. Every other file just
  asks it for what it needs (`useAuth()`). If login logic ever changes,
  you only change it in one place.
- Each screen has its own folder (`auth/`, `home/`). Adding a new screen
  later just means adding a new folder, not editing one huge file.
- `lib/` holds small setup code that many parts of the app might need.

## Environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase project's
values:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

You'll find both in your Supabase dashboard under **Project Settings >
API**. `.env.local` is never committed to git (it's in `.gitignore`).
The same two values also need to be added in Vercel when deploying.

## Running it locally

```
npm install
npm run dev
```

## More docs

- **[WORKFLOW.md](./WORKFLOW.md)** — how to safely make changes and
  deploy them, plus mistakes we made with Vercel/GitHub and how we
  fixed them.
- **[SUPABASE_ISSUES.md](./SUPABASE_ISSUES.md)** — problems we hit with
  Supabase specifically (signup errors, email limits, Resend setup).

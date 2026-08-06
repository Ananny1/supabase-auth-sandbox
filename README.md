# Supabase Deployment Sandbox

A throwaway practice project for learning a Supabase + Vercel deployment
workflow. It is **not** a real product — just a minimal React + TypeScript
(Vite) app with Supabase auth wired up, used to practice getting an app from
local dev to a live deployment.

## Current state

This project currently connects to a **single Supabase project only**
(referred to informally as "Prod" for now). There is no separate Dev project,
no database migrations folder, and no CI/CD pipeline yet — those will be
added later as the workflow is learned step by step.

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

## Issues we ran into (and how we fixed them)

Notes from setting this up, kept simple for future reference.

### 1. "Anonymous sign-ins are disabled" when clicking Sign Up

**Cause:** The Sign Up / Log In buttons used `type="submit"`, but the code only
handled the button's `onClick` (which calls `preventDefault()`). That stopped
the browser's normal form submission — which is also what runs the `required`
field check. So clicking Sign Up with empty fields still fired the request,
sending an empty email/password to Supabase. Supabase treats a signup with no
email as an "anonymous sign-in" attempt, which is disabled by default.

**Fix:** Added a manual check in the code — if email or password is empty,
show an error and stop, instead of calling Supabase.

### 2. "Email rate limit exceeded"

**Cause:** Supabase's built-in email sender (used until you set up your own)
only allows a few emails per hour. Every signup attempt sends a confirmation
email, so testing signup repeatedly used up the limit fast.

**Fix (quick, for a sandbox project):** Turn off **"Confirm email"** in
Supabase: Authentication → Sign In / Providers → Email. With this off, signup
finishes instantly and no email is sent at all, so this error can't happen.

**Note:** Turning this off does *not* instantly clear an already-tripped rate
limit — that resets on its own after about an hour. Also, using a fresh email
address you haven't tried yet was another quick workaround.

**Fix (proper, if you want real confirmation emails):** Set up your own email
sender (SMTP) — see below.

### 3. Setting up Resend as a custom email sender

We used [Resend](https://resend.com) so Supabase could send real confirmation
emails instead of relying on its limited built-in sender.

Ran into three mistakes in a row while filling out Supabase's SMTP form
(Authentication → Sign In / Providers → Emails):

- **"535 Invalid username"** — the Username field had the wrong value in it
  (browser autofill had put old saved-login data in there). Resend's SMTP
  requires the Username to be the literal word `resend` — not your Resend
  account name or email.
- **"535 Authentication credentials invalid"** — the Password field wasn't a
  real Resend API key yet. Fixed by creating one in Resend under **API
  keys** (with "Sending access") and pasting that in as the password.
- **"You can only send testing emails to your own email address"** — without
  a verified domain in Resend, it only delivers to the email address you
  signed up to Resend with. Any other recipient gets silently rejected.

**Correct SMTP settings for Resend:**
| Field | Value |
|---|---|
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` (literally this word) |
| Password | your Resend API key (starts with `re_`) |
| Sender email | `onboarding@resend.dev` (or an address on a verified domain) |

### 4. Wanting ANY email address to be able to sign up

With Resend's free/unverified setup, only your own account email can
receive confirmation emails. To let any real email sign up, you'd need to
verify your own domain in Resend (Domains tab, add DNS records) and send
from an address on that domain. For a sandbox project, it's simpler to just
turn off "Confirm email" instead (see issue #2) — no email sending needed at
all.

### General note: no manual users table needed

Supabase automatically creates and manages an `auth.users` table — visible
under Authentication → Users in the dashboard. No need to create a users
table yourself.

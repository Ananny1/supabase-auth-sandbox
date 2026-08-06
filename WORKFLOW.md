# Deployment Workflow & Troubleshooting

How this project's dev/prod split is wired together, how to make changes
safely, and a log of every mistake made while setting it up — kept simple
for future reference.

## Quick reference — which values go where

| Environment | Git branch | Vercel scope | Supabase project |
|---|---|---|---|
| Local dev (`npm run dev`) | any | — (uses `.env.local`) | `development` |
| Preview deployment | `development` (or any non-`main` branch) | Preview | `development` |
| Live production site | `main` | Production | `production` |

`.env.local` and Vercel's **Preview**-scoped variables should always hold
the `development` project's URL/anon key. Vercel's **Production**-scoped
variables should always hold the `production` project's URL/anon key.

## How to make a change, safely, step by step

1. Make sure you're on the `development` branch:
   ```
   git checkout development
   ```
2. Make your code changes.
3. Test locally first — `npm run dev` uses `.env.local`, which points at
   the `development` Supabase project, so it's safe to sign up/log in
   with test accounts.
4. Commit, then push:
   ```
   git push origin development
   ```
5. Vercel automatically builds a **Preview deployment** for this push.
   Open that preview URL and test again — this is the closest thing to
   "real" testing, since it's a real deployed build, still safely pointed
   at the `development` Supabase project.
6. Only once you're confident it works, merge into `main`:
   ```
   git checkout main
   git merge development
   git push origin main
   ```
7. Vercel automatically builds the **Production deployment** from `main`
   — this is the real live app, now using the `production` Supabase
   project. There is no extra "deploy" step to click; pushing to the
   branch *is* the deploy.

## Mistakes to avoid (things that actually went wrong while setting this up)

- **Never push straight to `main` without testing on `development`/Preview
  first.** `main` = real production, no safety net.
- **Vercel's "Development" environment ≠ the Supabase project named
  "development."** Pure naming coincidence. Vercel's env var scoping has
  three options — Production, Preview, Development (the last one is only
  for the local `vercel dev` CLI command). Branch deployments always use
  **Preview** — that's the one to scope variables to, not "Development."
- **Never commit `.env.local`.** It's gitignored on purpose and holds real
  keys — don't remove it from `.gitignore` or force-add it.
- **Don't create a second Vercel project for the same GitHub repo.**
  Doing this by accident once caused deployments to silently go to the
  wrong project. If a push doesn't seem to trigger anything, check
  Vercel's project list first for an accidental duplicate before
  debugging anything else.
- **Don't test signup repeatedly with the same email** if "Confirm email"
  is on for that project — each attempt sends a new confirmation link and
  invalidates the previous one, causing an `otp_expired` error when you
  click an old email. Either use a fresh email each time, or turn
  "Confirm email" off for whichever project you're testing on.
- **Each Supabase project's settings are completely independent.**
  Turning off "Confirm email," setting up SMTP, or changing the Site URL
  on `production` does **not** carry over to `development` (or vice
  versa) — configure each project's dashboard settings separately if you
  want them to match.
- **Env var changes in Vercel don't apply to already-built deployments.**
  After adding/editing a variable, go to the relevant deployment and
  click **Redeploy** — otherwise it's still running with the old values.

## Issues we ran into (and how we fixed them)

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

### 5. Pushing a branch didn't trigger a Vercel deployment

**Cause:** The GitHub repo had been imported into Vercel twice, creating two
separate Vercel projects both connected to the same repo. This confused
which project actually received the deployment webhook — pushes to the
`development` branch weren't showing up on either project's Deployments
tab.

**Fix:** Deleted both duplicate projects and re-imported the repo fresh as
a single Vercel project. After that, an empty commit (`git commit
--allow-empty`) pushed to `development` correctly triggered a Preview
deployment.

### 6. Confirmation email link pointed to `localhost:3000` and showed `otp_expired`

**Cause, part one:** Supabase's **Site URL** (Authentication → URL
Configuration) defaults to `http://localhost:3000` and controls where auth
emails redirect to. It hadn't been changed to point at the real deployed
URL.

**Cause, part two:** Signing up multiple times with the same test email
sends a new confirmation link each time and invalidates the previous one —
clicking an older email's link then fails with `otp_expired`.

**Fix:** For a sandbox project testing signup repeatedly, simplest is to
turn off "Confirm email" (see issue #2) on whichever project you're
testing against, so there's no email link to expire in the first place. If
you do want working confirmation links, set **Site URL** to the actual
deployed domain, and use a fresh email each time you test rather than
re-using one that already has a pending unconfirmed signup.

### 7. Logging in on a Preview deployment worked with a *production* account

**Cause:** The Preview-scoped environment variables in Vercel hadn't been
set yet — the only `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` entries
were scoped to "Production and Preview" together (Vercel's default when
adding a variable, unless you explicitly narrow the scope), so the Preview
deployment was silently still using the `production` Supabase project.

**Fix:** Edited the existing variables to be Production-only, then added a
second set of the same variable names scoped to Preview-only, holding the
`development` project's URL/key. Redeployed afterward, since env var
changes don't apply to already-built deployments.

### General note: no manual users table needed

Supabase automatically creates and manages an `auth.users` table — visible
under Authentication → Users in the dashboard. No need to create a users
table yourself.

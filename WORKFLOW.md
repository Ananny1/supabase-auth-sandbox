# Deployment Workflow & Troubleshooting

This explains how the dev/prod setup works, how to make changes without
breaking anything, and a list of problems we ran into with Vercel/GitHub
(and how we fixed them).

For Supabase-specific problems (not Vercel/GitHub), see
**[SUPABASE_ISSUES.md](./SUPABASE_ISSUES.md)**.

## Cheat sheet: what points to what

| Where | Git branch | Vercel setting | Supabase project |
|---|---|---|---|
| Your computer (`npm run dev`) | any | — (uses `.env.local`) | `development` |
| A preview link on Vercel | `development` (or any branch that isn't `main`) | Preview | `development` |
| The real, live website | `main` | Production | `production` |

Rule of thumb: `.env.local` and anything scoped to **Preview** in
Vercel should always use the `development` project's values. Anything
scoped to **Production** should always use the `production` project's
values.

## How to safely make a change, step by step

1. Switch to the `development` branch:
   ```
   git checkout development
   ```
2. Make your changes.
3. Test on your own computer first — `npm run dev` uses `.env.local`,
   which points at the `development` project, so it's safe to sign up
   and test with fake accounts.
4. Save your changes and push them:
   ```
   git push origin development
   ```
5. Vercel automatically builds a **preview link** for this push. Open
   it and test again — this is as close to "real" as it gets while
   staying safe, since it's still using the `development` project.
6. Once you're happy with it, bring it into `main`:
   ```
   git checkout main
   git merge development
   git push origin main
   ```
7. Vercel automatically builds the **real live site** from `main`. You
   don't have to click "deploy" anywhere — pushing to the branch does
   it automatically.

## Mistakes to avoid

- **Don't push straight to `main` without testing on `development`
  first.** `main` is the real live site — there's no safety net there.
- **Vercel has its own "Development" option that is NOT the same thing
  as our Supabase project named "development."** Confusing coincidence
  in naming, nothing more. When setting up env vars for a branch
  deployment in Vercel, always pick **Preview**, never "Development."
- **Never commit `.env.local` to git.** It holds real secret keys and
  is already excluded on purpose — don't remove it from `.gitignore`.
- **Don't connect the same GitHub repo to Vercel twice.** This
  happened once by accident and caused deployments to silently go to
  the wrong project. If a push doesn't seem to do anything, check
  Vercel's project list for a duplicate before looking anywhere else.
- **Don't sign up with the same email over and over** if "Confirm
  email" is turned on — each try sends a new link and cancels the last
  one, so clicking an old email gives you an "expired" error. Either
  use a new email each time, or turn "Confirm email" off while testing.
- **Each Supabase project's settings are separate from the other.**
  Turning off "Confirm email" or changing settings on `production`
  does nothing to `development`, and the other way around too — you
  have to set each one up on its own.
- **Changing an env var in Vercel doesn't update deployments that
  already exist.** After changing one, go to that deployment and click
  **Redeploy**, or it'll keep using the old value.

## Problems we ran into (Vercel/GitHub)

### 1. Pushing a branch didn't create a new deployment

**What happened:** The GitHub repo had accidentally been connected to
Vercel twice, so there were two separate Vercel projects both watching
the same repo. This confused things — pushes to `development` weren't
showing up anywhere.

**Fix:** Deleted both, then connected the repo to Vercel fresh as one
single project. After that, pushing a small test commit correctly
triggered a new preview deployment.

### 2. Logging in on a preview link worked with a production account (it shouldn't have)

**What happened:** The env vars in Vercel for `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` hadn't been split yet — they were set for both
"Production and Preview" at once, using the `production` project's
values for both. So the preview link was secretly still using
`production`, not `development`.

**Fix:** Changed the existing variables to apply to Production only,
then added a second copy of the same variable names scoped to Preview
only, using the `development` project's values. Redeployed afterward,
since old deployments don't pick up new env var values automatically.

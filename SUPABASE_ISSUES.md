# Supabase Issues (and how we fixed them)

Problems we ran into with Supabase's login/signup/email system while
building this, explained simply for next time.

### 1. "Anonymous sign-ins are disabled" when clicking Sign Up

**What happened:** The Sign Up and Log In buttons were set up in a way
that skipped the browser's normal "this field is required" check. So
clicking Sign Up with empty boxes still sent the request — with a blank
email and password. Supabase saw a signup with no email and treated it
as trying to sign in anonymously, which is turned off by default.

**Fix:** Added a check in the code — if email or password is empty,
show an error and stop, instead of sending anything to Supabase.

### 2. "Email rate limit exceeded"

**What happened:** Supabase's free built-in email sender only allows a
few emails per hour. Every signup sends a confirmation email, so
testing signup again and again used up that limit fast.

**Quick fix (fine for a test project):** Turn off **"Confirm email"**
in Supabase: Authentication → Sign In / Providers → Email. With this
off, signup finishes right away and no email gets sent at all, so this
error can't happen anymore.

**Note:** Turning this off does not clear a limit that's already been
hit — that clears on its own after about an hour. Using a fresh email
you haven't tried yet also works as a quick fix.

**Proper fix:** Set up your own email sender (see below).

### 3. Setting up Resend as our own email sender

We used [Resend](https://resend.com) so Supabase could send real emails
instead of relying on its very limited built-in sender.

We made three mistakes in a row filling out Supabase's email settings
(Authentication → Sign In / Providers → Emails):

- **"535 Invalid username"** — the Username box had the wrong thing in
  it (the browser had auto-filled old saved login info). Resend always
  wants the literal word `resend` typed in as the username — not your
  actual Resend account name or email.
- **"535 Authentication credentials invalid"** — the Password box
  wasn't a real Resend API key yet. Fixed by making one in Resend under
  **API keys** (with "Sending access" turned on) and pasting it in.
- **"You can only send testing emails to your own email address"** —
  without a verified domain in Resend, it can only send to the email
  you signed up to Resend with. Any other email gets quietly rejected.

**The settings that actually work for Resend:**
| Setting | Value |
|---|---|
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` (type this word exactly) |
| Password | your Resend API key (starts with `re_`) |
| Sender email | `onboarding@resend.dev` (or your own verified domain) |

### 4. Wanting to let ANY email address sign up

With Resend's free setup (no verified domain), only your own Resend
account email can receive emails. To let any real person sign up,
you'd need to verify your own domain in Resend (under Domains, adding
some DNS records) and send from an address on that domain. For a
practice project, it's much easier to just turn off "Confirm email"
instead (see problem #2) — then no email needs sending at all.

### 5. Confirmation email link went to `localhost:3000` and said "expired"

**Cause #1:** Supabase has a setting called **Site URL**
(Authentication → URL Configuration) that decides where email links
send you. By default it's `http://localhost:3000`, and we hadn't
changed it to the real website address yet.

**Cause #2:** Signing up with the same email more than once sends a
new link each time and cancels the old one — so clicking an older
email's link gives an "expired" error.

**Fix:** For a test project where you're signing up a lot, easiest is
to turn off "Confirm email" (problem #2) so there's no link to expire
in the first place. If you do want real working email links, set
**Site URL** to your actual website address, and always use a fresh
email when testing instead of reusing one.

### Note: you don't need to make a users table yourself

Supabase automatically creates and manages a table of users for you
(`auth.users`) — you can see it under Authentication → Users in the
dashboard. No need to build one.

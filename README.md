# Solace

AI mental-health coach with a free tier and a $20/month Pro subscription.
Once deployed, signups, payments, renewals and cancellations run on their own
through Stripe. No manual work per customer.

## How the money flows

1. Visitors chat with the coach for free (`FREE_MESSAGES_PER_DAY`, default 10).
2. At the limit they're sent to `/pricing` → Stripe Checkout → $20/month.
3. `/success` verifies the payment with Stripe and unlocks unlimited chat for that browser.
4. Stripe bills monthly; subscribers manage or cancel through the Stripe billing portal.
5. `/api/webhook` receives Stripe events so cancellations and failed payments take effect immediately.

## Launch checklist

1. **Keys**: copy `.env.example` to `.env.local` and fill it in:
   - `ANTHROPIC_API_KEY` from console.anthropic.com
   - `STRIPE_SECRET_KEY` from the Stripe dashboard (use a `sk_test_` key first)
   - `SESSION_SECRET` from `openssl rand -hex 32`
2. **Run locally**: `npm install && npm run dev`, then buy Pro with test card `4242 4242 4242 4242`.
3. **Deploy** (e.g. Vercel): import the repo, add the same env vars, and set `NEXT_PUBLIC_URL` to your domain.
4. **Stripe webhook**: Dashboard → Developers → Webhooks → add `https://YOUR_DOMAIN/api/webhook` with
   `customer.subscription.created/updated/deleted` and `invoice.payment_failed`. Put the signing secret in `STRIPE_WEBHOOK_SECRET`.
5. **Billing portal**: Stripe Dashboard → Settings → Billing → Customer portal → activate (allow cancellation).
6. **Switch to live keys** once the test purchase works end to end.

## Unit economics

Each chat message is a Claude API call. On the default `claude-opus-4-6` ($5 / $25 per million
input/output tokens), a typical message costs roughly 1–3¢, more as a conversation gets longer.
Set `ANTHROPIC_MODEL=claude-sonnet-5` ($2 / $10) to cut that cost about 60%. Keep an eye on heavy Pro users
and on free-tier cost versus conversion rate.

## Known limitations

- There are no user accounts. Pro status and the free-message counter live in a signed cookie, so clearing
  cookies resets the free counter, and a subscriber on a new device can't restore access yet. Adding
  email login (e.g. NextAuth plus a database) is the next step before real growth.
- The mood journal is stored in the browser (localStorage) only.

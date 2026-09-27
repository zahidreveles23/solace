# Nudgely: launch plan

**What it is:** a $19/month tool that gets local businesses more Google reviews. Owners send customers a one-tap review link by text or email, or put a QR code on the counter. Customers can also message the owner privately.
**Why businesses pay:** more reviews bring more customers. Big competitors (Podium, Birdeye) charge $300+/month.
**Goal:** 10 paying businesses = $190/month, 50 = $950/month, 100 = $1,900/month, every month.

---

## Part 1: Put it online (about 30 min, free to start)

1. **Database:** sign up at **neon.tech** (free) and create a project. Copy the connection string (starts with `postgres://`).
2. **Hosting:** sign up at **vercel.com** with your GitHub account → **Add New → Project** → import `zahidreveles23/solace`.
   - **Root Directory:** `nudgely`
   - **Environment Variables:** add these (see `.env.example`):
     - `DATABASE_URL`: the Neon connection string
     - `SESSION_SECRET`: any long random text (mash the keyboard for 40+ characters)
     - `NEXT_PUBLIC_URL`: your Vercel address, e.g. `https://nudgely.vercel.app`
     - `STRIPE_SECRET_KEY`: from Stripe → Developers → API keys (the live secret key)
     - `STRIPE_WEBHOOK_SECRET`: from step 3 below
   - Click **Deploy**.
3. **Stripe webhook:** Stripe → Developers → Webhooks → **Add endpoint**
   - URL: `https://YOUR-SITE/api/billing/webhook`
   - Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the **Signing secret** into `STRIPE_WEBHOOK_SECRET` in Vercel, then redeploy.
4. **Stripe customer portal:** Stripe → Settings → Billing → Customer portal → activate it (allow cancel and card updates).
5. **Test it:** sign up with your own email, add a business (use any real Google review link), open your review page on your phone, and subscribe with a real card. Then cancel in Billing and refund yourself in Stripe.

## Part 2: Get the first 10 customers (the part that makes money)

The proven way without an audience is to talk to business owners directly. Aim for **20 outreach messages a day.**

### Who to target
Service businesses where one new customer is worth $50+: **barbers, hair and nail salons, auto repair, detailers, cleaners, landscapers, plumbers, HVAC, dentists, tattoo shops, restaurants.**

### How to find them (5 min)
1. Open Google Maps and search "barber near [your city]".
2. Look for businesses with **fewer than 100 reviews** that are near a competitor with **many more**.
3. Note the name, review count, the competitor's review count, and their phone number or Instagram.

### What to send

**Instagram or Facebook DM (works best for salons, barbers and restaurants)**
> Hey! I noticed [Business] has [23] Google reviews, while [Competitor] down the street has [180]. People usually pick the one with more reviews. I built a simple tool that makes asking for reviews take 5 seconds: one text or a QR code on your counter. It's free for 14 days. Want me to set it up for you? It takes me 3 minutes.

**Email**
> Subject: [Business]'s Google reviews
>
> Hi [Name], I was looking at [Business] on Google Maps. You have great ratings but only [23] reviews, while [Competitor] has [180], and more reviews usually means more calls.
> I made a simple tool that fixes this: you text customers a one-tap review link after each job, or put a QR code on your counter. It's $19/month, free for the first 14 days, and I'll set it up for you.
> Want me to send you a quick 1-minute demo?
> [Your name]

**Walk-in (converts best)**
> "Hi, quick question: do you ask customers for Google reviews? I have a tool that makes it take 5 seconds. Can I show you on my phone? It's free for 14 days, and I'll set it up for you right now."

Show them your own demo review page on your phone, then set up their account on the spot.

### Replies to common objections
- **"I already ask people."** "Most businesses ask but customers forget. This gives them a one-tap link while they're still happy. Try it free for 14 days and see if the number goes up."
- **"Too expensive."** "If it brings in one extra customer a month, it's paid for itself. And it's free for the first 14 days."
- **"I'm not good with tech."** "I'll set it all up for you. You just press one button to send a text."

### After they sign up
- **Day 1:** set up their account for them and print their QR poster.
- **Day 7:** check in with "You've gotten [X] people to your review page. How's it going?"
- **Day 12:** remind them that the trial ends in 2 days, and send the link to subscribe.

## Part 3: What to build next (once you have about 5 customers)
Ask your customers what they'd pay more for. Likely candidates:
- Automatic review-request texts (via Twilio, about 1¢ per text)
- Email alerts when a private message comes in
- Password reset by email
- Plans for businesses with multiple locations

## Good to know
- **This page never hides or filters reviews.** Every customer sees the Google review button. Google's rules forbid "review gating" (only sending happy customers to Google), so the private message option is always extra, never a filter.
- **Password reset** isn't built yet. For now, if a customer forgets their password, you can reset it for them directly in the database.

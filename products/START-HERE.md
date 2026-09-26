# Your store: setup steps (about 45 minutes, one time)

Everything is built: 2 products, a bundle, a store website, download pages, listing images and promotion posts.
Your part is the steps only you can do, because they need your identity and your bank account.

**What's in `store.zip`:** the whole website. Unzip it and you'll have a `store` folder.

---

## Step 1: Put the store online (10 min, free)

1. Go to **app.netlify.com/signup** and create a free account (sign up with email or Google).
2. Go to **app.netlify.com/drop**.
3. Drag the whole `store` folder onto the page.
4. You get a web address like `https://random-name-123.netlify.app`. Copy it.
5. Optional: in **Site configuration → Change site name**, pick something like `simplemoneysheets` so the address becomes `https://simplemoneysheets.netlify.app`.

Your site is now live, with the Buy buttons saying "Coming soon". Steps 2–3 turn them on.

## Step 2: Create 3 Stripe Payment Links (15 min)

In the Stripe Dashboard, make sure you're in **live mode** (not test mode), then open **Payment Links → + New**. Create one link for each product:

| Product name | Price | "After payment" redirect URL |
|---|---|---|
| Side Hustle Income & Tax Tracker | $9.99 one-time | `YOUR-SITE/get/bCTNVAdsEUiEnO99/` |
| Debt Payoff Planner | $9.99 one-time | `YOUR-SITE/get/2Wn2q8MJD8oxUk27/` |
| Money Tracker Bundle (both) | $14.99 one-time | `YOUR-SITE/get/TguXKP7CAn2C93Rc/` |

For each link:
- Add the product with its name and price (one-time, not recurring).
- Open the **After payment** tab, choose **Don't show confirmation page → Redirect customers to your website**, and paste the URL from the table. Replace `YOUR-SITE` with your address from Step 1, e.g. `https://simplemoneysheets.netlify.app/get/bCTNVAdsEUiEnO99/`.
- Click **Create link** and copy the link (`https://buy.stripe.com/...`).

Also in Stripe:
- **Settings → Business → Customer emails:** turn on emails for successful payments, so buyers get a receipt.
- **Settings → Business → Public details:** add a support email.

**Keep the `/get/...` addresses private.** They are the download pages. Only Stripe should send people there.

## Step 3: Turn on the Buy buttons (5 min)

1. Open `store/index.html` in a text editor (Notepad on Windows, TextEdit on Mac).
2. Near the top, fill in the three links and your email:
   ```
   hustle: "https://buy.stripe.com/...",
   debt:   "https://buy.stripe.com/...",
   bundle: "https://buy.stripe.com/..."
   const CONTACT_EMAIL = "you@example.com";
   ```
3. Save the file. In Netlify, open your site → **Deploys**, and drag the `store` folder onto the page again.

## Step 4: Test it (5 min)

Buy the cheapest product yourself with a real card. You should land on the download page and the file should download. Then refund yourself in Stripe under **Payments → the payment → Refund**.

## Step 5 (recommended): Also list on Etsy

Your own site only gets visitors you send to it. Etsy has buyers already searching. Follow `hustle-ledger/LAUNCH.md`; the debt planner's Etsy text is below.

---

## Etsy listing: Debt Payoff Planner

**Title**
```
Debt Payoff Planner Spreadsheet, Debt Snowball & Avalanche Calculator, Debt Free Tracker, Excel & Google Sheets Template
```
**Price:** $9.99

**Description**
```
Find out exactly when you'll be debt free, and what to pay each month to get there.

List your debts once and this planner builds your whole payoff plan. It compares the two proven methods, snowball (smallest balance first) and avalanche (highest interest first), so you can see which one saves you more.

WHAT'S INCLUDED
• My Plan: your debt-free date, total interest and total cost
• What to pay this month: an exact payment for every debt
• Snowball vs avalanche: months and interest side by side
• Payoff order: which debt goes next, and when each one is gone
• Balance chart: watch your total debt fall to zero
• Full month-by-month schedules for both methods
• Up to 10 debts, projected up to 30 years

HOW IT WORKS
1. Download the file after purchase
2. Open it in Microsoft Excel, or upload it to Google Drive and open with Google Sheets
3. Enter your debts and monthly budget in the yellow cells, and your plan appears instantly

DETAILS
• Instant digital download (.xlsx). No physical item will be shipped
• Works in Microsoft Excel (Windows, Mac and web) and Google Sheets
• No subscriptions, no apps, no sign-ups

Estimates assume fixed interest rates and on-time payments. Not financial advice.
Digital items can't be returned. If you have any trouble opening the file, message me and I'll help.
```
**Tags**
```
debt payoff planner, debt snowball, debt avalanche, debt tracker, debt free, budget spreadsheet, google sheets, excel template, credit card payoff, loan payoff, financial planner, money tracker, pay off debt
```

---

## Good to know

- **Fees:** Stripe keeps about 2.9% + $0.30 per sale, so you net about $9.40 on a $9.99 sale.
- **Sales tax:** selling digital goods yourself may mean collecting sales tax once you pass certain limits. Etsy handles it for you on Etsy sales. For your own site, look into Stripe Tax or ask a tax professional when sales pick up.
- **Income:** this is business income. Hustle Ledger itself will help you track it.

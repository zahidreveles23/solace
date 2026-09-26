# Hustle Ledger: launch guide

**Product:** `Hustle-Ledger.xlsx`, a side-hustle income, expense and tax tracker for Excel and Google Sheets.
**Listing images:** `listing-images/listing-1.png` to `listing-4.png` (2000×1500, upload in that order).

Once it's listed, the store delivers the file automatically after each purchase. You don't need to do anything per sale.

---

## Option A: Etsy (most built-in buyers, best first choice)

1. Go to etsy.com/sell and open a shop. You'll need an ID, a bank account and a card on file. It costs $0.20 per listing.
2. **Listing → Add a listing**
   - **Type:** Digital files. **Who made it:** I did. **What is it:** A finished product.
   - **Photos:** upload the four listing images in order.
   - **Title, description, tags, price:** copy them from below.
   - **Digital files:** upload `Hustle-Ledger.xlsx`.
3. Publish.

## Option B: Gumroad (5-minute setup, you share the link yourself)

1. Sign up at gumroad.com and create a new **Digital product**.
2. Upload `Hustle-Ledger.xlsx` as the content, and use listing-1.png as the cover image and the others as extra images.
3. Paste the description and set the price. Publish, then share the link (see "Getting sales" below).

You can do both. Each marketplace takes a fee per sale, so check its current fee page.

---

## Listing copy (paste as-is)

**Title** (Etsy allows 140 characters)
```
Side Hustle Income & Expense Tracker Spreadsheet, Freelancer Tax Estimator, Self Employed Budget Template, Excel & Google Sheets
```

**Price:** $9.99 to start. Once you have 5 or more reviews, try $12.99.

**Description**
```
Know exactly what you're earning, what you're spending, and how much to set aside for taxes, all in one simple spreadsheet.

Built for freelancers, side hustlers, Etsy sellers, creators, drivers and anyone who's self-employed. Just type in your payments and purchases; everything else is calculated for you.

WHAT'S INCLUDED
• Dashboard: income, expenses, take-home pay and goal progress, with charts
• Tax Estimate: self-employment tax, federal and state estimates, and your quarterly (1040-ES) payment amounts with due dates
• Income log: every client, sale and payout in one place
• Expense log: dropdown categories, business-use %, deductible amounts calculated automatically
• Mileage log: business miles turned into deductions
• Start Here guide: set up in 2 minutes
• Editable categories: rename them to fit your business

HOW IT WORKS
1. Download the file after purchase
2. Open it in Microsoft Excel, or upload it to Google Drive and open with Google Sheets
3. Fill in the yellow settings cells and start logging

DETAILS
• Instant digital download (.xlsx). No physical item will be shipped
• Works in Microsoft Excel (desktop, web and Mac) and Google Sheets
• 500 rows per log, enough for a full year for most side hustles
• No subscriptions, no apps, no sign-ups

PLEASE NOTE
Tax figures are simplified US estimates for planning and are not tax advice. Please confirm your final amounts with a tax professional.

Because this is a digital item, returns aren't accepted. If you have any trouble opening the file, message me and I'll help.
```

**Tags** (Etsy allows 13, max 20 characters each)
```
side hustle tracker, income tracker, expense tracker, freelancer template, tax estimator, self employed, small business, budget spreadsheet, google sheets, excel template, mileage log, bookkeeping template, quarterly taxes
```

---

## Getting sales (this part is up to you)

A new listing with no reviews gets little traffic at first. What moves the needle:

- **Pinterest:** make 3–5 pins from the listing images linking to your listing ("Side hustle tax tracker", "How much to save for taxes as a freelancer"). Pins keep sending traffic for months, which makes this the most passive channel.
- **Reddit and forums:** r/sidehustle, r/freelance and r/Etsy allow helpful posts. Answer "how much should I save for taxes?" questions and mention the tracker only where the rules allow it.
- **TikTok and Instagram Reels:** a 15-second screen recording where you type a payment and watch the dashboard update.
- **First reviews:** ask friends who freelance to buy it and leave honest reviews. Never post fake reviews; Etsy bans shops for it.
- **Add products:** shops with 10+ listings sell far more than shops with one. Good follow-ups include a wedding budget planner, a debt payoff tracker, a rental property tracker and an Etsy shop profit tracker. Ask me and I'll build them the same way.

## Before you list

Open `Hustle-Ledger.xlsx` yourself in Excel or Google Sheets and click through every tab, so you know what buyers will see.

## Updating the product

`build.py` regenerates the spreadsheet: `python3 build.py Hustle-Ledger.xlsx` (requires `pip install openpyxl`).
Each January, change the default tax year and mileage rate in `build.py`, rebuild, and re-upload the file to the listing.

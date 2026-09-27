import { sql } from "../../../lib/db";
import { currentUser, requireJson } from "../../../lib/auth";
import { stripe, PRICE_CENTS } from "../../../lib/stripe";
import { baseUrl, APP_NAME } from "../../../lib/site";

export default async function handler(req, res) {
  if (!requireJson(req, res)) return;
  const user = await currentUser(req);
  if (!user) return res.status(401).json({ error: "Please log in." });

  try {
    let customer = user.stripe_customer;
    if (!customer) {
      customer = (await stripe.customers.create({ email: user.email, metadata: { userId: String(user.id) } })).id;
      await sql`UPDATE users SET stripe_customer = ${customer} WHERE id = ${user.id}`;
    }
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer,
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: `${APP_NAME} monthly` },
          unit_amount: PRICE_CENTS,
          recurring: { interval: "month" },
        },
        quantity: 1,
      }],
      allow_promotion_codes: true,
      success_url: `${baseUrl()}/app?paid=1`,
      cancel_url: `${baseUrl()}/app`,
    });
    res.status(200).json({ url: session.url });
  } catch (e) {
    console.error("checkout error", e);
    res.status(500).json({ error: "Could not start checkout." });
  }
}

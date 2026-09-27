import { sql, migrate } from "../../../lib/db";
import { stripe } from "../../../lib/stripe";

export const config = { api: { bodyParser: false } };

async function rawBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks);
}

// Keeps each user's subscription status in sync with Stripe.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  let event;
  try {
    event = stripe.webhooks.constructEvent(await rawBody(req), req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type.startsWith("customer.subscription.")) {
    const sub = event.data.object;
    await migrate();
    await sql`UPDATE users SET sub_status = ${sub.status} WHERE stripe_customer = ${sub.customer}`;
  }
  res.status(200).json({ received: true });
}

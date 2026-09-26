import { stripe, forgetSubscription } from "../../lib/stripe";

// Stripe signs the raw request body, so Next's JSON parser must be off.
export const config = { api: { bodyParser: false } };

async function rawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      await rawBody(req),
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      forgetSubscription(sub.customer);
      console.log(`Subscription ${sub.id} ${event.type.split(".").pop()}: ${sub.status}`);
      break;
    }
    case "invoice.payment_failed":
      forgetSubscription(event.data.object.customer);
      console.log("Payment failed for customer:", event.data.object.customer);
      break;
  }

  res.status(200).json({ received: true });
}

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sig = req.headers["stripe-signature"];
  let body;

  if (typeof req.body === "string") {
    body = req.body;
  } else {
    body = JSON.stringify(req.body);
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.type === "customer.subscription.created") {
    console.log("New subscription:", event.data.object.id);
  }

  if (event.type === "customer.subscription.deleted") {
    console.log("Subscription cancelled:", event.data.object.id);
  }

  res.status(200).json({ received: true });
}

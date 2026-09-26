import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_missing");

// Short in-memory cache so every chat message doesn't hit the Stripe API.
const cache = new Map();
const TTL_MS = 5 * 60 * 1000;

export async function hasActiveSubscription(customerId) {
  if (!customerId) return false;
  const hit = cache.get(customerId);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.active;

  const subs = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 10,
  });
  const active = subs.data.some((s) => ["active", "trialing"].includes(s.status));
  cache.set(customerId, { active, at: Date.now() });
  return active;
}

export function forgetSubscription(customerId) {
  cache.delete(customerId);
}

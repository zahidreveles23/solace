import { stripe, forgetSubscription } from "../../lib/stripe";
import { readSession, writeSession } from "../../lib/session";

// Called by /success after Stripe redirects back. Verifies the checkout
// with Stripe and links the paying customer to this browser.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { sessionId } = req.body || {};
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId required" });
  }

  try {
    const checkout = await stripe.checkout.sessions.retrieve(sessionId);
    if (checkout.status !== "complete" || !checkout.customer) {
      return res.status(402).json({ error: "Checkout not completed" });
    }
    forgetSubscription(checkout.customer);
    writeSession(res, { ...readSession(req), cid: checkout.customer });
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error confirming checkout:", error);
    res.status(500).json({ error: "Could not confirm checkout" });
  }
}

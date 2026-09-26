import { stripe } from "../../lib/stripe";
import { readSession } from "../../lib/session";

// Stripe-hosted page where subscribers update their card or cancel.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { cid } = readSession(req);
  if (!cid) {
    return res.status(400).json({ error: "No subscription found on this device" });
  }

  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: cid,
      return_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
    });
    res.status(200).json({ url: portal.url });
  } catch (error) {
    console.error("Error opening billing portal:", error);
    res.status(500).json({ error: "Could not open billing portal" });
  }
}

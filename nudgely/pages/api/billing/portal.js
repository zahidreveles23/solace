import { currentUser, requireJson } from "../../../lib/auth";
import { stripe } from "../../../lib/stripe";
import { baseUrl } from "../../../lib/site";

export default async function handler(req, res) {
  if (!requireJson(req, res)) return;
  const user = await currentUser(req);
  if (!user?.stripe_customer) return res.status(400).json({ error: "No subscription yet." });
  try {
    const portal = await stripe.billingPortal.sessions.create({ customer: user.stripe_customer, return_url: `${baseUrl()}/app` });
    res.status(200).json({ url: portal.url });
  } catch (e) {
    console.error("portal error", e);
    res.status(500).json({ error: "Could not open billing." });
  }
}

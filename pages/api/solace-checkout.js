import { stripe } from "../../lib/stripe";
import { readSession } from "../../lib/session";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { cid } = readSession(req);
  const baseUrl = process.env.NEXT_PUBLIC_URL;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Solace Pro",
              description: "Unlimited conversations with your Solace coach",
            },
            unit_amount: 2000,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      ...(cid ? { customer: cid } : {}),
      allow_promotion_codes: true,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout:", error);
    res.status(500).json({ error: "Could not start checkout" });
  }
}

import { readSession } from "../../lib/session";
import { hasActiveSubscription } from "../../lib/stripe";
import { freeLimit, usedToday } from "../../lib/usage";

export default async function handler(req, res) {
  const session = readSession(req);
  const pro = await hasActiveSubscription(session.cid).catch(() => false);
  res.status(200).json({
    pro,
    hasCustomer: Boolean(session.cid),
    remaining: pro ? null : Math.max(0, freeLimit() - usedToday(session)),
  });
}

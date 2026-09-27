import QRCode from "qrcode";
import { sql, isActive } from "./db";
import { currentUser } from "./auth";
import { baseUrl } from "./site";

// Shared by the dashboard and the printable poster.
export async function loadDashboard(req) {
  const user = await currentUser(req);
  if (!user) return { redirect: { destination: "/login", permanent: false } };
  const [biz] = await sql`SELECT * FROM businesses WHERE user_id = ${user.id}`;
  const trialDays = Math.max(0, Math.ceil((new Date(user.trial_ends) - Date.now()) / 86400000));
  const props = {
    email: user.email,
    active: isActive(user),
    paid: ["active", "trialing", "past_due"].includes(user.sub_status),
    hasBilling: Boolean(user.stripe_customer),
    trialDays,
    business: null,
  };
  if (!biz) return { props };

  const link = `${baseUrl()}/r/${biz.slug}`;
  const counts = await sql`
    SELECT type, count(*)::int AS n FROM events
    WHERE business_id = ${biz.id} AND created_at > now() - interval '30 days' GROUP BY type`;
  const stat = (t) => counts.find((c) => c.type === t)?.n || 0;
  const feedback = await sql`
    SELECT name, contact, message, created_at FROM feedback
    WHERE business_id = ${biz.id} ORDER BY created_at DESC LIMIT 25`;
  props.business = {
    name: biz.name,
    googleUrl: biz.google_url,
    link,
    qr: await QRCode.toDataURL(link, { width: 480, margin: 1 }),
    stats: { visits: stat("visit"), clicks: stat("google_click"), feedback: stat("feedback") },
    feedback: feedback.map((f) => ({ ...f, created_at: f.created_at.toISOString() })),
  };
  return { props };
}

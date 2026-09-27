import { sql, migrate, isActive } from "../../../lib/db";

// Logs the click, then sends the customer to the business's Google review form.
export default async function handler(req, res) {
  await migrate();
  const [biz] = await sql`
    SELECT b.id, b.google_url, u.trial_ends, u.sub_status
    FROM businesses b JOIN users u ON u.id = b.user_id WHERE b.slug = ${String(req.query.slug)}`;
  if (!biz || !isActive(biz)) return res.redirect(302, "/");
  await sql`INSERT INTO events (business_id, type) VALUES (${biz.id}, 'google_click')`;
  res.redirect(302, biz.google_url);
}

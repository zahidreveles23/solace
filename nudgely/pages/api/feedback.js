import { sql, migrate, isActive } from "../../lib/db";
import { requireJson } from "../../lib/auth";

export default async function handler(req, res) {
  if (!requireJson(req, res)) return;
  const { slug, name, contact, message, website } = req.body || {};
  if (website) return res.status(200).json({ ok: true }); // honeypot field: bots fill it, people don't
  const text = String(message || "").trim();
  if (text.length < 2) return res.status(400).json({ error: "Please write a message." });

  await migrate();
  const [biz] = await sql`
    SELECT b.id, u.trial_ends, u.sub_status FROM businesses b JOIN users u ON u.id = b.user_id
    WHERE b.slug = ${String(slug || "")}`;
  if (!biz || !isActive(biz)) return res.status(404).json({ error: "Not found" });

  const [{ n }] = await sql`
    SELECT count(*)::int AS n FROM feedback WHERE business_id = ${biz.id} AND created_at > now() - interval '1 hour'`;
  if (n >= 30) return res.status(429).json({ error: "Please try again later." });

  await sql`
    INSERT INTO feedback (business_id, name, contact, message)
    VALUES (${biz.id}, ${String(name || "").slice(0, 80)}, ${String(contact || "").slice(0, 120)}, ${text.slice(0, 2000)})`;
  await sql`INSERT INTO events (business_id, type) VALUES (${biz.id}, 'feedback')`;
  res.status(200).json({ ok: true });
}

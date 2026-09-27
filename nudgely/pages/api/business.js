import { sql } from "../../lib/db";
import { currentUser, requireJson } from "../../lib/auth";
import { slugify, isGoogleUrl } from "../../lib/site";

export default async function handler(req, res) {
  if (!requireJson(req, res)) return;
  const user = await currentUser(req);
  if (!user) return res.status(401).json({ error: "Please log in." });

  const name = String(req.body?.name || "").trim().slice(0, 80);
  const googleUrl = String(req.body?.googleUrl || "").trim();
  if (!name) return res.status(400).json({ error: "Enter your business name." });
  if (!isGoogleUrl(googleUrl)) {
    return res.status(400).json({ error: "Paste the review link from Google (it starts with https://g.page or https://search.google.com)." });
  }

  const [biz] = await sql`
    INSERT INTO businesses (user_id, name, slug, google_url)
    VALUES (${user.id}, ${name}, ${slugify(name)}, ${googleUrl})
    ON CONFLICT (user_id) DO UPDATE SET name = EXCLUDED.name, google_url = EXCLUDED.google_url
    RETURNING slug`;
  res.status(200).json({ ok: true, slug: biz.slug });
}

import { sql, migrate } from "../../../lib/db";
import { hashPassword, setSession, requireJson } from "../../../lib/auth";

export default async function handler(req, res) {
  if (!requireJson(req, res)) return;
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ error: "Enter a valid email." });
  if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters." });

  await migrate();
  const [existing] = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing) return res.status(409).json({ error: "An account with this email already exists. Log in instead." });

  const [user] = await sql`INSERT INTO users (email, pass_hash) VALUES (${email}, ${hashPassword(password)}) RETURNING id`;
  setSession(res, user.id);
  res.status(200).json({ ok: true });
}

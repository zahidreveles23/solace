import { sql, migrate } from "../../../lib/db";
import { checkPassword, setSession, requireJson } from "../../../lib/auth";

export default async function handler(req, res) {
  if (!requireJson(req, res)) return;
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  await migrate();
  const [user] = await sql`SELECT id, pass_hash FROM users WHERE email = ${email}`;
  if (!user || !checkPassword(password, user.pass_hash)) {
    return res.status(401).json({ error: "Wrong email or password." });
  }
  setSession(res, user.id);
  res.status(200).json({ ok: true });
}

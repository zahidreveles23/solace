import crypto from "crypto";
import { sql, migrate } from "./db";

const COOKIE = "nudgely";
const MAX_AGE = 60 * 60 * 24 * 30;

function secret() {
  if (!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET is not set");
  return process.env.SESSION_SECRET;
}
const sign = (v) => crypto.createHmac("sha256", secret()).update(v).digest("base64url");

export function hashPassword(pw) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(pw, salt, 64);
  return `${salt.toString("base64")}:${hash.toString("base64")}`;
}

export function checkPassword(pw, stored) {
  const [salt, hash] = stored.split(":").map((s) => Buffer.from(s, "base64"));
  const test = crypto.scryptSync(pw, salt, 64);
  return crypto.timingSafeEqual(test, hash);
}

export function setSession(res, userId) {
  const v = `${userId}.${Date.now()}`;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${COOKIE}=${v}.${sign(v)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${secure}`);
}

export function clearSession(res) {
  res.setHeader("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

function sessionUserId(req) {
  const raw = (req.headers.cookie || "").split(";").map((s) => s.trim()).find((s) => s.startsWith(COOKIE + "="));
  if (!raw) return null;
  const [id, ts, sig] = decodeURIComponent(raw.slice(COOKIE.length + 1)).split(".");
  if (!id || !ts || !sig) return null;
  const expected = sign(`${id}.${ts}`);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  if (Date.now() - Number(ts) > MAX_AGE * 1000) return null;
  return Number(id);
}

export async function currentUser(req) {
  const id = sessionUserId(req);
  if (!id) return null;
  await migrate();
  const [user] = await sql`SELECT * FROM users WHERE id = ${id}`;
  return user || null;
}

// Rejects cross-site form posts: our API only accepts JSON bodies.
export function requireJson(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return false;
  }
  if (!(req.headers["content-type"] || "").includes("application/json")) {
    res.status(415).json({ error: "Expected JSON" });
    return false;
  }
  return true;
}

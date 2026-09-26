import crypto from "crypto";

// Stateless session stored in a signed, httpOnly cookie. It holds the
// Stripe customer id (once the user has paid) and today's free-tier usage.
const COOKIE = "solace";
const MAX_AGE = 60 * 60 * 24 * 365;

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is not set");
  return s;
}

function sign(payload) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function readSession(req) {
  const raw = parseCookies(req.headers.cookie || "")[COOKIE];
  if (!raw) return {};
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return {};
  const expected = sign(payload);
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return {};
  }
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString());
  } catch {
    return {};
  }
}

export function writeSession(res, data) {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE}=${payload}.${sign(payload)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${secure}`
  );
}

function parseCookies(header) {
  const out = {};
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i === -1) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

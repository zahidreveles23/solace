import postgres from "postgres";

// One shared connection pool per server instance.
const g = globalThis;
export const sql =
  g.__sql ||
  (g.__sql = postgres(process.env.DATABASE_URL, {
    max: 5,
    ssl: process.env.DATABASE_URL?.includes("localhost") ? false : "require",
  }));

let ready;
export function migrate() {
  ready ||= sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      pass_hash TEXT NOT NULL,
      trial_ends TIMESTAMPTZ NOT NULL DEFAULT now() + interval '14 days',
      stripe_customer TEXT,
      sub_status TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS businesses (
      id SERIAL PRIMARY KEY,
      user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      google_url TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS events (
      id BIGSERIAL PRIMARY KEY,
      business_id INT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS events_biz_time ON events (business_id, created_at);
    CREATE TABLE IF NOT EXISTS feedback (
      id BIGSERIAL PRIMARY KEY,
      business_id INT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      name TEXT,
      contact TEXT,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `.simple().catch((e) => {
    ready = null; // retry on the next request instead of failing forever
    throw e;
  });
  return ready;
}

// Active = paying, or still inside the free trial.
export function isActive(user) {
  if (!user) return false;
  if (["active", "trialing", "past_due"].includes(user.sub_status)) return true;
  return new Date(user.trial_ends) > new Date();
}

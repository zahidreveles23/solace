export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Nudgely";
export const baseUrl = () => (process.env.NEXT_PUBLIC_URL || "http://localhost:3000").replace(/\/$/, "");

export function slugify(name) {
  const base = name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "biz";
  return `${base}-${Math.random().toString(36).slice(2, 6)}`;
}

// Accept only Google links, so the page can't be used to redirect people elsewhere.
export function isGoogleUrl(u) {
  try {
    const url = new URL(u);
    return url.protocol === "https:" && /(^|\.)(google\.[a-z.]+|g\.page|goo\.gl)$/.test(url.hostname);
  } catch {
    return false;
  }
}

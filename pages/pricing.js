import { useEffect, useState } from "react";

const FREE_FEATURES = ["Daily conversations with the AI coach", "Mood journal", "Grounding exercises", "Crisis resources"];
const PRO_FEATURES = ["Unlimited coach conversations", "Everything in Free", "Cancel anytime"];

async function redirectTo(endpoint, setError) {
  setError("");
  try {
    const res = await fetch(endpoint, { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setError(data.error || "Something went wrong.");
  } catch {
    setError("Something went wrong.");
  }
}

export default function Pricing() {
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/me").then((r) => r.json()).then(setMe).catch(() => {});
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-center text-5xl font-bold">Simple pricing</h1>
      <p className="mt-4 text-center text-gray-400">
        Start free. Upgrade when Solace becomes part of your life.
      </p>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold">Free</h2>
          <p className="mt-2 text-4xl font-bold">$0</p>
          <ul className="mt-6 space-y-2 text-sm text-gray-300">
            {FREE_FEATURES.map((f) => <li key={f}>✓ {f}</li>)}
          </ul>
        </div>

        <div className="rounded-3xl border border-purple-400/40 bg-purple-500/10 p-8">
          <h2 className="text-2xl font-semibold">Pro</h2>
          <p className="mt-2 text-4xl font-bold">
            $20<span className="text-base font-normal text-gray-400">/month</span>
          </p>
          <ul className="mt-6 space-y-2 text-sm text-gray-300">
            {PRO_FEATURES.map((f) => <li key={f}>✓ {f}</li>)}
          </ul>
          {me?.pro ? (
            <button
              onClick={() => redirectTo("/api/portal", setError)}
              className="mt-8 w-full rounded-full border border-white/20 px-6 py-3 font-medium hover:bg-white/10"
            >
              Manage subscription
            </button>
          ) : (
            <button
              onClick={() => redirectTo("/api/solace-checkout", setError)}
              className="mt-8 w-full rounded-full bg-purple-600 px-6 py-3 font-medium hover:bg-purple-500"
            >
              Upgrade to Pro
            </button>
          )}
          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        </div>
      </div>
    </main>
  );
}

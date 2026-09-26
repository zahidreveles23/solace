import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Success() {
  const router = useRouter();
  const [status, setStatus] = useState("confirming");

  useEffect(() => {
    if (!router.isReady) return;
    const sessionId = router.query.session_id;
    if (!sessionId) return setStatus("error");
    fetch("/api/checkout-complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then((r) => setStatus(r.ok ? "done" : "error"))
      .catch(() => setStatus("error"));
  }, [router.isReady, router.query.session_id]);

  return (
    <main className="mx-auto max-w-xl px-6 py-32 text-center">
      {status === "confirming" && <p className="text-gray-400">Confirming your subscription…</p>}
      {status === "done" && (
        <>
          <h1 className="text-4xl font-bold">Welcome to Solace Pro</h1>
          <p className="mt-4 text-gray-400">You now have unlimited conversations with your coach.</p>
          <Link href="/chat" className="mt-8 inline-block rounded-full bg-purple-600 px-8 py-3">
            Talk to the coach →
          </Link>
        </>
      )}
      {status === "error" && (
        <>
          <h1 className="text-3xl font-bold">We couldn't confirm your payment</h1>
          <p className="mt-4 text-gray-400">
            If you were charged, refresh this page in a moment. Stripe can take a few seconds.
          </p>
        </>
      )}
    </main>
  );
}

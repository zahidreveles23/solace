import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const GREETING = {
  role: "assistant",
  content: "Hi, I'm here with you. What's on your mind today?",
};

export default function Chat() {
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(null);
  const [limited, setLimited] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((me) => {
        setRemaining(me.remaining);
        setLimited(me.remaining === 0);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/solace-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.response }]);
      if (res.status === 402) setLimited(true);
      if ("remaining" in data) {
        setRemaining(data.remaining);
        if (data.remaining === 0) setLimited(true);
      }
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "I had trouble responding. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex h-[calc(100vh-65px)] max-w-3xl flex-col px-4 py-6">
      <div className="flex-1 space-y-4 overflow-y-auto pb-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "rounded-tr-sm border border-white/10 bg-white/5"
                  : "rounded-tl-sm bg-gradient-to-br from-purple-500 to-pink-500 text-white"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && <p className="text-sm text-gray-500">Solace is thinking…</p>}
        <div ref={endRef} />
      </div>

      {limited ? (
        <div className="rounded-2xl border border-purple-400/30 bg-purple-500/10 p-4 text-center text-sm">
          You've reached today's free messages.{" "}
          <Link href="/pricing" className="font-semibold text-purple-300 underline">
            Upgrade to Pro
          </Link>{" "}
          for unlimited support.
        </div>
      ) : (
        <form onSubmit={send} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type what you're feeling…"
            className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm outline-none focus:border-purple-400"
          />
          <button
            disabled={loading}
            className="rounded-full bg-purple-600 px-6 py-3 text-sm font-medium hover:bg-purple-500 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      )}
      <p className="mt-3 text-center text-xs text-gray-500">
        {remaining != null && !limited && `${remaining} free messages left today · `}
        Solace is an AI, not a therapist. In crisis? Call or text{" "}
        <a href="tel:988" className="underline">988</a>.
      </p>
    </main>
  );
}

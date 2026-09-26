import { useEffect, useState } from "react";

// Box breathing: 4s in, 4s hold, 4s out, 4s hold.
const PHASES = [
  { label: "Breathe in", scale: "scale-100" },
  { label: "Hold", scale: "scale-100" },
  { label: "Breathe out", scale: "scale-50" },
  { label: "Hold", scale: "scale-50" },
];

const GROUNDING = [
  "5 things you can see",
  "4 things you can touch",
  "3 things you can hear",
  "2 things you can smell",
  "1 thing you can taste",
];

export default function Exercises() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setPhase((p) => (p + 1) % PHASES.length), 4000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="text-5xl font-bold">Grounding</h1>

      <section className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
        <h2 className="text-2xl font-semibold">Box breathing</h2>
        <div className="mx-auto mt-10 flex h-56 w-56 items-center justify-center">
          <div
            className={`h-56 w-56 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 transition-transform duration-[4000ms] ease-in-out ${
              running ? PHASES[phase].scale : "scale-75"
            }`}
          />
        </div>
        <p className="mt-8 text-xl">{running ? PHASES[phase].label : "Ready when you are"}</p>
        <button
          onClick={() => {
            setPhase(0);
            setRunning((r) => !r);
          }}
          className="mt-6 rounded-full bg-purple-600 px-6 py-3 font-medium hover:bg-purple-500"
        >
          {running ? "Stop" : "Start"}
        </button>
      </section>

      <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-10">
        <h2 className="text-2xl font-semibold">5-4-3-2-1</h2>
        <p className="mt-2 text-gray-400">Slowly notice, and name out loud:</p>
        <ol className="mt-6 space-y-3 text-lg">
          {GROUNDING.map((g) => <li key={g}>{g}</li>)}
        </ol>
      </section>
    </main>
  );
}

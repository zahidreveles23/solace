import { useEffect, useState } from "react";

const MOODS = ["😞", "😕", "😐", "🙂", "😊"];
const KEY = "solace-mood-journal";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export default function Mood() {
  const [entries, setEntries] = useState([]);
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => setEntries(load()), []);

  function save(e) {
    e.preventDefault();
    if (mood == null) return;
    const next = [{ mood, note: note.trim(), at: new Date().toISOString() }, ...entries];
    setEntries(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    setMood(null);
    setNote("");
  }

  const recent = entries.slice(0, 7);
  const avg = recent.length ? recent.reduce((s, e) => s + e.mood, 0) / recent.length : null;

  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-5xl font-bold">Mood journal</h1>
      <p className="mt-4 text-gray-400">Entries stay on this device only.</p>

      <form onSubmit={save} className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="font-medium">How are you feeling?</p>
        <div className="mt-4 flex gap-3">
          {MOODS.map((m, i) => (
            <button
              type="button"
              key={m}
              onClick={() => setMood(i)}
              className={`rounded-2xl p-3 text-3xl ${mood === i ? "bg-purple-500/40 ring-2 ring-purple-400" : "bg-white/5 hover:bg-white/10"}`}
            >
              {m}
            </button>
          ))}
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What's behind this feeling? (optional)"
          rows={3}
          className="mt-6 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm outline-none focus:border-purple-400"
        />
        <button
          disabled={mood == null}
          className="mt-4 rounded-full bg-purple-600 px-6 py-3 font-medium hover:bg-purple-500 disabled:opacity-50"
        >
          Save entry
        </button>
      </form>

      {avg != null && (
        <p className="mt-10 text-gray-400">
          Last {recent.length} entries average: <span className="text-2xl">{MOODS[Math.round(avg)]}</span>
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {entries.map((e) => (
          <li key={e.at} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{MOODS[e.mood]}</span>
              <span className="text-xs text-gray-500">{new Date(e.at).toLocaleString()}</span>
            </div>
            {e.note && <p className="mt-2 text-sm text-gray-300">{e.note}</p>}
          </li>
        ))}
      </ul>
    </main>
  );
}

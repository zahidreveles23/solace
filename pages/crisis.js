const RESOURCES = [
  { name: "988 Suicide & Crisis Lifeline (US)", detail: "Call or text 988, 24/7", href: "tel:988" },
  { name: "Crisis Text Line (US)", detail: "Text HOME to 741741", href: "sms:741741?body=HOME" },
  { name: "Emergency services", detail: "Call 911 (US) or your local emergency number", href: "tel:911" },
  { name: "Outside the US", detail: "Find a helpline in your country at findahelpline.com", href: "https://findahelpline.com" },
];

export default function Crisis() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-5xl font-bold">You don't have to go through this alone.</h1>
      <p className="mt-6 text-lg text-gray-400">
        If you are thinking about harming yourself or you are in danger, please reach out to a
        person right now. These services are free and confidential.
      </p>
      <div className="mt-12 space-y-4">
        {RESOURCES.map((r) => (
          <a
            key={r.name}
            href={r.href}
            className="block rounded-2xl border border-red-400/30 bg-red-500/5 p-6 hover:bg-red-500/10"
          >
            <p className="text-lg font-semibold">{r.name}</p>
            <p className="mt-1 text-gray-400">{r.detail}</p>
          </a>
        ))}
      </div>
      <p className="mt-12 text-sm text-gray-500">
        Solace is an AI companion and cannot respond to emergencies.
      </p>
    </main>
  );
}

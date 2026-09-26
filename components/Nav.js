import Link from "next/link";

const links = [
  ["/chat", "Coach"],
  ["/mood", "Journal"],
  ["/exercises", "Grounding"],
  ["/pricing", "Pricing"],
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/70 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-lg font-semibold">
          Solace
        </Link>
        <div className="flex items-center gap-4 text-sm text-gray-400 sm:gap-6">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="hover:text-white">
              {label}
            </Link>
          ))}
          <Link
            href="/crisis"
            className="rounded-full border border-red-400/40 px-3 py-1 text-red-300 hover:bg-red-500/10"
          >
            Crisis help
          </Link>
        </div>
      </nav>
    </header>
  );
}

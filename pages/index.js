import { createFileRoute, Link } from "@tanstack/react-router";
import aurora from "@/assets/aurora.jpg";
import orb from "@/assets/orb.jpg";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={aurora}
          alt=""
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-screen animate-aurora"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

        <div className="relative mx-auto max-w-5xl px-6 pt-28 pb-40 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-breathe" />
            Introducing Solace 1.0
          </div>
          <h1 className="mt-8 font-display text-6xl md:text-8xl leading-[0.95] text-gradient">
            A quieter mind,<br />
            <span className="text-gradient-warm italic">gently guided.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground">
            Solace pairs a compassionate AI coach with mood tracking and evidence-based practices — designed to feel less like an app, more like a deep breath.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/signin" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow hover:brightness-110 transition">
              Begin your practice
            </Link>
            <Link to="/chat" className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium hover:bg-white/10 transition">
              Talk to the coach →
            </Link>
          </div>

          <p className="mt-8 text-xs uppercase tracking-widest text-muted-foreground">
            Private · End-to-end encrypted · No ads, ever
          </p>
        </div>

        {/* Hero orb */}
        <div className="relative mx-auto -mt-16 max-w-4xl px-6 pb-10">
          <div className="relative overflow-hidden rounded-3xl border border-border shadow-soft">
            <img src={orb} alt="Solace" width={1200} height={1200} loading="lazy" className="w-full aspect-[16/10] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-widest text-primary">The system</p>
          <h2 className="mt-3 font-display text-5xl text-gradient">Four practices. One companion.</h2>
          <p className="mt-4 text-lg text-muted-foreground">Each surface of Solace is crafted to lower friction between you and the moment you actually need it.</p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Feature title="AI Coach" body="Talk it out with a warm, evidence-informed coach available in every hour you need one." to="/chat" tag="Chat" />
          <Feature title="Mood Journal" body="A single tap captures where you are. Patterns surface without effort." to="/mood" tag="Track" />
          <Feature title="Grounding" body="Guided breathing, 5-4-3-2-1, and body scans for the sharp edges of a day." to="/exercises" tag="Practice" />
          <Feature title="In Crisis" body="Immediate resources, hotlines, and grounding — one tap away, always." to="/crisis" tag="Support" />
        </div>
      </section>

      {/* Split */}
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary">Coach</p>
            <h2 className="mt-3 font-display text-5xl text-gradient">Feels like being heard.</h2>
            <p className="mt-6 text-lg text-muted-foreground">Our coach is trained on evidence-based practices from CBT, ACT, and mindfulness — with a voice that never lectures. It remembers what matters. It never judges.</p>
            <ul className="mt-8 space-y-4 text-sm">
              {["Available 24/7, in your pocket","Private by design — your words stay yours","Personalised across every conversation"].map(x => (
                <li key={x} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-foreground/85">{x}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="glass-strong rounded-3xl p-6 shadow-soft">
              <div className="space-y-4">
                <Bubble side="in">Everything feels heavy today. I don't know where to start.</Bubble>
                <Bubble side="out">Heavy is a fair word for it. Let's not try to fix everything — just one thing. What feels the loudest right now?</Bubble>
                <Bubble side="in">I think it's work. I've been avoiding an email for three days.</Bubble>
                <Bubble side="out">That avoidance takes real energy. Would it help to write the reply together — just a draft, no send?</Bubble>
              </div>
            </div>
            <div className="absolute -inset-6 -z-10 bg-aurora blur-3xl opacity-40" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-32">
        <div className="relative overflow-hidden rounded-[2rem] p-16 text-center glass-strong shadow-soft">
          <div className="absolute inset-0 bg-aurora animate-aurora opacity-60" />
          <div className="relative">
            <h2 className="font-display text-5xl md:text-6xl text-gradient">Start where you are.</h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">Solace is free to try. Upgrade only if it becomes part of your life.</p>
            <Link to="/pricing" className="mt-8 inline-flex rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground shadow-glow hover:brightness-110 transition">
              See plans
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Feature({ title, body, to, tag }: { title: string; body: string; to: string; tag: string }) {
  return (
    <Link to={to} className="group glass rounded-3xl p-6 transition hover:bg-white/[0.06] hover:-translate-y-1 duration-300">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-primary">{tag}</span>
        <span className="text-muted-foreground group-hover:text-foreground transition">→</span>
      </div>
      <h3 className="mt-8 font-display text-2xl">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
    </Link>
  );
}

function Bubble({ side, children }: { side: "in" | "out"; children: React.ReactNode }) {
  const isOut = side === "out";
  return (
    <div className={`flex ${isOut ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isOut ? "bg-gradient-to-br from-primary/90 to-accent/90 text-primary-foreground rounded-tl-sm" : "bg-white/5 border border-border rounded-tr-sm"}`}>
        {children}
      </div>
    </div>
  );
}

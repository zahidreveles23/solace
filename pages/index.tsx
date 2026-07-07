import Image from "next/image";
import Link from "next/link";

function Feature({
  title,
  body,
  to,
  tag,
}: {
  title: string;
  body: string;
  to: string;
  tag: string;
}) {
  return (
    <Link
      href={to}
      className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-primary">
          {tag}
        </span>
        <span className="text-muted-foreground group-hover:text-white">
          →
        </span>
      </div>

      <h3 className="mt-8 text-2xl font-semibold">{title}</h3>

      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {body}
      </p>
    </Link>
  );
}


function Bubble({
  side,
  children,
}: {
  side: "in" | "out";
  children: React.ReactNode;
}) {
  const isOut = side === "out";

  return (
    <div className={`flex ${isOut ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isOut
            ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-tl-sm"
            : "bg-white/5 border border-white/10 rounded-tr-sm"
        }`}
      >
        {children}
      </div>
    </div>
  );
}


export default function Home() {
  return (
    <main className="overflow-hidden">

      {/* HERO */}
      <section className="relative">

        <Image
          src="/aurora.jpg"
          alt=""
          fill
          className="absolute inset-0 object-cover opacity-40"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />

        <div className="relative mx-auto max-w-5xl px-6 pt-32 pb-40 text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            Introducing Solace 1.0
          </div>


          <h1 className="mt-8 text-6xl md:text-8xl font-bold leading-none">
            A quieter mind,
            <br />
            <span className="italic text-purple-400">
              gently guided.
            </span>
          </h1>


          <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-400">
            Solace pairs a compassionate AI coach with mood tracking and
            evidence-based practices — designed to feel less like an app,
            more like a deep breath.
          </p>


          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <Link
              href="/signin"
              className="rounded-full bg-purple-600 px-6 py-3 font-medium text-white hover:bg-purple-500"
            >
              Begin your practice
            </Link>


            <Link
              href="/chat"
              className="rounded-full border border-white/10 bg-white/5 px-6 py-3"
            >
              Talk to the coach →
            </Link>

          </div>


          <p className="mt-8 text-xs uppercase tracking-widest text-gray-500">
            Private · End-to-end encrypted · No ads, ever
          </p>

        </div>



        <div className="relative mx-auto -mt-20 max-w-4xl px-6">

          <div className="overflow-hidden rounded-3xl border border-white/10">

            <Image
              src="/orb.jpg"
              alt="Solace"
              width={1200}
              height={800}
              className="w-full object-cover"
            />

          </div>

        </div>

      </section>




      {/* FEATURES */}

      <section className="mx-auto max-w-7xl px-6 py-32">

        <p className="text-sm uppercase tracking-widest text-purple-400">
          The system
        </p>


        <h2 className="mt-3 text-5xl font-bold">
          Four practices. One companion.
        </h2>


        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <Feature
            title="AI Coach"
            body="Talk it out with a warm AI coach available anytime."
            to="/chat"
            tag="Chat"
          />

          <Feature
            title="Mood Journal"
            body="Track emotions and discover patterns."
            to="/mood"
            tag="Track"
          />

          <Feature
            title="Grounding"
            body="Breathing exercises and mindfulness tools."
            to="/exercises"
            tag="Practice"
          />

          <Feature
            title="Crisis Support"
            body="Resources available when you need them."
            to="/crisis"
            tag="Support"
          />

        </div>

      </section>




      {/* CHAT */}

      <section className="mx-auto max-w-7xl px-6 py-32">

        <div className="grid gap-16 lg:grid-cols-2 items-center">

          <div>

            <p className="text-sm uppercase tracking-widest text-purple-400">
              Coach
            </p>

            <h2 className="mt-3 text-5xl font-bold">
              Feels like being heard.
            </h2>


            <p className="mt-6 text-lg text-gray-400">
              A compassionate AI trained around CBT, ACT and mindfulness.
              No judgement. Just support.
            </p>

          </div>



          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

            <div className="space-y-4">

              <Bubble side="in">
                Everything feels heavy today. I don't know where to start.
              </Bubble>


              <Bubble side="out">
                Heavy is a fair word for it. Let's start with one thing.
                What feels the loudest right now?
              </Bubble>


              <Bubble side="in">
                I think it's work. I've been avoiding an email.
              </Bubble>


              <Bubble side="out">
                Let's write the reply together. No pressure to send it.
              </Bubble>


            </div>

          </div>

        </div>

      </section>




      {/* CTA */}

      <section className="mx-auto max-w-5xl px-6 py-32">

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-16 text-center">

          <h2 className="text-5xl font-bold">
            Start where you are.
          </h2>


          <p className="mt-4 text-gray-400">
            Solace is free to try. Upgrade only when it becomes part of your life.
          </p>


          <Link
            href="/pricing"
            className="mt-8 inline-block rounded-full bg-purple-600 px-8 py-3 text-white"
          >
            See plans
          </Link>

        </div>

      </section>


    </main>
  );
}

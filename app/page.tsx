import Link from "next/link";
import Logo from "@/components/board/Logo";
import {
  PenTool,
  Layers,
  FileDown,
  Presentation,
  Vote,
  PartyPopper,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    Icon: PenTool,
    title: "Clean, premium pens",
    desc: "Pen, pencil, marker, highlighter & eraser with pressure-smooth strokes. Write neat — never clumsy.",
    live: true,
  },
  {
    Icon: Layers,
    title: "Unlimited boards",
    desc: "Spin up endless boards in a session. Switch, duplicate and reorder like slides. Black or white — your pick.",
    live: true,
  },
  {
    Icon: FileDown,
    title: "Save & export",
    desc: "Auto-saved as you teach. Export every board to PDF or Word in one click.",
    live: true,
  },
  {
    Icon: Presentation,
    title: "Present PPTs",
    desc: "Upload your slides before class and write on top of them live.",
    live: false,
  },
  {
    Icon: Vote,
    title: "Live polls",
    desc: "Run quick polls so students answer in real time and stay engaged.",
    live: false,
  },
  {
    Icon: PartyPopper,
    title: "Reaction sounds",
    desc: "Right answer? Tap to play claps, drums & cheers with on-screen animations.",
    live: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-arva-black text-white">
      {/* glow backdrop */}
      <div
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(245,184,46,0.12), transparent 70%)",
        }}
      />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo size={40} />
        <Link
          href="/board"
          className="rounded-xl bg-arva-gold px-4 py-2 text-sm font-semibold text-black transition hover:bg-arva-goldsoft"
        >
          Open Whiteboard
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Hero */}
        <section className="py-16 text-center sm:py-24">
          <span className="inline-block rounded-full border border-arva-edge bg-white/5 px-3 py-1 text-xs font-medium text-arva-gold">
            For Arva Talks Academy mentors
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            The teaching whiteboard,
            <br />
            <span className="bg-gradient-to-r from-arva-gold to-amber-500 bg-clip-text text-transparent">
              done right.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-zinc-400 sm:text-lg">
            Stop fighting clumsy Zoom and Google boards. Write clean, create
            unlimited boards, present, poll and celebrate — all in one premium
            pad built for your classes.
          </p>
          <div className="mt-9 flex items-center justify-center gap-3">
            <Link
              href="/board"
              className="group flex items-center gap-2 rounded-xl bg-arva-gold px-6 py-3 text-base font-semibold text-black shadow-glow transition hover:bg-arva-goldsoft"
            >
              Start teaching
              <ArrowRight size={18} className="transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="grid gap-4 pb-20 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ Icon, title, desc, live }) => (
            <div
              key={title}
              className="rounded-2xl border border-arva-edge bg-arva-panel/60 p-5 transition hover:border-arva-gold/40 hover:bg-arva-panel"
            >
              <div className="flex items-center justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-arva-gold/15 text-arva-gold">
                  <Icon size={22} />
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    live
                      ? "bg-green-500/15 text-green-400"
                      : "bg-white/5 text-zinc-500"
                  }`}
                >
                  {live ? "Ready" : "Coming soon"}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="relative z-10 border-t border-arva-edge py-6 text-center text-sm text-zinc-500">
        Arva Talks Academy — Drawing Pad · Built for mentors
      </footer>
    </div>
  );
}

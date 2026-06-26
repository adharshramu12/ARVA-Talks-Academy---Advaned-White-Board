import Link from "next/link";
import Logo from "@/components/board/Logo";
import { PenTool, Layers, FileDown, Users, Cloud, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    Icon: PenTool,
    title: "Premium Drawing",
    desc: "Pen, pencil, marker, highlighter & eraser",
  },
  {
    Icon: Layers,
    title: "Unlimited Boards",
    desc: "Create, duplicate, rename & organize with ease",
  },
  {
    Icon: Users,
    title: "Engagement Tools",
    desc: "Poll, random picker, timer & reaction rain",
  },
  {
    Icon: FileDown,
    title: "Export & Share",
    desc: "PDF, DOCX, PNG & shareable links",
  },
  {
    Icon: Cloud,
    title: "Cloud Sync",
    desc: "Google login, save & access anywhere",
  },
];

function WhiteboardMockup() {
  return (
    <div className="relative w-full" style={{ maxWidth: 560 }}>
      {/* Laptop screen frame */}
      <div
        className="relative rounded-t-[18px] p-[10px] pb-0"
        style={{
          background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.7)",
        }}
      >
        {/* Camera dot */}
        <div className="mx-auto mb-[7px] h-[5px] w-[5px] rounded-full bg-[#3a3a3a] ring-1 ring-black/40" />

        {/* Screen */}
        <div className="overflow-hidden rounded-t-[10px] bg-white ring-1 ring-black/20">

          {/* ── App top bar ── */}
          <div className="flex items-center justify-between bg-[#111] px-3 py-[6px]">
            <div className="flex items-center gap-2 text-white">
              <svg width="8" height="8" viewBox="0 0 8 8"><path d="M5 1L2 4l3 3" stroke="#777" strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>
              <span className="text-[9px] font-medium text-zinc-300">≡&nbsp; Board 1&nbsp; ▾</span>
              <div className="ml-1 flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 11 11"><path d="M8 3L4 7l-1-1" stroke="#555" strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>
                <svg width="11" height="11" viewBox="0 0 11 11"><path d="M3 3l4 4 1-1" stroke="#555" strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-0.5 rounded-md bg-[#16a34a] px-2 py-[3px] text-[8px] font-semibold text-white">
                <svg width="7" height="7" viewBox="0 0 7 7"><polygon points="1,1 6,3.5 1,6" fill="white"/></svg>
                Present
              </span>
              <span className="flex items-center gap-0.5 rounded-md bg-[#F5B82E] px-2 py-[3px] text-[8px] font-semibold text-black">
                <svg width="7" height="7" viewBox="0 0 7 7"><path d="M3.5 1v4M1 4l2.5 2 2.5-2" stroke="black" strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>
                Share
              </span>
              <span className="text-[10px] text-zinc-500">⋮</span>
            </div>
          </div>

          {/* ── Main area ── */}
          <div className="flex" style={{ height: 258 }}>

            {/* Left toolbar */}
            <div className="flex flex-col items-center gap-[5px] border-r border-zinc-800 bg-[#111] px-[7px] py-2">
              {[
                { d: "M3 2l5 5M5 2h3v3", active: false },   // select
                { d: "M2 9l1-3 5-5-2-2-5 5-1 3 2 2z", active: true },   // pen
                { d: "M2 9l5-5-1-2-5 5 1 2z", active: false },  // pencil
                { d: "M2 8l1-2 4-4 2 2-4 4-2 1z M7 3l1-1 1 1-1 1z", active: false }, // marker
                { d: "M2 7l3-3 3 3M5 4V2", active: false },   // highlighter
                { d: "M8 2l1 1-6 6-1-1 6-6z M2 8l-1 2 2-1z", active: false },  // eraser
              ].map(({ d, active }, i) => (
                <div
                  key={i}
                  className={`grid h-[22px] w-[22px] place-items-center rounded-[6px] ${active ? "bg-[#F5B82E]" : ""}`}
                >
                  <svg width="12" height="12" viewBox="0 0 11 11">
                    <path d={d} stroke={active ? "#000" : "#888"} strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ))}
            </div>

            {/* Canvas with photosynthesis diagram */}
            <div className="relative flex-1 bg-white">
              <svg width="100%" height="100%" viewBox="0 0 310 258" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <marker id="arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                    <polygon points="0 0.5, 4.5 2.5, 0 4.5" fill="#444" />
                  </marker>
                </defs>

                {/* Title */}
                <text x="155" y="22" textAnchor="middle" fontSize="13" fontWeight="700" fontFamily="Georgia,serif" fill="#111" letterSpacing="0.2">Photosynthesis</text>
                <line x1="95" y1="26" x2="215" y2="26" stroke="#111" strokeWidth="1" />

                {/* Leaf */}
                <ellipse cx="155" cy="128" rx="42" ry="60" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.8" />
                {/* Leaf tip */}
                <path d="M155 68 Q162 90 155 128" stroke="#16a34a" strokeWidth="0" fill="none"/>
                {/* Main vein */}
                <line x1="155" y1="68" x2="155" y2="188" stroke="#15803d" strokeWidth="1.1" />
                {/* Side veins */}
                <line x1="155" y1="90"  x2="128" y2="106" stroke="#15803d" strokeWidth="0.7" />
                <line x1="155" y1="90"  x2="182" y2="106" stroke="#15803d" strokeWidth="0.7" />
                <line x1="155" y1="115" x2="123" y2="130" stroke="#15803d" strokeWidth="0.7" />
                <line x1="155" y1="115" x2="187" y2="130" stroke="#15803d" strokeWidth="0.7" />
                <line x1="155" y1="142" x2="128" y2="156" stroke="#15803d" strokeWidth="0.7" />
                <line x1="155" y1="142" x2="182" y2="156" stroke="#15803d" strokeWidth="0.7" />

                {/* Sunlight (top-left) */}
                <text x="36" y="46" fontSize="8.5" fill="#333" fontFamily="Arial,sans-serif">Sunlight</text>
                {/* Wavy rays */}
                <path d="M72 50 Q78 46 82 52 Q86 58 92 54" stroke="#F59E0B" strokeWidth="1.4" fill="none"/>
                <path d="M72 62 Q78 58 82 64 Q86 70 92 66" stroke="#F59E0B" strokeWidth="1.4" fill="none"/>
                <path d="M72 74 Q78 70 82 76 Q86 82 92 78" stroke="#F59E0B" strokeWidth="1.4" fill="none"/>
                {/* Arrow from sunlight to leaf */}
                <line x1="94" y1="66" x2="114" y2="95" stroke="#444" strokeWidth="0.9" markerEnd="url(#arr)" />

                {/* CO₂ (left) */}
                <text x="16" y="134" fontSize="9" fill="#333" fontFamily="Arial,sans-serif">CO₂</text>
                <text x="9"  y="144" fontSize="7" fill="#777" fontFamily="Arial,sans-serif">(Carbon dioxide)</text>
                <line x1="60" y1="136" x2="111" y2="132" stroke="#444" strokeWidth="0.9" markerEnd="url(#arr)" />

                {/* O₂ (top-right) */}
                <text x="228" y="80" fontSize="9" fill="#333" fontFamily="Arial,sans-serif">O₂</text>
                <text x="222" y="91" fontSize="7" fill="#777" fontFamily="Arial,sans-serif">(Oxygen)</text>
                <line x1="199" y1="100" x2="226" y2="88" stroke="#444" strokeWidth="0.9" markerEnd="url(#arr)" />

                {/* Glucose (right) */}
                <text x="228" y="148" fontSize="9" fill="#333" fontFamily="Arial,sans-serif">Glucose</text>
                <text x="228" y="159" fontSize="7" fill="#777" fontFamily="Arial,sans-serif">(Sugar)</text>
                <line x1="199" y1="140" x2="226" y2="148" stroke="#444" strokeWidth="0.9" markerEnd="url(#arr)" />

                {/* H₂O (bottom) */}
                <text x="143" y="210" fontSize="9" fill="#333" fontFamily="Arial,sans-serif">H₂O</text>
                <text x="135" y="221" fontSize="7" fill="#777" fontFamily="Arial,sans-serif">(Water)</text>
                <line x1="155" y1="206" x2="155" y2="190" stroke="#444" strokeWidth="0.9" markerEnd="url(#arr)" />
              </svg>
            </div>

            {/* Right engagement panel */}
            <div className="flex flex-col gap-1 border-l border-zinc-100 bg-white px-2 py-2" style={{ width: 92 }}>
              {[
                { bg: "#fef2f2", dot: "#ef4444", label: "Laser Pointer" },
                { bg: "#fffbeb", dot: "#F5B82E", label: "Spotlight" },
                { bg: "#faf5ff", dot: "#a855f7", label: "Random Picker" },
                { bg: "#fff7ed", dot: "#f97316", label: "Reaction Rain" },
                { bg: "#eff6ff", dot: "#3b82f6", label: "Timer" },
              ].map(({ bg, dot, label }) => (
                <div
                  key={label}
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-100 px-2 py-1.5 transition hover:border-zinc-200"
                  style={{ background: bg }}
                >
                  <div className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: dot }} />
                  <span className="text-[7.5px] font-medium leading-tight text-zinc-600">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom board strip ── */}
          <div className="flex items-center gap-2 border-t border-zinc-200 bg-zinc-50 px-3 py-[5px]">
            <span className="text-[7px] text-zinc-400">−&nbsp; 100% &nbsp;+</span>
            <div className="ml-1 flex items-center gap-1">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="flex h-[22px] w-[28px] items-center justify-center rounded-[3px] border text-[7px] font-medium"
                  style={
                    n === 1
                      ? { borderColor: "#F5B82E", background: "#fff", color: "#111" }
                      : { borderColor: "#e5e7eb", background: "#fff", color: "#aaa" }
                  }
                >
                  {n}
                </div>
              ))}
              <span className="text-[8px] text-zinc-400">···</span>
            </div>
          </div>
        </div>
      </div>

      {/* Laptop base */}
      <div
        className="h-[10px] rounded-b-[4px]"
        style={{
          background: "linear-gradient(to bottom, #252525, #1e1e1e)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
        }}
      />
      <div
        className="mx-6 h-[4px] rounded-b-[10px]"
        style={{ background: "linear-gradient(to bottom, #1a1a1a, #141414)" }}
      />
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-arva-black text-white">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(65% 55% at 50% 0%, rgba(245,184,46,0.09), transparent 70%)",
        }}
      />

      {/* ── Header ── */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo size={38} />
        <Link
          href="/board"
          className="rounded-xl bg-arva-gold px-4 py-2 text-sm font-semibold text-black transition hover:bg-arva-goldsoft"
        >
          Open Whiteboard
        </Link>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-0 pt-8 lg:pt-10">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-10">

          {/* Left: copy */}
          <div className="flex-shrink-0 text-center lg:w-[390px] lg:text-left">
            <span className="inline-block rounded-full border border-arva-gold/30 bg-arva-gold/10 px-3 py-[5px] text-[10px] font-bold uppercase tracking-[0.18em] text-arva-gold">
              For Arva Talks Academy Mentors
            </span>
            <h1 className="mt-5 text-[38px] font-extrabold leading-[1.1] tracking-tight sm:text-[48px] lg:text-[50px]">
              The teaching<br />whiteboard,<br />
              <span className="text-arva-gold">done right.</span>
            </h1>
            <p className="mt-5 text-[14px] leading-relaxed text-zinc-400 sm:text-[15px]">
              Stop fighting clumsy Zoom and Google boards. Write clean,
              create unlimited boards, present, poll and celebrate — all
              in one premium pad built for your classes.
            </p>
            <div className="mt-8">
              <Link
                href="/board"
                className="group inline-flex items-center gap-2 rounded-xl bg-arva-gold px-7 py-3.5 text-[15px] font-bold text-black shadow-glow transition hover:bg-arva-goldsoft"
              >
                Start teaching
                <ArrowRight size={17} className="transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Right: laptop mockup */}
          <div className="flex w-full flex-1 justify-center lg:justify-end">
            <WhiteboardMockup />
          </div>
        </div>
      </section>

      {/* ── Feature strip ── */}
      <section className="relative z-10 mt-14 border-t border-arva-edge">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {FEATURES.map(({ Icon, title, desc }, i) => (
              <div
                key={title}
                className={`flex flex-col items-start gap-3 p-5 lg:p-6 ${
                  i < 4 ? "lg:border-r lg:border-arva-edge" : ""
                }`}
              >
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-arva-gold/15 text-arva-gold">
                  <Icon size={17} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white">{title}</p>
                  <p className="mt-[3px] text-[11px] leading-relaxed text-zinc-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-7 text-center text-[13px] text-zinc-500">
        ❤️ Built with passion at ARVA Talks Academy — for every educator who just wants the board to work.
      </footer>
    </div>
  );
}

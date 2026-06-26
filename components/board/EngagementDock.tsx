"use client";

import { useEffect, useRef, useState } from "react";
import {
  PartyPopper,
  Flashlight,
  Timer as TimerIcon,
  Target,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import Spotlight from "./Spotlight";
import StudentPicker from "./StudentPicker";
import { beep, chime } from "@/lib/sound";

const EMOJIS = ["👏", "🎉", "⭐", "🔥", "❤️", "😂", "🥳", "💯"];

type Particle = { id: number; emoji: string; left: number; dur: number; spin: number };

function ReactionLayer({ particles }: { particles: Particle[] }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[45] overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="animate-fall absolute text-4xl"
          style={
            {
              left: `${p.left}%`,
              top: 0,
              ["--dur" as string]: `${p.dur}s`,
              ["--spin" as string]: `${p.spin}deg`,
            } as React.CSSProperties
          }
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

function TimerWidget({ onClose }: { onClose: () => void }) {
  const [minutes, setMinutes] = useState(2);
  const [left, setLeft] = useState(120);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          if (ref.current) clearInterval(ref.current);
          setRunning(false);
          beep();
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="absolute bottom-0 right-14 w-56 animate-fade-up rounded-2xl border border-arva-edge bg-arva-panel p-4 shadow-panel">
      <div className="text-center text-5xl font-extrabold tabular-nums text-white">
        {mm}:{ss}
      </div>
      {!running && left === 120 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {[1, 2, 5, 10].map((m) => (
            <button
              key={m}
              onClick={() => {
                setMinutes(m);
                setLeft(m * 60);
              }}
              className={`h-8 w-9 rounded-lg text-sm ${
                minutes === m ? "bg-arva-gold text-black" : "bg-white/5 text-zinc-300"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          onClick={() => setRunning((r) => !r)}
          className="flex items-center gap-1.5 rounded-lg bg-arva-gold px-3 py-2 text-sm font-semibold text-black"
        >
          {running ? <Pause size={15} /> : <Play size={15} />}
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setLeft(minutes * 60);
          }}
          className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-zinc-300 hover:bg-white/10"
        >
          <RotateCcw size={15} />
        </button>
      </div>
      <button
        onClick={onClose}
        className="mt-2 w-full text-center text-[11px] text-zinc-500 hover:text-zinc-300"
      >
        close
      </button>
    </div>
  );
}

export default function EngagementDock() {
  const [spotlight, setSpotlight] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const seq = useRef(0);

  const burst = (emoji: string) => {
    const batch: Particle[] = Array.from({ length: 18 }, () => ({
      id: seq.current++,
      emoji,
      left: Math.random() * 100,
      dur: 2 + Math.random() * 1.8,
      spin: (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 360),
    }));
    setParticles((p) => [...p, ...batch]);
    chime();
    const ids = new Set(batch.map((b) => b.id));
    setTimeout(() => setParticles((p) => p.filter((x) => !ids.has(x.id))), 4200);
  };

  const Btn = ({
    title,
    active,
    onClick,
    children,
  }: {
    title: string;
    active?: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      title={title}
      onClick={onClick}
      className={`grid h-12 w-12 place-items-center rounded-full border shadow-panel transition ${
        active
          ? "border-arva-gold bg-arva-gold text-black"
          : "border-arva-edge bg-arva-panel/90 text-zinc-200 hover:text-white"
      }`}
    >
      {children}
    </button>
  );

  return (
    <>
      <Spotlight on={spotlight} />
      <ReactionLayer particles={particles} />
      {showPicker && <StudentPicker onClose={() => setShowPicker(false)} />}

      <div className="fixed bottom-28 right-4 z-50 flex flex-col items-end gap-2.5">
        {showTimer && <div className="relative"><TimerWidget onClose={() => setShowTimer(false)} /></div>}

        {showReactions && (
          <div className="grid grid-cols-4 gap-1.5 rounded-2xl border border-arva-edge bg-arva-panel/95 p-2 shadow-panel">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => burst(e)}
                className="grid h-10 w-10 place-items-center rounded-xl text-2xl transition hover:bg-white/10"
              >
                {e}
              </button>
            ))}
          </div>
        )}

        <Btn title="Reactions" active={showReactions} onClick={() => setShowReactions((v) => !v)}>
          <PartyPopper size={20} />
        </Btn>
        <Btn title="Pick a student" onClick={() => setShowPicker(true)}>
          <Target size={20} />
        </Btn>
        <Btn title="Activity timer" active={showTimer} onClick={() => setShowTimer((v) => !v)}>
          <TimerIcon size={20} />
        </Btn>
        <Btn title="Spotlight" active={spotlight} onClick={() => setSpotlight((v) => !v)}>
          <Flashlight size={20} />
        </Btn>
      </div>
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { X, Shuffle, Sparkles } from "lucide-react";

const KEY = "arva-students";

export default function StudentPicker({ onClose }: { onClose: () => void }) {
  const [names, setNames] = useState("");
  const [current, setCurrent] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setNames(localStorage.getItem(KEY) ?? "");
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const list = names
    .split("\n")
    .map((n) => n.trim())
    .filter(Boolean);

  const save = (v: string) => {
    setNames(v);
    localStorage.setItem(KEY, v);
  };

  const spin = () => {
    if (list.length === 0 || spinning) return;
    setSpinning(true);
    let ticks = 0;
    const total = 22 + Math.floor(Math.random() * 10);
    timer.current = setInterval(() => {
      setCurrent(list[Math.floor(Math.random() * list.length)]);
      ticks++;
      if (ticks >= total) {
        if (timer.current) clearInterval(timer.current);
        setCurrent(list[Math.floor(Math.random() * list.length)]);
        setSpinning(false);
      }
    }, 70);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm">
      <div className="w-[440px] max-w-[92vw] animate-pop rounded-2xl border border-arva-edge bg-arva-panel p-5 shadow-panel">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Sparkles size={18} className="text-arva-gold" /> Pick a student
          </h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 grid place-items-center rounded-xl border border-arva-edge bg-black/30 py-8">
          <div
            className={`text-center text-3xl font-extrabold ${
              spinning ? "text-zinc-300" : "text-arva-gold"
            }`}
          >
            {current ?? "—"}
          </div>
          {!spinning && current && (
            <div className="mt-1 text-xs text-zinc-500">Selected 🎉</div>
          )}
        </div>

        <button
          onClick={spin}
          disabled={list.length === 0 || spinning}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-arva-gold py-3 font-semibold text-black transition hover:bg-arva-goldsoft disabled:opacity-40"
        >
          <Shuffle size={18} /> {spinning ? "Spinning…" : "Spin"}
        </button>

        <label className="mt-4 block text-xs font-medium text-zinc-400">
          Student names (one per line)
        </label>
        <textarea
          value={names}
          onChange={(e) => save(e.target.value)}
          rows={5}
          placeholder={"Aarav\nDiya\nKiran\n…"}
          className="mt-1.5 w-full resize-none rounded-xl border border-arva-edge bg-black/30 p-3 text-sm text-zinc-200 outline-none focus:border-arva-gold/50"
        />
        <div className="mt-1 text-right text-[11px] text-zinc-500">
          {list.length} students
        </div>
      </div>
    </div>
  );
}

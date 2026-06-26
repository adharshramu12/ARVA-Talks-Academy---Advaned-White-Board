"use client";

import { useEffect, useRef, useState } from "react";
import {
  Download,
  ChevronDown,
  FileText,
  FileType,
  Image as ImageIcon,
  Maximize,
  Palette,
  Check,
} from "lucide-react";
import Logo from "./Logo";
import { useBoardStore } from "./store";
import { BackgroundType } from "./types";
import {
  exportProjectToPdf,
  exportProjectToWord,
  exportBoardToPng,
} from "@/lib/export";
import { isCloudEnabled } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import SessionsModal from "./SessionsModal";
import { FolderOpen } from "lucide-react";

const BACKGROUNDS: { id: BackgroundType; label: string; swatch: string }[] = [
  { id: "white", label: "White", swatch: "#ffffff" },
  { id: "black", label: "Black", swatch: "#0f0f12" },
  { id: "gray", label: "Gray", swatch: "#3a3a40" },
  { id: "grid-white", label: "White grid", swatch: "#ffffff" },
  { id: "grid-black", label: "Black grid", swatch: "#0f0f12" },
];

function useOutsideClose(onClose: () => void) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  return ref;
}

export default function TopBar() {
  const title = useBoardStore((s) => s.project.title);
  const setTitle = useBoardStore((s) => s.setTitle);
  const project = useBoardStore((s) => s.project);
  const activeBoardId = useBoardStore((s) => s.activeBoardId);
  const background = useBoardStore((s) => s.activeBoard().background);
  const setBackground = useBoardStore((s) => s.setBackground);

  const { user } = useAuth();
  const [bgOpen, setBgOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const bgRef = useOutsideClose(() => setBgOpen(false));
  const exportRef = useOutsideClose(() => setExportOpen(false));

  const present = () => {
    const el = document.documentElement;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  return (
    <header className="flex items-center justify-between gap-3 rounded-2xl border border-arva-edge bg-arva-panel/90 px-4 py-2.5 shadow-panel backdrop-blur">
      <div className="flex items-center gap-4">
        <Logo size={34} />
        <div className="hidden h-7 w-px bg-arva-edge sm:block" />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="hidden w-56 rounded-lg bg-transparent px-2 py-1 text-sm font-medium text-zinc-200 outline-none transition focus:bg-white/5 sm:block"
          placeholder="Session title"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setSessionsOpen(true)}
          className="flex items-center gap-1.5 rounded-xl border border-arva-edge bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
          title={isCloudEnabled ? "My sessions & sign in" : "Saved in this browser"}
        >
          {user?.user_metadata?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.user_metadata.avatar_url as string}
              alt=""
              className="h-5 w-5 rounded-full"
            />
          ) : (
            <FolderOpen size={16} />
          )}
          <span className="hidden sm:inline">Sessions</span>
        </button>

        {/* Background picker */}
        <div className="relative" ref={bgRef}>
          <button
            onClick={() => setBgOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-xl border border-arva-edge bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
          >
            <Palette size={16} />
            <span className="hidden sm:inline">Board</span>
            <ChevronDown size={14} />
          </button>
          {bgOpen && (
            <div className="absolute right-0 z-30 mt-2 w-44 animate-fade-up rounded-xl border border-arva-edge bg-arva-panel p-1.5 shadow-panel">
              {BACKGROUNDS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setBackground(b.id);
                    setBgOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-zinc-200 transition hover:bg-white/5"
                >
                  <span
                    className="h-5 w-5 rounded ring-1 ring-black/40"
                    style={{
                      background: b.swatch,
                      backgroundImage: b.id.startsWith("grid")
                        ? "linear-gradient(#8884 1px,transparent 1px),linear-gradient(90deg,#8884 1px,transparent 1px)"
                        : undefined,
                      backgroundSize: "6px 6px",
                    }}
                  />
                  {b.label}
                  {background === b.id && (
                    <Check size={14} className="ml-auto text-arva-gold" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={present}
          className="flex items-center gap-1.5 rounded-xl border border-arva-edge bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
          title="Present (fullscreen)"
        >
          <Maximize size={16} />
          <span className="hidden sm:inline">Present</span>
        </button>

        {/* Export menu */}
        <div className="relative" ref={exportRef}>
          <button
            onClick={() => setExportOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-xl bg-arva-gold px-3 py-2 text-sm font-semibold text-black transition hover:bg-arva-goldsoft"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown size={14} />
          </button>
          {exportOpen && (
            <div className="absolute right-0 z-30 mt-2 w-52 animate-fade-up rounded-xl border border-arva-edge bg-arva-panel p-1.5 shadow-panel">
              <button
                onClick={() => {
                  exportProjectToPdf(project);
                  setExportOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm text-zinc-200 transition hover:bg-white/5"
              >
                <FileText size={16} className="text-red-400" />
                All boards → PDF
              </button>
              <button
                onClick={() => {
                  exportProjectToWord(project);
                  setExportOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm text-zinc-200 transition hover:bg-white/5"
              >
                <FileType size={16} className="text-blue-400" />
                All boards → Word
              </button>
              <button
                onClick={() => {
                  exportBoardToPng(project, activeBoardId);
                  setExportOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm text-zinc-200 transition hover:bg-white/5"
              >
                <ImageIcon size={16} className="text-green-400" />
                This board → PNG
              </button>
            </div>
          )}
        </div>
      </div>

      {sessionsOpen && <SessionsModal onClose={() => setSessionsOpen(false)} />}
    </header>
  );
}

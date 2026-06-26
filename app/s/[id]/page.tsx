"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Logo from "@/components/board/Logo";
import { loadSession } from "@/lib/cloud";
import { isCloudEnabled } from "@/lib/supabase";
import {
  backgroundFill,
  gridColor,
  strokeToSvgPath,
} from "@/components/board/render";
import { ProjectState, VIRTUAL_H, VIRTUAL_W } from "@/components/board/types";

export default function SharedSession() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectState | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!isCloudEnabled) {
      setState("missing");
      return;
    }
    loadSession(params.id).then((p) => {
      if (p && p.boards.length) {
        setProject(p);
        setState("ok");
      } else {
        setState("missing");
      }
    });
  }, [params.id]);

  const go = useCallback(
    (d: number) => {
      if (!project) return;
      setIdx((i) => Math.min(project.boards.length - 1, Math.max(0, i + d)));
    },
    [project]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (state === "loading")
    return (
      <div className="grid h-screen place-items-center bg-arva-black text-zinc-500">
        Loading…
      </div>
    );

  if (state === "missing" || !project)
    return (
      <div className="grid h-screen place-items-center bg-arva-black px-6 text-center text-zinc-400">
        <div>
          <Logo size={44} />
          <p className="mt-6">
            This session isn’t available or sharing was turned off.
          </p>
        </div>
      </div>
    );

  const board = project.boards[idx];
  const grid = gridColor(board.background);

  return (
    <div className="flex h-screen flex-col bg-arva-black p-3">
      <header className="flex items-center justify-between rounded-2xl border border-arva-edge bg-arva-panel/90 px-4 py-2.5">
        <Logo size={30} />
        <div className="truncate px-3 text-sm font-medium text-zinc-300">
          {project.title}
        </div>
        <div className="text-xs text-zinc-500">
          {idx + 1} / {project.boards.length}
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1 items-center justify-center p-4">
        <button
          onClick={() => go(-1)}
          disabled={idx === 0}
          className="absolute left-2 z-10 grid h-12 w-12 place-items-center rounded-full border border-arva-edge bg-arva-panel/90 text-zinc-200 transition hover:text-white disabled:opacity-30"
        >
          <ChevronLeft />
        </button>

        <div
          className="relative w-full max-w-[1400px] overflow-hidden rounded-2xl shadow-panel ring-1 ring-arva-edge"
          style={{ aspectRatio: `${VIRTUAL_W} / ${VIRTUAL_H}`, maxHeight: "100%" }}
        >
          <svg
            viewBox={`0 0 ${VIRTUAL_W} ${VIRTUAL_H}`}
            className="absolute inset-0 h-full w-full"
            style={{ background: backgroundFill(board.background) }}
          >
            {grid && (
              <>
                <defs>
                  <pattern id="vg" width={40} height={40} patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke={grid} strokeWidth={1} />
                  </pattern>
                </defs>
                <rect width={VIRTUAL_W} height={VIRTUAL_H} fill="url(#vg)" />
              </>
            )}
            {board.images?.map((im) => (
              <image
                key={im.id}
                href={im.src}
                x={im.x}
                y={im.y}
                width={im.w}
                height={im.h}
                preserveAspectRatio="none"
              />
            ))}
            {board.strokes.map((s) => (
              <path key={s.id} d={strokeToSvgPath(s)} fill={s.color} opacity={s.opacity} />
            ))}
          </svg>
        </div>

        <button
          onClick={() => go(1)}
          disabled={idx === project.boards.length - 1}
          className="absolute right-2 z-10 grid h-12 w-12 place-items-center rounded-full border border-arva-edge bg-arva-panel/90 text-zinc-200 transition hover:text-white disabled:opacity-30"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

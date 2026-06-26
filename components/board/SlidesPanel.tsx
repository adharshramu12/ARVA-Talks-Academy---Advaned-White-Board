"use client";

import { Plus, Copy, Trash2 } from "lucide-react";
import { useBoardStore } from "./store";
import { backgroundFill, gridColor, strokeToSvgPath } from "./render";
import { Board, VIRTUAL_H, VIRTUAL_W } from "./types";

function Thumb({ board }: { board: Board }) {
  const grid = gridColor(board.background);
  return (
    <svg
      viewBox={`0 0 ${VIRTUAL_W} ${VIRTUAL_H}`}
      className="h-full w-full"
      style={{ background: backgroundFill(board.background) }}
      preserveAspectRatio="xMidYMid slice"
    >
      {grid && (
        <>
          <defs>
            <pattern id={`g-${board.id}`} width={40} height={40} patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={grid} strokeWidth={1} />
            </pattern>
          </defs>
          <rect width={VIRTUAL_W} height={VIRTUAL_H} fill={`url(#g-${board.id})`} />
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
  );
}

export default function SlidesPanel() {
  const boards = useBoardStore((s) => s.project.boards);
  const activeBoardId = useBoardStore((s) => s.activeBoardId);
  const setActiveBoard = useBoardStore((s) => s.setActiveBoard);
  const addBoard = useBoardStore((s) => s.addBoard);
  const duplicateBoard = useBoardStore((s) => s.duplicateBoard);
  const deleteBoard = useBoardStore((s) => s.deleteBoard);
  const renameBoard = useBoardStore((s) => s.renameBoard);

  return (
    <div className="flex items-center gap-3 overflow-x-auto rounded-2xl border border-arva-edge bg-arva-panel/90 px-3 py-2.5 shadow-panel backdrop-blur">
      {boards.map((board, i) => {
        const active = board.id === activeBoardId;
        return (
          <div key={board.id} className="group relative shrink-0">
            <button
              onClick={() => setActiveBoard(board.id)}
              className={`relative block h-[68px] w-[120px] overflow-hidden rounded-lg ring-2 transition ${
                active
                  ? "ring-arva-gold shadow-glow"
                  : "ring-arva-edge hover:ring-zinc-500"
              }`}
            >
              <Thumb board={board} />
              <span className="absolute left-1 top-1 grid h-4 min-w-4 place-items-center rounded bg-black/60 px-1 text-[10px] font-bold text-white">
                {i + 1}
              </span>
            </button>

            <div className="mt-1 flex items-center justify-between gap-1 px-0.5">
              <input
                value={board.name}
                onChange={(e) => renameBoard(board.id, e.target.value)}
                className="w-[78px] bg-transparent text-[11px] text-zinc-300 outline-none focus:text-white"
              />
              <div className="flex opacity-0 transition group-hover:opacity-100">
                <button
                  title="Duplicate"
                  onClick={() => duplicateBoard(board.id)}
                  className="grid h-5 w-5 place-items-center rounded text-zinc-400 hover:bg-white/10 hover:text-white"
                >
                  <Copy size={12} />
                </button>
                <button
                  title="Delete"
                  onClick={() => deleteBoard(board.id)}
                  className="grid h-5 w-5 place-items-center rounded text-zinc-400 hover:bg-red-500/20 hover:text-red-300"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <button
        onClick={addBoard}
        title="Add board"
        className="grid h-[68px] w-[120px] shrink-0 place-items-center rounded-lg border-2 border-dashed border-arva-edge text-zinc-400 transition hover:border-arva-gold hover:text-arva-gold"
      >
        <Plus size={22} />
      </button>
    </div>
  );
}

"use client";

import { useRef } from "react";
import {
  MousePointer2,
  Pen,
  Pencil,
  Paintbrush,
  Highlighter,
  Zap,
  Eraser,
  ImagePlus,
  Undo2,
  Redo2,
  Trash2,
} from "lucide-react";
import { useBoardStore } from "./store";
import { ToolType } from "./types";
import { insertImageFile } from "./Whiteboard";

const TOOLS: { id: ToolType; label: string; Icon: typeof Pen }[] = [
  { id: "select", label: "Select / move", Icon: MousePointer2 },
  { id: "pen", label: "Pen", Icon: Pen },
  { id: "pencil", label: "Pencil", Icon: Pencil },
  { id: "marker", label: "Marker", Icon: Paintbrush },
  { id: "highlighter", label: "Highlighter", Icon: Highlighter },
  { id: "laser", label: "Laser pointer", Icon: Zap },
  { id: "eraser", label: "Eraser", Icon: Eraser },
];

const COLORS = [
  "#111827", // ink black
  "#ffffff", // white (for black boards)
  "#ef4444", // red
  "#3b82f6", // blue
  "#22c55e", // green
  "#f59e0b", // amber
  "#a855f7", // purple
  "#ec4899", // pink
  "#F5B82E", // arva gold
];

const SIZES = [3, 6, 10, 18];

export default function Toolbar() {
  const tool = useBoardStore((s) => s.tool);
  const setTool = useBoardStore((s) => s.setTool);
  const color = useBoardStore((s) => s.color);
  const setColor = useBoardStore((s) => s.setColor);
  const size = useBoardStore((s) => s.size);
  const setSize = useBoardStore((s) => s.setSize);
  const addImage = useBoardStore((s) => s.addImage);
  const undo = useBoardStore((s) => s.undo);
  const redo = useBoardStore((s) => s.redo);
  const clearBoard = useBoardStore((s) => s.clearBoard);
  const canUndo = useBoardStore((s) => s.past.length > 0);
  const canRedo = useBoardStore((s) => s.future.length > 0);
  const fileRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="no-scrollbar flex h-full w-[64px] flex-col items-center gap-2 overflow-y-auto rounded-2xl border border-arva-edge bg-arva-panel/90 p-2 shadow-panel backdrop-blur">
      {/* Tools */}
      <div className="flex flex-col gap-1.5">
        {TOOLS.map(({ id, label, Icon }) => {
          const active = tool === id;
          return (
            <button
              key={id}
              title={label}
              onClick={() => setTool(id)}
              className={`grid h-11 w-11 place-items-center rounded-xl transition ${
                active
                  ? "bg-arva-gold text-black shadow-glow"
                  : "text-zinc-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={20} strokeWidth={2.1} />
            </button>
          );
        })}
      </div>

      {/* Insert image */}
      <button
        title="Insert image"
        onClick={() => fileRef.current?.click()}
        className="grid h-11 w-11 place-items-center rounded-xl text-zinc-300 transition hover:bg-white/5 hover:text-white"
      >
        <ImagePlus size={20} strokeWidth={2.1} />
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) insertImageFile(f, addImage);
          e.target.value = "";
        }}
      />

      <div className="my-1 h-px w-9 bg-arva-edge" />

      {/* Colors */}
      <div className="grid grid-cols-2 gap-1.5">
        {COLORS.map((c) => (
          <button
            key={c}
            title={c}
            onClick={() => setColor(c)}
            className={`h-6 w-6 rounded-full ring-1 ring-black/30 transition hover:scale-110 ${
              color === c && tool !== "eraser"
                ? "outline outline-2 outline-offset-2 outline-arva-gold"
                : ""
            }`}
            style={{ background: c }}
          />
        ))}
        <label
          title="Custom colour"
          className="relative grid h-6 w-6 cursor-pointer place-items-center overflow-hidden rounded-full ring-1 ring-black/30"
          style={{
            background:
              "conic-gradient(#ef4444,#f59e0b,#22c55e,#3b82f6,#a855f7,#ef4444)",
          }}
        >
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
      </div>

      <div className="my-1 h-px w-9 bg-arva-edge" />

      {/* Sizes */}
      <div className="flex flex-col items-center gap-1.5">
        {SIZES.map((s) => (
          <button
            key={s}
            title={`Size ${s}`}
            onClick={() => setSize(s)}
            className={`grid h-8 w-11 place-items-center rounded-lg transition ${
              size === s ? "bg-white/10" : "hover:bg-white/5"
            }`}
          >
            <span
              className="rounded-full"
              style={{
                width: Math.min(s + 4, 22),
                height: Math.min(s + 4, 22),
                background: tool === "eraser" ? "#9ca3af" : color,
              }}
            />
          </button>
        ))}
      </div>

      <div className="my-1 h-px w-9 bg-arva-edge" />

      {/* History */}
      <div className="flex flex-col gap-1.5">
        <button
          title="Undo (Ctrl+Z)"
          onClick={undo}
          disabled={!canUndo}
          className="grid h-10 w-11 place-items-center rounded-xl text-zinc-300 transition enabled:hover:bg-white/5 enabled:hover:text-white disabled:opacity-30"
        >
          <Undo2 size={18} />
        </button>
        <button
          title="Redo (Ctrl+Y)"
          onClick={redo}
          disabled={!canRedo}
          className="grid h-10 w-11 place-items-center rounded-xl text-zinc-300 transition enabled:hover:bg-white/5 enabled:hover:text-white disabled:opacity-30"
        >
          <Redo2 size={18} />
        </button>
        <button
          title="Clear board"
          onClick={() => {
            if (confirm("Clear everything on this board?")) clearBoard();
          }}
          className="grid h-10 w-11 place-items-center rounded-xl text-zinc-300 transition hover:bg-red-500/15 hover:text-red-300"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

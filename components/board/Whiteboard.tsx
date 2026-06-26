"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useBoardStore } from "./store";
import {
  backgroundFill,
  defaultOpacity,
  gridColor,
  pointNearStroke,
  strokeOptions,
  strokeToSvgPath,
  getSvgPathFromStroke,
} from "./render";
import { BoardImage, Point, Stroke, VIRTUAL_H, VIRTUAL_W } from "./types";
import { getStroke } from "perfect-freehand";

const uid = () => Math.random().toString(36).slice(2, 10);
const HANDLE = 22; // resize handle size in virtual units

type Laser = { id: string; points: Point[]; born: number };
type Drag =
  | { mode: "move"; id: string; sx: number; sy: number; orig: BoardImage }
  | { mode: "resize"; id: string; sx: number; sy: number; orig: BoardImage }
  | null;

export default function Whiteboard() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const board = useBoardStore((s) => s.activeBoard());
  const tool = useBoardStore((s) => s.tool);
  const color = useBoardStore((s) => s.color);
  const size = useBoardStore((s) => s.size);
  const commitStroke = useBoardStore((s) => s.commitStroke);
  const eraseStrokes = useBoardStore((s) => s.eraseStrokes);
  const selectedImageId = useBoardStore((s) => s.selectedImageId);
  const setSelectedImage = useBoardStore((s) => s.setSelectedImage);
  const updateImage = useBoardStore((s) => s.updateImage);
  const addImage = useBoardStore((s) => s.addImage);

  const [live, setLive] = useState<Point[] | null>(null);
  const [erasing, setErasing] = useState<Set<string>>(new Set());
  const [lasers, setLasers] = useState<Laser[]>([]);
  const [liveLaser, setLiveLaser] = useState<Point[] | null>(null);
  const [drag, setDrag] = useState<Drag>(null);
  const [liveRect, setLiveRect] = useState<BoardImage | null>(null);
  const drawing = useRef(false);

  const toVirtual = useCallback(
    (clientX: number, clientY: number): [number, number] => {
      const svg = svgRef.current;
      if (!svg) return [0, 0];
      const rect = svg.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * VIRTUAL_W;
      const y = ((clientY - rect.top) / rect.height) * VIRTUAL_H;
      return [x, y];
    },
    []
  );

  // ----- laser fade loop -----
  useEffect(() => {
    if (lasers.length === 0) return;
    const t = setInterval(() => {
      setLasers((prev) => prev.filter((l) => Date.now() - l.born < 1400));
    }, 80);
    return () => clearInterval(t);
  }, [lasers.length]);

  // ----- paste image -----
  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) =>
        i.type.startsWith("image/")
      );
      if (!item) return;
      const file = item.getAsFile();
      if (file) insertImageFile(file, addImage);
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [addImage]);

  const hitImage = useCallback(
    (x: number, y: number): BoardImage | null => {
      for (let i = board.images.length - 1; i >= 0; i--) {
        const im = board.images[i];
        if (x >= im.x && x <= im.x + im.w && y >= im.y && y <= im.y + im.h)
          return im;
      }
      return null;
    },
    [board.images]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      try {
        (e.target as Element).setPointerCapture?.(e.pointerId);
      } catch {
        /* ignore — capture not available for this pointer */
      }
      const [x, y] = toVirtual(e.clientX, e.clientY);
      const pressure = e.pressure > 0 ? e.pressure : 0.5;

      if (tool === "select") {
        const sel = board.images.find((im) => im.id === selectedImageId);
        // resize handle of selected image?
        if (
          sel &&
          x >= sel.x + sel.w - HANDLE &&
          x <= sel.x + sel.w + HANDLE &&
          y >= sel.y + sel.h - HANDLE &&
          y <= sel.y + sel.h + HANDLE
        ) {
          setDrag({ mode: "resize", id: sel.id, sx: x, sy: y, orig: sel });
          drawing.current = true;
          return;
        }
        const hit = hitImage(x, y);
        setSelectedImage(hit ? hit.id : null);
        if (hit) {
          setDrag({ mode: "move", id: hit.id, sx: x, sy: y, orig: hit });
          drawing.current = true;
        }
        return;
      }

      drawing.current = true;

      if (tool === "eraser") {
        const hit = new Set<string>();
        for (const s of board.strokes) if (pointNearStroke(x, y, s, 14)) hit.add(s.id);
        setErasing(hit);
      } else if (tool === "laser") {
        setLiveLaser([[x, y, pressure]]);
      } else {
        setLive([[x, y, pressure]]);
      }
    },
    [board.images, board.strokes, hitImage, selectedImageId, setSelectedImage, toVirtual, tool]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drawing.current) return;
      const [x, y] = toVirtual(e.clientX, e.clientY);
      const pressure = e.pressure > 0 ? e.pressure : 0.5;

      if (tool === "select" && drag) {
        const dx = x - drag.sx;
        const dy = y - drag.sy;
        if (drag.mode === "move") {
          setLiveRect({ ...drag.orig, x: drag.orig.x + dx, y: drag.orig.y + dy });
        } else {
          const w = Math.max(40, drag.orig.w + dx);
          const h = Math.max(40, drag.orig.h + dy);
          setLiveRect({ ...drag.orig, w, h });
        }
        return;
      }

      if (tool === "eraser") {
        setErasing((prev) => {
          const next = new Set(prev);
          for (const s of board.strokes)
            if (!next.has(s.id) && pointNearStroke(x, y, s, 14)) next.add(s.id);
          return next;
        });
      } else if (tool === "laser") {
        setLiveLaser((prev) => (prev ? [...prev, [x, y, pressure]] : [[x, y, pressure]]));
      } else {
        setLive((prev) => (prev ? [...prev, [x, y, pressure]] : [[x, y, pressure]]));
      }
    },
    [board.strokes, drag, toVirtual, tool]
  );

  const onPointerUp = useCallback(() => {
    if (!drawing.current) return;
    drawing.current = false;

    if (tool === "select") {
      if (drag && liveRect)
        updateImage(drag.id, { x: liveRect.x, y: liveRect.y, w: liveRect.w, h: liveRect.h });
      setDrag(null);
      setLiveRect(null);
      return;
    }

    if (tool === "eraser") {
      eraseStrokes(Array.from(erasing));
      setErasing(new Set());
      return;
    }

    if (tool === "laser") {
      if (liveLaser && liveLaser.length > 0)
        setLasers((prev) => [...prev, { id: uid(), points: liveLaser, born: Date.now() }]);
      setLiveLaser(null);
      return;
    }

    if (live && live.length > 0) {
      commitStroke({
        id: uid(),
        tool,
        color,
        size,
        opacity: defaultOpacity(tool),
        points: live,
      });
    }
    setLive(null);
  }, [color, commitStroke, drag, erasing, eraseStrokes, live, liveLaser, liveRect, size, tool, updateImage]);

  const livePath = useMemo(() => {
    if (!live || live.length === 0) return null;
    const outline = getStroke(live, strokeOptions(tool, size));
    return getSvgPathFromStroke(outline as number[][]);
  }, [live, size, tool]);

  const laserPathOf = (pts: Point[]) =>
    getSvgPathFromStroke(getStroke(pts, strokeOptions("marker", 7)) as number[][]);

  const grid = gridColor(board.background);
  const cursor =
    tool === "select" ? "default" : tool === "eraser" ? "cell" : "crosshair";

  return (
    <div className="relative h-full w-full p-4 sm:p-6">
      <div className="mx-auto h-full w-full max-w-[1600px]">
        <div
          className="relative mx-auto overflow-hidden rounded-2xl shadow-panel ring-1 ring-arva-edge"
          style={{ aspectRatio: `${VIRTUAL_W} / ${VIRTUAL_H}`, maxHeight: "100%" }}
        >
          <svg
            ref={svgRef}
            className="board-surface absolute inset-0 h-full w-full"
            viewBox={`0 0 ${VIRTUAL_W} ${VIRTUAL_H}`}
            style={{ cursor, background: backgroundFill(board.background) }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {grid && (
              <>
                <defs>
                  <pattern id="arva-grid" width={40} height={40} patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke={grid} strokeWidth={1} />
                  </pattern>
                </defs>
                <rect width={VIRTUAL_W} height={VIRTUAL_H} fill="url(#arva-grid)" />
              </>
            )}

            {/* images (under the ink) */}
            {board.images.map((im) => {
              const r = liveRect && liveRect.id === im.id ? liveRect : im;
              return (
                <image
                  key={im.id}
                  href={im.src}
                  x={r.x}
                  y={r.y}
                  width={r.w}
                  height={r.h}
                  preserveAspectRatio="none"
                />
              );
            })}

            {/* committed strokes */}
            {board.strokes.map((s) => (
              <path
                key={s.id}
                d={strokeToSvgPath(s)}
                fill={s.color}
                opacity={erasing.has(s.id) ? 0.2 : s.opacity}
              />
            ))}

            {/* live drawing */}
            {livePath && <path d={livePath} fill={color} opacity={defaultOpacity(tool)} />}

            {/* laser ink (fading) */}
            {lasers.map((l) => {
              const age = Date.now() - l.born;
              const op = Math.max(0, 1 - age / 1400);
              return (
                <path
                  key={l.id}
                  d={laserPathOf(l.points)}
                  fill="#ff2b2b"
                  opacity={op * 0.9}
                  style={{ filter: "drop-shadow(0 0 8px rgba(255,40,40,0.9))" }}
                />
              );
            })}
            {liveLaser && (
              <path
                d={laserPathOf(liveLaser)}
                fill="#ff2b2b"
                opacity={0.95}
                style={{ filter: "drop-shadow(0 0 8px rgba(255,40,40,0.9))" }}
              />
            )}

            {/* selection box + resize handle */}
            {tool === "select" &&
              selectedImageId &&
              (() => {
                const im = board.images.find((i) => i.id === selectedImageId);
                if (!im) return null;
                const r = liveRect && liveRect.id === im.id ? liveRect : im;
                return (
                  <g>
                    <rect
                      x={r.x}
                      y={r.y}
                      width={r.w}
                      height={r.h}
                      fill="none"
                      stroke="#F5B82E"
                      strokeWidth={2}
                      strokeDasharray="8 6"
                    />
                    <rect
                      x={r.x + r.w - HANDLE / 2}
                      y={r.y + r.h - HANDLE / 2}
                      width={HANDLE}
                      height={HANDLE}
                      rx={4}
                      fill="#F5B82E"
                      style={{ cursor: "nwse-resize" }}
                    />
                  </g>
                );
              })()}
          </svg>
        </div>
      </div>
    </div>
  );
}

// Load a File/Blob as an image and add it centered on the board.
export function insertImageFile(
  file: File,
  addImage: (img: BoardImage) => void
) {
  const reader = new FileReader();
  reader.onload = () => {
    const src = reader.result as string;
    const probe = new Image();
    probe.onload = () => {
      const maxW = VIRTUAL_W * 0.55;
      const maxH = VIRTUAL_H * 0.7;
      let w = probe.naturalWidth || 600;
      let h = probe.naturalHeight || 400;
      const scale = Math.min(maxW / w, maxH / h, 1);
      w *= scale;
      h *= scale;
      addImage({
        id: uid(),
        src,
        x: (VIRTUAL_W - w) / 2,
        y: (VIRTUAL_H - h) / 2,
        w,
        h,
      });
    };
    probe.src = src;
  };
  reader.readAsDataURL(file);
}

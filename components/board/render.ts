import { getStroke } from "perfect-freehand";
import {
  Board,
  BackgroundType,
  Point,
  Stroke,
  ToolType,
  VIRTUAL_H,
  VIRTUAL_W,
} from "./types";

// Per-tool stroke shaping. This is what makes writing feel clean & premium
// instead of clumsy: pressure thinning, smoothing and streamlining.
export function strokeOptions(tool: ToolType, size: number) {
  switch (tool) {
    case "pen":
      return {
        size,
        thinning: 0.38,       // was 0.6 — less aggressive thinning keeps letter joins solid
        smoothing: 0.5,       // was 0.6
        streamline: 0.22,     // was 0.55 — low streamline = stroke follows cursor closely, no lag
        simulatePressure: true,
      };
    case "pencil":
      return {
        size: size * 0.9,     // was 0.85
        thinning: 0.3,        // was 0.45
        smoothing: 0.45,      // was 0.55
        streamline: 0.18,     // was 0.5 — very responsive for handwriting feel
        simulatePressure: true,
      };
    case "marker":
      return {
        size: size * 1.5,
        thinning: 0.1,        // was 0.15 — more consistent width for block letters
        smoothing: 0.5,
        streamline: 0.3,      // was 0.5 — follows writing hand without stuttering
        simulatePressure: false,
      };
    case "highlighter":
      return {
        size: size * 2.6,
        thinning: 0,
        smoothing: 0.4,       // was 0.45
        streamline: 0.28,     // was 0.45 — keeps up with fast highlighting sweeps
        simulatePressure: false,
      };
    case "eraser":
    default:
      return { size, thinning: 0.5, smoothing: 0.5, streamline: 0.3 };
  }
}

export function defaultOpacity(tool: ToolType) {
  return tool === "highlighter" ? 0.35 : 1;
}

// Convert perfect-freehand outline points into an SVG path string.
export function getSvgPathFromStroke(points: number[][]): string {
  if (!points.length) return "";
  const d = points.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", points[0][0], points[0][1], "Q"] as (string | number)[]
  );
  d.push("Z");
  return d.join(" ");
}

export function strokeToSvgPath(stroke: Stroke): string {
  const outline = getStroke(
    stroke.points,
    strokeOptions(stroke.tool, stroke.size)
  );
  return getSvgPathFromStroke(outline as number[][]);
}

// ---- Backgrounds -------------------------------------------------------

export function backgroundFill(bg: BackgroundType): string {
  switch (bg) {
    case "black":
    case "grid-black":
      return "#0f0f12";
    case "gray":
      return "#3a3a40";
    case "white":
    case "grid-white":
    default:
      return "#ffffff";
  }
}

export function backgroundIsDark(bg: BackgroundType): boolean {
  return bg === "black" || bg === "grid-black";
}

export function gridColor(bg: BackgroundType): string | null {
  if (bg === "grid-white") return "rgba(0,0,0,0.07)";
  if (bg === "grid-black") return "rgba(255,255,255,0.08)";
  return null;
}

// ---- Canvas rendering (used by thumbnails + PDF/Word export) -----------

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(img);
    img.src = src;
  });
}

export async function renderBoardToCanvas(
  board: Board,
  canvas: HTMLCanvasElement,
  scale = 1
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = VIRTUAL_W * scale;
  canvas.height = VIRTUAL_H * scale;
  ctx.scale(scale, scale);

  // background
  ctx.fillStyle = backgroundFill(board.background);
  ctx.fillRect(0, 0, VIRTUAL_W, VIRTUAL_H);

  // grid
  const grid = gridColor(board.background);
  if (grid) {
    ctx.strokeStyle = grid;
    ctx.lineWidth = 1;
    const step = 40;
    ctx.beginPath();
    for (let x = step; x < VIRTUAL_W; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, VIRTUAL_H);
    }
    for (let y = step; y < VIRTUAL_H; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(VIRTUAL_W, y);
    }
    ctx.stroke();
  }

  // images (drawn under the ink)
  for (const im of board.images ?? []) {
    const el = await loadImage(im.src);
    try {
      ctx.drawImage(el, im.x, im.y, im.w, im.h);
    } catch {
      /* ignore broken image */
    }
  }

  // strokes
  for (const stroke of board.strokes) {
    const path = new Path2D(strokeToSvgPath(stroke));
    ctx.globalAlpha = stroke.opacity;
    ctx.fillStyle = stroke.color;
    ctx.fill(path);
  }
  ctx.globalAlpha = 1;
}

export async function boardToDataUrl(board: Board, scale = 2): Promise<string> {
  const canvas = document.createElement("canvas");
  await renderBoardToCanvas(board, canvas, scale);
  return canvas.toDataURL("image/png");
}

// Distance helper used by the eraser to test stroke hits.
export function pointNearStroke(
  px: number,
  py: number,
  stroke: Stroke,
  threshold: number
): boolean {
  const t2 = threshold * threshold;
  const pts: Point[] = stroke.points;
  for (let i = 0; i < pts.length; i++) {
    const dx = pts[i][0] - px;
    const dy = pts[i][1] - py;
    if (dx * dx + dy * dy <= t2) return true;
  }
  return false;
}

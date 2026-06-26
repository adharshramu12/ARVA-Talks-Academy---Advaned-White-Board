// Core data model for the Arva drawing pad.
// The board uses a fixed virtual coordinate system (VIRTUAL_W x VIRTUAL_H)
// so strokes stay crisp and consistent at any screen size and in exports.

export const VIRTUAL_W = 1600;
export const VIRTUAL_H = 900;

export type ToolType =
  | "select"
  | "pen"
  | "pencil"
  | "marker"
  | "highlighter"
  | "laser"
  | "eraser";

export type BackgroundType =
  | "white"
  | "black"
  | "gray"
  | "grid-white"
  | "grid-black";

// A single point: [x, y, pressure]
export type Point = [number, number, number];

export interface Stroke {
  id: string;
  tool: ToolType;
  color: string;
  size: number;
  opacity: number;
  points: Point[];
}

export interface BoardImage {
  id: string;
  src: string; // data URL
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Board {
  id: string;
  name: string;
  background: BackgroundType;
  strokes: Stroke[];
  images: BoardImage[];
}

export interface ProjectState {
  id: string;
  title: string;
  boards: Board[];
  updatedAt: number;
}

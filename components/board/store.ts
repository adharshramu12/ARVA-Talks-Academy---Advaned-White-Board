"use client";

import { create } from "zustand";
import {
  Board,
  BackgroundType,
  BoardImage,
  ProjectState,
  Stroke,
  ToolType,
} from "./types";

const uid = () => Math.random().toString(36).slice(2, 10);
const sessionId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `s-${uid()}-${uid()}`;

function newBoard(name: string, background: BackgroundType = "white"): Board {
  return { id: uid(), name, background, strokes: [], images: [] };
}

// Ensure boards loaded from older saves have all fields.
function migrate(project: ProjectState): ProjectState {
  return {
    ...project,
    boards: project.boards.map((b) => ({ ...b, images: b.images ?? [] })),
  };
}

function emptyProject(): ProjectState {
  return {
    id: sessionId(),
    title: "Untitled session",
    boards: [newBoard("Board 1")],
    updatedAt: Date.now(),
  };
}

const STORAGE_KEY = "arva-drawing-pad-project";

function loadFromLocal(): ProjectState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ProjectState;
    if (!parsed.boards?.length) return null;
    return migrate(parsed);
  } catch {
    return null;
  }
}

function saveToLocal(project: ProjectState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  } catch {
    /* storage full / unavailable — ignore */
  }
}

interface BoardStore {
  project: ProjectState;
  activeBoardId: string;

  // tool settings
  tool: ToolType;
  color: string;
  size: number;

  // image selection (for move/resize with the select tool)
  selectedImageId: string | null;

  // undo / redo for the ACTIVE board
  past: Stroke[][];
  future: Stroke[][];

  // ui
  saving: "idle" | "saving" | "saved";

  // actions
  hydrate: () => void;
  setTool: (t: ToolType) => void;
  setColor: (c: string) => void;
  setSize: (s: number) => void;

  activeBoard: () => Board;
  setActiveBoard: (id: string) => void;
  addBoard: () => void;
  duplicateBoard: (id: string) => void;
  deleteBoard: (id: string) => void;
  renameBoard: (id: string, name: string) => void;
  setBackground: (bg: BackgroundType) => void;
  setTitle: (t: string) => void;

  setSelectedImage: (id: string | null) => void;
  addImage: (img: BoardImage) => void;
  updateImage: (id: string, patch: Partial<BoardImage>) => void;
  removeImage: (id: string) => void;

  commitStroke: (stroke: Stroke) => void;
  eraseStrokes: (ids: string[]) => void;
  clearBoard: () => void;
  undo: () => void;
  redo: () => void;
  loadProject: (p: ProjectState) => void;
  newSession: () => void;
}

function touch(project: ProjectState): ProjectState {
  const updated = { ...project, updatedAt: Date.now() };
  saveToLocal(updated);
  return updated;
}

export const useBoardStore = create<BoardStore>((set, get) => ({
  project: emptyProject(),
  activeBoardId: "",
  tool: "pen",
  color: "#111827",
  size: 6,
  selectedImageId: null,
  past: [],
  future: [],
  saving: "idle",

  hydrate: () => {
    const loaded = loadFromLocal() ?? emptyProject();
    set({ project: loaded, activeBoardId: loaded.boards[0].id });
  },

  setTool: (t) =>
    set({ tool: t, selectedImageId: t === "select" ? get().selectedImageId : null }),
  setColor: (c) => set({ color: c, tool: get().tool === "eraser" ? "pen" : get().tool }),
  setSize: (s) => set({ size: s }),

  activeBoard: () => {
    const { project, activeBoardId } = get();
    return (
      project.boards.find((b) => b.id === activeBoardId) ?? project.boards[0]
    );
  },

  setActiveBoard: (id) =>
    set({ activeBoardId: id, past: [], future: [], selectedImageId: null }),

  addBoard: () => {
    const { project } = get();
    const board = newBoard(`Board ${project.boards.length + 1}`, get().activeBoard().background);
    const updated = touch({ ...project, boards: [...project.boards, board] });
    set({ project: updated, activeBoardId: board.id, past: [], future: [] });
  },

  duplicateBoard: (id) => {
    const { project } = get();
    const src = project.boards.find((b) => b.id === id);
    if (!src) return;
    const copy: Board = {
      ...src,
      id: uid(),
      name: `${src.name} copy`,
      strokes: src.strokes.map((s) => ({ ...s, id: uid() })),
    };
    const idx = project.boards.findIndex((b) => b.id === id);
    const boards = [...project.boards];
    boards.splice(idx + 1, 0, copy);
    set({ project: touch({ ...project, boards }), activeBoardId: copy.id, past: [], future: [] });
  },

  deleteBoard: (id) => {
    const { project } = get();
    if (project.boards.length <= 1) {
      // never leave the session with zero boards — reset it instead
      const fresh = newBoard("Board 1");
      set({
        project: touch({ ...project, boards: [fresh] }),
        activeBoardId: fresh.id,
        past: [],
        future: [],
      });
      return;
    }
    const idx = project.boards.findIndex((b) => b.id === id);
    const boards = project.boards.filter((b) => b.id !== id);
    const nextActive = boards[Math.max(0, idx - 1)].id;
    set({
      project: touch({ ...project, boards }),
      activeBoardId: get().activeBoardId === id ? nextActive : get().activeBoardId,
      past: [],
      future: [],
    });
  },

  renameBoard: (id, name) => {
    const { project } = get();
    const boards = project.boards.map((b) =>
      b.id === id ? { ...b, name } : b
    );
    set({ project: touch({ ...project, boards }) });
  },

  setBackground: (bg) => {
    const { project, activeBoardId } = get();
    const boards = project.boards.map((b) =>
      b.id === activeBoardId ? { ...b, background: bg } : b
    );
    set({ project: touch({ ...project, boards }) });
  },

  setTitle: (t) => set({ project: touch({ ...get().project, title: t }) }),

  setSelectedImage: (id) => set({ selectedImageId: id }),

  addImage: (img) => {
    const { project, activeBoardId } = get();
    const boards = project.boards.map((b) =>
      b.id === activeBoardId ? { ...b, images: [...b.images, img] } : b
    );
    set({
      project: touch({ ...project, boards }),
      tool: "select",
      selectedImageId: img.id,
    });
  },

  updateImage: (id, patch) => {
    const { project, activeBoardId } = get();
    const boards = project.boards.map((b) =>
      b.id === activeBoardId
        ? {
            ...b,
            images: b.images.map((im) => (im.id === id ? { ...im, ...patch } : im)),
          }
        : b
    );
    set({ project: touch({ ...project, boards }) });
  },

  removeImage: (id) => {
    const { project, activeBoardId, selectedImageId } = get();
    const boards = project.boards.map((b) =>
      b.id === activeBoardId
        ? { ...b, images: b.images.filter((im) => im.id !== id) }
        : b
    );
    set({
      project: touch({ ...project, boards }),
      selectedImageId: selectedImageId === id ? null : selectedImageId,
    });
  },

  commitStroke: (stroke) => {
    const { project, activeBoardId, past } = get();
    const board = get().activeBoard();
    const boards = project.boards.map((b) =>
      b.id === activeBoardId ? { ...b, strokes: [...b.strokes, stroke] } : b
    );
    set({
      project: touch({ ...project, boards }),
      past: [...past, board.strokes],
      future: [],
    });
  },

  eraseStrokes: (ids) => {
    if (!ids.length) return;
    const { project, activeBoardId, past } = get();
    const board = get().activeBoard();
    const remaining = board.strokes.filter((s) => !ids.includes(s.id));
    if (remaining.length === board.strokes.length) return;
    const boards = project.boards.map((b) =>
      b.id === activeBoardId ? { ...b, strokes: remaining } : b
    );
    set({
      project: touch({ ...project, boards }),
      past: [...past, board.strokes],
      future: [],
    });
  },

  clearBoard: () => {
    const { project, activeBoardId, past } = get();
    const board = get().activeBoard();
    if (!board.strokes.length) return;
    const boards = project.boards.map((b) =>
      b.id === activeBoardId ? { ...b, strokes: [] } : b
    );
    set({
      project: touch({ ...project, boards }),
      past: [...past, board.strokes],
      future: [],
    });
  },

  undo: () => {
    const { past, future, project, activeBoardId } = get();
    if (!past.length) return;
    const board = get().activeBoard();
    const prev = past[past.length - 1];
    const boards = project.boards.map((b) =>
      b.id === activeBoardId ? { ...b, strokes: prev } : b
    );
    set({
      project: touch({ ...project, boards }),
      past: past.slice(0, -1),
      future: [board.strokes, ...future],
    });
  },

  redo: () => {
    const { past, future, project, activeBoardId } = get();
    if (!future.length) return;
    const board = get().activeBoard();
    const next = future[0];
    const boards = project.boards.map((b) =>
      b.id === activeBoardId ? { ...b, strokes: next } : b
    );
    set({
      project: touch({ ...project, boards }),
      past: [...past, board.strokes],
      future: future.slice(1),
    });
  },

  loadProject: (p) =>
    set({
      project: touch(migrate(p)),
      activeBoardId: p.boards[0].id,
      past: [],
      future: [],
      selectedImageId: null,
    }),

  newSession: () => {
    const p = emptyProject();
    set({
      project: touch(p),
      activeBoardId: p.boards[0].id,
      past: [],
      future: [],
      selectedImageId: null,
    });
  },
}));

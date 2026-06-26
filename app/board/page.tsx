"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/board/TopBar";
import Toolbar from "@/components/board/Toolbar";
import Whiteboard from "@/components/board/Whiteboard";
import SlidesPanel from "@/components/board/SlidesPanel";
import EngagementDock from "@/components/board/EngagementDock";
import { useBoardStore } from "@/components/board/store";
import { useAuth } from "@/components/auth/AuthProvider";
import { upsertSession } from "@/lib/cloud";

export default function BoardPage() {
  const hydrate = useBoardStore((s) => s.hydrate);
  const undo = useBoardStore((s) => s.undo);
  const redo = useBoardStore((s) => s.redo);
  const setTool = useBoardStore((s) => s.setTool);
  const addBoard = useBoardStore((s) => s.addBoard);
  const removeImage = useBoardStore((s) => s.removeImage);
  const setSelectedImage = useBoardStore((s) => s.setSelectedImage);
  const updatedAt = useBoardStore((s) => s.project.updatedAt);
  const { user } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrate();
    setReady(true);
  }, [hydrate]);

  // Debounced cloud auto-save for signed-in mentors.
  useEffect(() => {
    if (!user) return;
    const t = setTimeout(() => {
      upsertSession(user.id, useBoardStore.getState().project);
    }, 1500);
    return () => clearTimeout(t);
  }, [user, updatedAt]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      const mod = e.ctrlKey || e.metaKey;

      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
        return;
      }
      const sel = useBoardStore.getState().selectedImageId;
      if ((e.key === "Delete" || e.key === "Backspace") && sel) {
        e.preventDefault();
        removeImage(sel);
        return;
      }
      if (e.key === "Escape") {
        setSelectedImage(null);
        return;
      }
      if (!mod) {
        switch (e.key.toLowerCase()) {
          case "v":
            setTool("select");
            break;
          case "p":
            setTool("pen");
            break;
          case "b":
            setTool("pencil");
            break;
          case "m":
            setTool("marker");
            break;
          case "h":
            setTool("highlighter");
            break;
          case "l":
            setTool("laser");
            break;
          case "e":
            setTool("eraser");
            break;
          case "n":
            addBoard();
            break;
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo, setTool, addBoard, removeImage, setSelectedImage]);

  if (!ready) {
    return (
      <div className="grid h-screen place-items-center bg-arva-black text-zinc-500">
        Loading your boards…
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col gap-3 bg-arva-black p-3">
      <TopBar />
      <div className="flex min-h-0 flex-1 gap-3">
        <Toolbar />
        <main className="min-w-0 flex-1">
          <Whiteboard />
        </main>
      </div>
      <SlidesPanel />
      <EngagementDock />
    </div>
  );
}

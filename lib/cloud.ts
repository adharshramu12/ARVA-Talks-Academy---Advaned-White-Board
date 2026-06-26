"use client";

import { supabase } from "./supabase";
import { Board, ProjectState } from "@/components/board/types";

export interface SessionMeta {
  id: string;
  title: string;
  is_shared: boolean;
  updated_at: string;
}

/** Save (insert or update) the current session for a logged-in mentor. */
export async function upsertSession(userId: string, project: ProjectState) {
  if (!supabase) return { error: "cloud-disabled" };
  const { error } = await supabase.from("projects").upsert({
    id: project.id,
    owner: userId,
    title: project.title || "Untitled session",
    data: { boards: project.boards },
    updated_at: new Date().toISOString(),
  });
  return { error: error?.message ?? null };
}

/** List the mentor's saved sessions (newest first). */
export async function listSessions(): Promise<SessionMeta[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("projects")
    .select("id,title,is_shared,updated_at")
    .order("updated_at", { ascending: false });
  return (data as SessionMeta[]) ?? [];
}

/** Load one session into a ProjectState. */
export async function loadSession(id: string): Promise<ProjectState | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from("projects")
    .select("id,title,data,updated_at")
    .eq("id", id)
    .single();
  if (!data) return null;
  const boards = (data.data?.boards ?? []) as Board[];
  return {
    id: data.id,
    title: data.title,
    boards: boards.length ? boards : [],
    updatedAt: new Date(data.updated_at).getTime(),
  };
}

export async function deleteSession(id: string) {
  if (!supabase) return;
  await supabase.from("projects").delete().eq("id", id);
}

/** Toggle a public read-only share link for a session. */
export async function setShared(id: string, shared: boolean) {
  if (!supabase) return;
  await supabase.from("projects").update({ is_shared: shared }).eq("id", id);
}

"use client";

import { useCallback, useEffect, useState } from "react";
import {
  X,
  Plus,
  CloudUpload,
  FolderOpen,
  Trash2,
  Link2,
  Check,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useBoardStore } from "./store";
import {
  SessionMeta,
  deleteSession,
  listSessions,
  loadSession,
  setShared,
  upsertSession,
} from "@/lib/cloud";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.2 5.2C41.4 36.4 44 30.8 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

export default function SessionsModal({ onClose }: { onClose: () => void }) {
  const { user, cloudEnabled, signInWithGoogle, signOut } = useAuth();
  const project = useBoardStore((s) => s.project);
  const loadProject = useBoardStore((s) => s.loadProject);
  const newSession = useBoardStore((s) => s.newSession);

  const [sessions, setSessions] = useState<SessionMeta[]>([]);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (user) setSessions(await listSessions());
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveNow = async () => {
    if (!user) return;
    setBusy(true);
    await upsertSession(user.id, project);
    await refresh();
    setBusy(false);
  };

  const open = async (id: string) => {
    const p = await loadSession(id);
    if (p) {
      loadProject(p);
      onClose();
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this saved session?")) return;
    await deleteSession(id);
    await refresh();
  };

  const share = async (s: SessionMeta) => {
    await setShared(s.id, !s.is_shared);
    if (!s.is_shared) {
      const link = `${window.location.origin}/s/${s.id}`;
      await navigator.clipboard.writeText(link).catch(() => {});
      setCopied(s.id);
      setTimeout(() => setCopied(null), 2000);
    }
    await refresh();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[80vh] w-[540px] max-w-[94vw] flex-col rounded-2xl border border-arva-edge bg-arva-panel shadow-panel">
        <div className="flex items-center justify-between border-b border-arva-edge p-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <FolderOpen size={18} className="text-arva-gold" /> My sessions
          </h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {!cloudEnabled ? (
            <div className="rounded-xl border border-arva-edge bg-black/30 p-5 text-sm text-zinc-400">
              Cloud sync is off. Add your Supabase URL + anon key to{" "}
              <code className="text-arva-gold">.env.local</code> to save sessions
              online. Your work is still auto-saved in this browser.
            </div>
          ) : !user ? (
            <div className="grid place-items-center gap-4 py-8 text-center">
              <p className="max-w-xs text-sm text-zinc-400">
                Sign in to save your boards to the cloud and open them on any
                device.
              </p>
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 font-semibold text-zinc-800 transition hover:bg-zinc-100"
              >
                <GoogleIcon /> Sign in with Google
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between gap-2">
                <button
                  onClick={saveNow}
                  disabled={busy}
                  className="flex items-center gap-2 rounded-xl bg-arva-gold px-3 py-2 text-sm font-semibold text-black transition hover:bg-arva-goldsoft disabled:opacity-50"
                >
                  <CloudUpload size={16} /> {busy ? "Saving…" : "Save current"}
                </button>
                <button
                  onClick={() => {
                    newSession();
                    onClose();
                  }}
                  className="flex items-center gap-2 rounded-xl border border-arva-edge bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
                >
                  <Plus size={16} /> New session
                </button>
              </div>

              <div className="space-y-2">
                {sessions.length === 0 && (
                  <p className="py-6 text-center text-sm text-zinc-500">
                    No saved sessions yet — hit “Save current”.
                  </p>
                )}
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-2 rounded-xl border border-arva-edge bg-black/20 p-2.5"
                  >
                    <button
                      onClick={() => open(s.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="truncate text-sm font-medium text-zinc-100">
                        {s.title || "Untitled session"}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {new Date(s.updated_at).toLocaleString()}
                        {s.is_shared && (
                          <span className="ml-2 text-green-400">· shared</span>
                        )}
                      </div>
                    </button>
                    <button
                      title={s.is_shared ? "Sharing on — click to copy/stop" : "Share read-only link"}
                      onClick={() => share(s)}
                      className={`grid h-8 w-8 place-items-center rounded-lg transition ${
                        s.is_shared
                          ? "bg-green-500/15 text-green-400"
                          : "text-zinc-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {copied === s.id ? <Check size={15} /> : <Link2 size={15} />}
                    </button>
                    <button
                      onClick={() => open(s.id)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white"
                      title="Open"
                    >
                      <FolderOpen size={15} />
                    </button>
                    <button
                      onClick={() => remove(s.id)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 hover:bg-red-500/20 hover:text-red-300"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {user && (
          <div className="flex items-center justify-between border-t border-arva-edge p-3 text-sm">
            <span className="truncate text-zinc-400">{user.email}</span>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-zinc-300 hover:bg-white/10 hover:text-white"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

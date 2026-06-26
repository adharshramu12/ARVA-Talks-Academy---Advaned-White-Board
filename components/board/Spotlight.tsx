"use client";

import { useEffect, useState } from "react";

/**
 * Dims the whole screen except a soft circle that follows the cursor.
 * Pointer-events are disabled so the mentor can still write underneath.
 */
export default function Spotlight({ on }: { on: boolean }) {
  const [pos, setPos] = useState({ x: -9999, y: -9999 });

  useEffect(() => {
    if (!on) return;
    function move(e: PointerEvent) {
      setPos({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [on]);

  if (!on) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40"
      style={{
        background: `radial-gradient(circle 150px at ${pos.x}px ${pos.y}px, transparent 0%, transparent 70%, rgba(0,0,0,0.82) 100%)`,
        animation: "arva-spotlight-pulse 3s ease-in-out infinite",
      }}
    />
  );
}

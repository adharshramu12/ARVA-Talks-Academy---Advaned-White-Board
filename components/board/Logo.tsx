"use client";

import { useState } from "react";

/**
 * Arva Talks Academy lockup. Shows the gold eagle logo from /public/logo.png
 * when present, and always renders a clean gold/silver wordmark so the brand
 * never breaks even before the image is added.
 */
export default function Logo({
  size = 36,
  showWordmark = true,
}: {
  size?: number;
  showWordmark?: boolean;
}) {
  const [hasImg, setHasImg] = useState(true);

  return (
    <div className="flex items-center gap-3 select-none">
      {hasImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logo.png"
          alt="Arva Talks Academy"
          width={size}
          height={size}
          onError={() => setHasImg(false)}
          className="rounded-md object-contain"
          style={{ width: size, height: size }}
        />
      ) : (
        <div
          className="grid place-items-center rounded-md bg-gradient-to-br from-arva-gold to-amber-600 font-extrabold text-black"
          style={{ width: size, height: size, fontSize: size * 0.5 }}
        >
          A
        </div>
      )}
      {showWordmark && (
        <div className="leading-none">
          <div className="text-[15px] font-extrabold tracking-wide text-white">
            ARVA TALKS
          </div>
          <div className="text-[10px] font-semibold tracking-[0.3em] text-arva-gold">
            ACADEMY
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

// Lightweight WebAudio chimes so reactions/timer feel alive.
// Stage 4 will swap in real clap/drum/cheer audio samples.

let ctx: AudioContext | null = null;
function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (AC) ctx = new AC();
  }
  return ctx;
}

function tone(freq: number, start: number, dur: number, gain = 0.18) {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = "triangle";
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, ac.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, ac.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + dur + 0.02);
}

export function chime() {
  [523.25, 659.25, 783.99].forEach((f, i) => tone(f, i * 0.08, 0.45));
}

export function beep() {
  tone(880, 0, 0.18, 0.22);
  tone(880, 0.22, 0.18, 0.22);
}

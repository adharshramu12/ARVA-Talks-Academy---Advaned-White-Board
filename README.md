# ARVA Talks Academy — Advanced White Board

> A free, open-source **Apple-style premium teaching whiteboard** built for online educators.
> Screen-share it in Zoom or Google Meet — buttery-smooth drawing, unlimited boards, laser pointer, student engagement tools, cloud sync, and export. No subscription. No lag. No irritation.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

---

## 💡 Why We Built This & Why We Open Sourced It

**By Adharsh Kumar Bachu — Founder, Arva Talks Academy**

Every online educator knows the frustration.

You open a whiteboard in the middle of class — Miro, Google Jamboard, Zoom's built-in board, or any of the dozen tools out there — and the moment you start writing, it **lags**. The pen stutters. The brush skips. Students stare at a frozen stroke for 3 seconds before it catches up. You apologize, switch tools, lose momentum, and the class vibe is gone.

> **Existing online whiteboards were not built for teachers. They were built for designers, product managers, and remote teams.**

At Arva Talks Academy, we mentor students every day through live online sessions. We needed a whiteboard that felt like writing on **real paper** — instant, smooth, and beautiful — without the internet lag ruining the experience.

So we built one.

**Why open source?**

Because this problem isn't unique to Arva. Thousands of online educators, tutors, coding bootcamps, and teaching academies face the exact same issue every single day. A tool this useful shouldn't be locked behind a subscription or throttled by a slow SaaS server.

With this open-source release, any teacher in the world can:
- Clone it and run it **locally** — zero lag, because it runs on your own machine
- Host it on their own server for their academy
- Customize it for their brand
- Make it better and share it back

**This is our contribution to the global teaching community.**

---

## 🍎 Apple-Style Design — The Core Philosophy

> *"Most whiteboards feel like software. This one feels like a premium tool."*

The single biggest design principle behind this whiteboard is **Apple-style craftsmanship** — every interaction should feel effortless, refined, and satisfying.

### What "Apple-style" means in practice:

| Principle | How it shows up |
|-----------|----------------|
| **Pressure-aware strokes** | Pen, pencil, marker, and highlighter all respond to drawing speed — slow = thick, fast = thin — just like an Apple Pencil on iPad |
| **SVG rendering** | Strokes are rendered as crisp, infinitely scalable SVG paths — no pixelation at any zoom level |
| **Tool feel** | Each tool has a distinct personality — pencil feels grainy, marker bold, highlighter translucent — not just colour changes |
| **Minimal, clean UI** | The toolbar and controls stay out of your way. The board is the hero. |
| **Smooth animations** | Laser pointer fades naturally, reaction rain flows, transitions are fluid |
| **Instant response** | Zero network round-trips for drawing — everything happens locally in the browser at 60fps |
| **Dark & light modes** | Black and white board backgrounds with matching UI — like switching between a chalkboard and a whitepaper |

### The Premium Pencil & Tool Set

The pencil and pen tools are the crown jewels. They use [`perfect-freehand`](https://github.com/steveruizok/perfect-freehand) — the same algorithm powering tools like Excalidraw and Notability — combined with custom SVG path rendering to produce strokes that look hand-drawn and feel premium.

- **Pen** — clean, solid ink strokes with natural taper
- **Pencil** — textured, slightly rough edges for a real pencil feel
- **Marker** — bold, wide strokes with slight opacity for emphasis
- **Highlighter** — semi-transparent color wash, doesn't overpower text
- **Eraser** — smooth, variable-width eraser that feels satisfying to use

No blocky pixel brushes. No jagged edges. Every stroke is a smooth Bezier curve.

---

## ✨ Full Feature List

### 🎨 Drawing Tools
- **Premium pen, pencil, marker, highlighter** — pressure/speed-aware strokes via SVG
- **Eraser** — variable size, smooth erase
- **Select tool** — insert, paste, move, and resize images on any board
- **Laser pointer** — glowing red beam that fades, perfect for live pointing on screen-share
- **Spotlight** — dim the entire board and highlight one region at a time

### 📋 Board Management
- **Unlimited boards** — add, duplicate, rename, delete, switch from the slide strip at the bottom
- **Backgrounds** — white, black, gray, white grid, black grid
- **Colours & sizes** — 9 preset colours + custom colour picker, 4 brush sizes
- **Undo / redo / clear** + keyboard shortcuts

### 🎉 Engagement Kit
- **Random student picker** — animated spin to randomly select a student name
- **Reaction rain** — emoji shower with a Web Audio chime for celebrating moments
- **Activity timer** — countdown timer with a visual alert when time is up

### 💾 Save & Export
- **Auto-save** — your session saves automatically in the browser, no account needed
- **Export all boards** → **PDF** or **Word (.docx)**
- **Export current board** → **PNG**
- **Present mode** — one-click fullscreen, built for screen-sharing in Zoom/Meet

### ☁️ Cloud (Optional — Supabase)
- **Google sign-in** — mentor accounts via OAuth
- **Session library** — save and reload named sessions from the cloud
- **Read-only share link** — `/s/<id>` so students can view a snapshot of your board

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/adharshramu12/ARVA-Talks-Academy---Advaned-White-Board.git
cd ARVA-Talks-Academy---Advaned-White-Board

# 2. Install
npm install

# 3. Run
npm run dev
```

Open **http://localhost:3000** — works fully offline, no keys required.

---

## ☁️ Enable Cloud Sync (Optional)

The whiteboard runs 100% locally without any account. To unlock **Google login + cloud save + share links**:

1. Create a free project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the Supabase SQL Editor
3. Copy the env file and fill in your keys:

```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase URL + anon key
```

4. Add **Google** as an OAuth provider in Supabase → Auth → Providers
5. Add redirect URL: `http://localhost:3000/**` (and your production domain)

See [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) for full step-by-step instructions.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `P` | Pen |
| `B` | Pencil |
| `M` | Marker |
| `H` | Highlighter |
| `E` | Eraser |
| `N` | New board |
| `Ctrl/⌘ + Z` | Undo |
| `Ctrl/⌘ + Shift + Z` | Redo |
| `Ctrl + Y` | Redo |

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript + React 19 |
| Styling | Tailwind CSS |
| State | Zustand |
| Drawing | perfect-freehand (SVG paths) |
| Export | jsPDF, docx |
| Auth & DB | Supabase (optional) |
| Icons | lucide-react |

---

## 🗺 Roadmap

- [x] **Stage 1** — Whiteboard core (pens, boards, export, present)
- [x] **Stage 1.2** — Premium tools (laser, spotlight, images, engagement kit)
- [x] **Stage 1.5** — Mentor accounts + cloud + share links *(add your Supabase keys)*
- [ ] **Stage 2** — Present PPTs (upload slides & write over them)
- [ ] **Stage 3** — Live polls (students join by code)
- [ ] **Stage 4** — Real reaction sounds (claps, drums, cheers)

---

## 🤝 Contributing

Contributions are very welcome! Whether it's a bug fix, new tool, or performance improvement:

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes
4. Open a Pull Request

For big changes, please open an issue first so we can align on direction.

---

## 👤 About the Founder

**Adharsh Kumar Bachu**
Founder, [Arva Talks Academy](https://github.com/adharshramu12)

Adharsh built this whiteboard out of a real teaching problem — the frustration of laggy, clunky online boards breaking the flow of live classes. As a mentor and educator at Arva Talks Academy, he believes great tools should be free, fast, and beautiful. This project is his contribution to every teacher who has ever apologized to their students because the whiteboard was slow.

---

## 📄 License

[MIT](./LICENSE) — free to use, host, modify, and distribute.

---

## 🦅 Logo

Drop your logo at `public/logo.png` (see [`public/logo-README.txt`](./public/logo-README.txt)). A fallback wordmark is shown if no logo is present.

---

*Built with passion at Arva Talks Academy — for every educator who just wants the board to work.*

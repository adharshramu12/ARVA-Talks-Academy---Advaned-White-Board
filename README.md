# ARVA Talks Academy — Advanced White Board

> A free, open-source premium teaching whiteboard for online educators. Screen-share it in Zoom or Google Meet — clean unlimited boards, laser pointer, student engagement tools, cloud sync, and export. No subscription required.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

---

## ✨ Features

### Drawing Tools
- **Premium pens** — pen, pencil, marker, highlighter with smooth pressure-aware strokes (SVG via `perfect-freehand`)
- **Eraser** — clean erase with variable size
- **Select tool** — insert, paste, move, and resize images on any board
- **Laser pointer** — red beam that fades, for live screen-share pointing
- **Spotlight** — dim the board and highlight any area

### Board Management
- **Unlimited boards** — add, duplicate, rename, delete, switch from the slide strip
- **Backgrounds** — white, black, gray, white grid, black grid
- **Colours & sizes** — 9 preset colours + custom colour picker, 4 brush sizes
- **Undo / redo / clear** + keyboard shortcuts

### Engagement Kit
- **Random student picker** — spin animation to pick a name
- **Reaction rain** — emoji shower with Web Audio chime
- **Activity timer** — countdown with visual alert

### Save & Export
- **Auto-save** — session saved automatically in the browser (no login needed)
- **Export all boards** → **PDF** or **Word (.docx)**
- **Export current board** → **PNG**
- **Present mode** — one-click fullscreen for screen-sharing

### Cloud (Optional — requires Supabase)
- **Google sign-in** — mentor accounts via Supabase OAuth
- **Session library** — save and reload named sessions in the cloud
- **Read-only share link** — `/s/<id>` so students can view a shared board

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

Open **http://localhost:3000** — the app works fully offline without any keys.

---

## ☁️ Enable Cloud Sync (Optional)

The whiteboard works 100% locally without any account. To unlock **Google login + cloud save + share links**:

1. Create a free project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the Supabase SQL Editor
3. Copy the env file and fill in your keys:

```bash
cp .env.local.example .env.local
# Then edit .env.local with your Supabase URL and anon key
```

4. Add **Google** as an OAuth provider in Supabase → Auth → Providers
5. Add redirect URL: `http://localhost:3000/**` (and your production URL)

See [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) for detailed step-by-step instructions.

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
| Drawing | perfect-freehand (SVG) |
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

Contributions are welcome! Feel free to:

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes
4. Open a Pull Request

Please open an issue first for big changes so we can discuss.

---

## 📄 License

[MIT](./LICENSE) — free to use, modify, and distribute.

---

## 🦅 Logo

Drop your logo at `public/logo.png` (see [`public/logo-README.txt`](./public/logo-README.txt)). A fallback wordmark is shown if no logo is present.

---

Made with ❤️ for online educators everywhere.

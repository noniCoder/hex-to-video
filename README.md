# 🎬 Hex / Base64 → Video Viewer

A professional browser-based tool to decode **hex** or **base64** encoded video data and play it instantly — with zero backend, zero dependencies on external servers.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat&logo=tailwindcss)

---

## ✨ Features

- **Auto-detect** input format — hex or base64, it figures it out
- **Web Worker decoding** — heavy decoding runs off the main thread, UI never freezes
- **Zero-copy buffer transfer** — transferable `ArrayBuffer` between worker and main thread for maximum performance
- **In-browser video playback** — instant preview with full player controls
- **Download** the decoded video file directly
- **Drag & drop** or load `.txt` / `.hex` / `.b64` files
- **Multiple formats** — MP4, WebM, OGG, MOV
- Fully **client-side** — your data never leaves the browser

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript 5 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Decoding | Web Workers + Native Browser APIs |
| Video | `Blob` + `URL.createObjectURL` |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/noniCoder/hex-to-video.git
cd hex-video-viewer
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

The `dist/` folder is fully static — deploy it anywhere (Vercel, Netlify, GitHub Pages, etc.).

---

## 📁 Project Structure

```
src/
├── workers/
│   └── decoder.worker.ts     # Hex/Base64 → Uint8Array, runs off main thread
├── hooks/
│   └── useVideoDecoder.ts    # Worker lifecycle, blob URL management
├── components/
│   ├── InputPanel.tsx         # Textarea, format toggle, MIME select
│   └── VideoPlayer.tsx        # Video element + download button
├── lib/
│   └── detect.ts              # Auto-detect hex vs base64
├── types.ts                   # Shared TypeScript interfaces
└── App.tsx                    # Root layout and state wiring
```

---

## 🧠 How It Works

```
User Input (hex / base64 string)
        │
        ▼
  Web Worker Thread
  ┌─────────────────────────────┐
  │  1. Strip whitespace/prefix │
  │  2. Validate input          │
  │  3. Decode → Uint8Array     │
  │  4. Transfer ArrayBuffer    │
  └─────────────────────────────┘
        │  (zero-copy transfer)
        ▼
  Main Thread
  ┌─────────────────────────────┐
  │  5. new Blob([buffer])      │
  │  6. URL.createObjectURL()   │
  │  7. <video src={url} />     │
  └─────────────────────────────┘
```

The `ArrayBuffer` is **transferred** (not copied) from the worker to the main thread — this means even very large video files decode without doubling memory usage.

---

## 📖 Usage

### Hex input

Paste raw hex — spaces, dashes, `0x` prefixes are all stripped automatically:

```
1a 2b 3c 4d ...
0x1a0x2b0x3c ...
1a-2b-3c-4d ...
```

### Base64 input

Paste standard base64 — whitespace and line breaks are stripped:

```
AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQ==...
```

### Keyboard shortcut

`Ctrl + Enter` inside the textarea to decode without clicking the button.

---

## ⚠️ Browser Compatibility

Playback depends on the browser's built-in codec support:

| Format | Chrome | Firefox | Safari | Edge |
|---|---|---|---|---|
| MP4 (H.264) | ✅ | ✅ | ✅ | ✅ |
| WebM (VP8/VP9) | ✅ | ✅ | ⚠️ | ✅ |
| OGG (Theora) | ✅ | ✅ | ❌ | ✅ |
| MOV | ⚠️ | ❌ | ✅ | ⚠️ |

If a video doesn't play, try switching the format dropdown to match your actual video codec.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 Created By

© [noniCoder](https://github.com/noniCoder)
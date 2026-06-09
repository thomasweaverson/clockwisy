# 🕒 ClockWisy

This is a simple training project for my portfolio

The project was born from a joke that Gen Z can't tell time using an analog clock.
Well, I had to figure out how it works myself. Along the way, I got some practice with React design.

---

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white&style=flat-square)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

## 🌟 Features

- **Interactive Time-Dragging:** Grab and spin the clock hands directly using a mouse or touch screen. Implemented with Pointer Events that prevent cursor tracking losses.
- **Bidirectional binding:** You can change the time by turning the arrows, or you can set it in the input field
- **Dynamic theme switching:** Implemented theme provider via React context

## 🛠️ Tech Stack

- **Core:** React (Functional Components + Custom Hooks)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Bundler:** Vite
- **Wow:** Web Audio API

---

## 🚀 Getting Started

Follow these steps to get a local copy of the project up and running.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### Installation

1. Clone the repository:
```bash
git clone https://github.com/thomasweaverson/clockwisy.git
```

Navigate into the project directory:

```bash
cd clockwisy
```

Install dependencies:
```bash
npm install
```

Development Server
Run the local dev server with hot module replacement (HMR):

```bash
npm run dev
```

Open http://localhost:5173 in your browser to view the application.

Production Build
Compile and optimize the application for production:

```bash
npm run build
```

The production-ready assets will be generated in the dist/ directory, ready to be deployed to Vercel, Netlify, or GitHub Pages.

```text
src/
├── components/          # Reusable UI Atoms & Structural Layout blocks
│   ├── analog-clock.tsx # SVG Core, drag handles & pointer tracking
│   ├── time-input.tsx   # Managed key-entry validation & continuous scrolling
│   └── ...
├── hooks/               # Custom hooks (useClockSync, useClockDrag, etc.)
├── theme/               # Theme context and CSS-variable dictionary mapping
├── utils/               # Audio Engine singleton and strict Math helpers
├── constants/           # Core constants (Clock variants, style presets)
├── App.tsx              # Main entry layout assembler
└── main.tsx             # DOM Root mounter
```

🤝 Contributing - welcome


📄 License
Distributed under the MIT License. See LICENSE for more information.

👨‍💻 Author
Created by @thomasweaverson

Project Link: [clockwisy.vercel.app](https://clockwisy.vercel.app/)

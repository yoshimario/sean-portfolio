# Developer Guide

This document contains the technical details for running, building, and deploying the portfolio.

## 🚀 Getting Started

### 1) Prerequisites
- Node.js 18+ recommended
- npm, pnpm, or yarn installed

### 2) Install
```bash
npm install
```

### 3) Run dev server
```bash
npm run dev
```

### 4) Build for production
```bash
npm run build
```

### 5) Preview local production build
```bash
npm run preview
```

---

## 🧱 Tech Stack
- **React 19**
- **Vite 7**
- **Tailwind CSS 3**
- **Framer Motion 12**
- **React Router 7**
- **Lucide React Icons**
- **Custom SoundProvider** for ambient audio

---

## 📂 Project Structure
- `App.jsx` — routing and layout
- `IntroNordicForest.jsx` — landing animation & gesture-based audio unlock
- `AuroraBackgroundVivid.jsx` — animated aurora scene
- `SoundProvider.jsx` — global ambient sound
- `Projects.jsx` — portfolio projects
- `Photography.jsx` — photo gallery with lightbox
- `Writing.jsx` — written works
- `Education.jsx` — educational background
- `Contact.jsx` — contact form UI

---

## 🎨 Styling
- Tailwind directives in `index.css`
- Ensure `tailwind.config.js` includes:  
  ```js
  content: ["./src/**/*.{js,jsx,ts,tsx}"]
  ```

---

## 🔊 Audio
- Ambient audio file located in `/public/audio/`
- Controlled globally with fade-in/out transitions

---

## 🚢 Deployment
- **Vercel**: framework = Vite, output dir = `dist`
- **Netlify**: publish = `dist`
- **GitHub Pages**: set `"base"` in `vite.config.js`

---

## 🐛 Troubleshooting
- Styles not applying → check Tailwind config
- Audio not playing → user gesture may be required
- White page → check route paths in `App.jsx`

// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Visual background
import AuroraBackgroundVivid from "./components/AuroraBackgroundVivid";
// One-time intro overlay
import IntroNordicForest from "./components/IntroNordicForest";

// Layout
import Header from "./components/Header";

// Pages
import Home from "./pages/Home.jsx";
import Projects from "./pages/Projects.jsx";
import Photography from "./pages/Photography.jsx";
import Experience from "./pages/Experience.jsx";
import Education from "./pages/Education.jsx";
import Writing from "./pages/Writing.jsx";
import Contact from "./pages/Contact.jsx";

// Global styles
import "./index.css";
import "./App.css";

const cx = (...c) => c.filter(Boolean).join(" ");

// ---- Toggle this ON the first time to make sure the intro shows ----
const INTRO_FORCE = false; // set true to force the intro to appear
const INTRO_KEY = "intro:nordic:v4"; // change key to re-show at least once

// Simple on-screen error catcher so "white screen" shows the actual error
function ErrorBoundary({ children }) {
  const [err, setErr] = React.useState(null);
  React.useEffect(() => {
    const onErr = (e) => setErr(e.error || e.message || String(e));
    const onRej = (e) => setErr(e.reason || e.message || String(e));
    window.addEventListener("error", onErr);
    window.addEventListener("unhandledrejection", onRej);
    return () => {
      window.removeEventListener("error", onErr);
      window.removeEventListener("unhandledrejection", onRej);
    };
  }, []);
  if (err) {
    return (
      <div style={{ padding: 20 }}>
        <h1>💥 Runtime error</h1>
        <pre style={{ whiteSpace: "pre-wrap" }}>{String(err.stack || err)}</pre>
      </div>
    );
  }
  return children;
}

export default function App() {
  // Respect system preference; default to dark if unknown
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [dark, setDark] = React.useState(() => {
    try {
      const saved = localStorage.getItem("theme:dark");
      if (saved === "1") return true;
      if (saved === "0") return false;
    } catch {}
    return prefersDark ?? true;
  });

  // Tailwind "dark:" classes toggle + persist
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme:dark", dark ? "1" : "0");
    } catch {}
  }, [dark]);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        {/* ---------- One-time Nordic intro overlay (render FIRST) ---------- */}
        <IntroNordicForest
          name="Sean Kipinä"
          theme={dark ? "dark" : "light"}
          ttlHours={24}
          allowSound={false}
          force={true} // while testing
          storageKey="intro:nordic:v4"
          durationMs={6000} // <-- 6 seconds
        />

        {/* ---------- Global animated background (behind all content) ---------- */}
        <AuroraBackgroundVivid
          theme={dark ? "dark" : "light"}
          showInLight
          lightSky="none"
          starsInLight={false}
          /* DARK: softer & more readable */
          intensity={0.2}
          maxOpacity={0.22}
          bloom={0.95}
          saturation={1.15}
          /* Make a big “safe” lane for text */
          safeBandTop={0.22}
          safeBandBottom={0.85}
          safeBandReduce={0.78}
          /* Stars a touch quieter */
          stars
          starDensity={0.32}
          starSize={0.7}
          /* LIGHT mode tuning */
          lightIntensity={0.42}
          lightMaxOpacity={0.34}
          lightSaturation={1.25}
          lightBloom={1.25}
          /* 3 ribbons, curved, flowy */
          ribbonCount={3}
          speed={0.28}
          curveAmp={0.24}
          curveFreq={1.25}
          weaveAmp={0.12}
          noiseWarp={0.12}
          /* more puff overlap → smoother ribbons */
          puffRadius={140}
          puffStepPx={52}
        />
        {dark && <div className="vignette-soft" />}

        {/* ---------- App content (transparent so background shows) ---------- */}
        <div
          className={cx(
            "relative z-10 min-h-svh flex flex-col",
            dark ? "text-white" : "text-neutral-900"
          )}
        >
          <Header dark={dark} setDark={setDark} />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/photography" element={<Photography />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/education" element={<Education />} />
              <Route path="/writing" element={<Writing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="border-t border-black/10 dark:border-white/10">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 text-sm opacity-80">
              © {new Date().getFullYear()} Sean Kipinä — Built with React &
              Tailwind
            </div>
          </footer>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

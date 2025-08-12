// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuroraBackgroundVivid from "./components/AuroraBackgroundVivid";

import Header from "./components/Header";

import Home from "./pages/Home.jsx";
import Projects from "./pages/Projects.jsx";
import Photography from "./pages/Photography.jsx";
import Experience from "./pages/Experience.jsx";
import Education from "./pages/Education.jsx";
import Writing from "./pages/Writing.jsx";
import Contact from "./pages/Contact.jsx";

import "./index.css";
import "./App.css";

const cx = (...c) => c.filter(Boolean).join(" ");

export default function App() {
  // Respect system preference; default to dark if unknown
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [dark, setDark] = React.useState(prefersDark ?? true);

  // Tailwind "dark:" classes toggle
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <BrowserRouter>
      {/* Global animated background (fixed behind content, above body) */}
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
        safeBandReduce={0.78} // 78% dimming inside the band
        /* Stars a touch quieter */
        starDensity={0.32}
        starSize={0.7}
        /* Keep your light-mode settings as you like */
        lightIntensity={0.42}
        lightMaxOpacity={0.34}
        lightSaturation={1.25}
        lightBloom={1.25}
        ribbonCount={3}
        /* more motion */
        speed={0.14} // was ~0.085
        curveAmp={0.24} // deeper swoop
        curveFreq={1.25} // a touch more oscillation
        weaveAmp={0.12} // stronger ribbon weave
        noiseWarp={0.12} // extra wispy wobble
        /* more puff overlap → smoother ribbons */
        puffRadius={140}
        puffStepPx={52}
      />
      {/* App content (transparent so background shows) */}
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
    </BrowserRouter>
  );
}

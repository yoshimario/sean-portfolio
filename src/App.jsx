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
        zIndex={0}
        theme={dark ? "dark" : "light"}
        showInLight // ✅ show aurora in light
        lightSky="none" // transparent; body shows #eaf4ff
        /* Stars only in dark */
        stars
        starsInLight={false}
        /* Light – very subtle, soft blur */
        lightIntensity={0.1}
        lightMaxOpacity={0.08}
        lightBloom={1.25}
        lightSaturation={0.92}
        lightRibbonSeparation={0.32} // more gap in light
        lightVeilStrength={0.12}
        /* Dark – elegant and softer than now */
        intensity={0.22}
        maxOpacity={0.16}
        bloom={1.25}
        saturation={1.0}
        ribbonSeparation={0.2} // closer so they flow into each other
        veilStrength={0.3}
        /* shared motion + shapes */
        ribbonCount={2} // 2 flowing ribbons looks best
        ribbonWidth={26}
        speed={0.085}
        puffRadius={118}
        puffStepPx={68}
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

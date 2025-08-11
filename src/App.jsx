// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Background layer (smoke + shimmer aurora)
import AuroraBackgroundVivid from "./components/AuroraBackgroundVivid";

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

export default function App() {
  const [dark, setDark] = React.useState(true);

  // Reflect dark state on <html> for Tailwind's "dark:" classes
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <BrowserRouter>
      {/* ---- Global animated background, fixed behind everything ---- */}
      <AuroraBackgroundVivid
        theme={dark ? "dark" : "light"}
        intensity={dark ? 0.85 : 0.75}
        speed={0.18}
        saturation={dark ? 1.0 : 0.9}
        contrast={dark ? 1.05 : 1.02}
        scaleY={1.2}
        stars={true}
        starDensity={dark ? 0.8 : 0.4}
        wispCount={dark ? 4 : 3}
        wispOpacity={dark ? 0.18 : 0.25}
        shimmerOpacity={dark ? 0.08 : 0.12}
      />

      {/* ---- App content ---- */}
      <div
        className={cx(
          "relative z-10 min-h-svh flex flex-col",
          dark ? "text-white" : "text-neutral-900"
        )}
      >
        {/* Header receives theme controls */}
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

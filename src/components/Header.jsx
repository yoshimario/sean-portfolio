// src/components/Header.jsx
import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Sun, Moon, ExternalLink } from "lucide-react";

const cx = (...c) => c.filter(Boolean).join(" ");
const container = "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8";

export default function Header({ dark = true, setDark = () => {} }) {
  const links = [
    { to: "/", label: "Home", exact: true },
    { to: "/projects", label: "Projects" },
    { to: "/photography", label: "Photography" },
    { to: "/experience", label: "Experience" },
    { to: "/education", label: "Education" },
    { to: "/writing", label: "Writing" },
  ];

  const baseLink =
    "px-3 py-2 rounded-xl text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400";

  return (
    <header
      className={cx(
        "sticky top-0 z-50 glass-strong border-b backdrop-blur-xl relative",
        dark ? "border-white/15 text-white" : "border-black/10 text-neutral-900"
      )}
      style={{ height: 64 }}
    >
      {/* subtle top gradient highlight for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent dark:from-white/[0.06]" />

      <div
        className={cx(container, "h-full flex items-center justify-between")}
      >
        {/* Brand */}
        <Link
          to="/"
          className={cx(
            "font-semibold tracking-tight leading-none",
            dark ? "text-white" : "text-neutral-900"
          )}
        >
          <span className="text-base md:text-lg">Sean</span>{" "}
          <span
            className={cx(
              "text-base md:text-lg",
              dark ? "text-indigo-300" : "text-indigo-600"
            )}
          >
            Kipinä
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.exact}
              className={({ isActive }) =>
                cx(
                  baseLink,
                  dark
                    ? // Stronger dark hover + glow
                      "text-white/75 hover:text-white hover:bg-white/16 hover:shadow-[0_0_8px_rgba(255,255,255,0.25)]"
                    : // Light hover stays subtle
                      "text-neutral-700 hover:text-neutral-900 hover:bg-black/5",
                  // Active comes last so it wins
                  isActive &&
                    (dark
                      ? "bg-white/24 text-white shadow-[0_0_8px_rgba(255,255,255,0.25)]"
                      : "bg-black/[0.06] text-neutral-900")
                )
              }
            >
              {l.label}
            </NavLink>
          ))}

          {/* Contact — stronger in both themes */}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              cx(
                "ml-1 px-3 py-2 rounded-2xl text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400 border",
                dark
                  ? // Dark: brighter fill + glow on hover
                    "text-white border-white/20 bg-transparent hover:bg-white/24 hover:border-white/30 hover:shadow-[0_0_8px_rgba(255,255,255,0.25)]"
                  : // Light: solid dark pill on hover
                    "text-neutral-900 border-neutral-200 bg-transparent hover:bg-neutral-900 hover:text-white",
                // Active last
                isActive &&
                  (dark
                    ? "bg-white/28 text-white border-white/30 shadow-[0_0_6px_rgba(255,255,255,0.25)]"
                    : "bg-neutral-900 text-white border-neutral-900")
              )
            }
          >
            Contact
          </NavLink>

          {/* Resume */}
          <a
            href="/Sean-KipinaCV.pdf"
            className={cx(
              "ml-2 inline-flex items-center gap-2 rounded-2xl text-sm font-medium px-3 py-2 btn-enhanced border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400",
              dark
                ? "border-white/25 bg-white/10 hover:bg-white/20 text-white"
                : "border-neutral-200 bg-white/70 hover:bg-white/80 text-neutral-900"
            )}
          >
            Resume <ExternalLink className="w-4 h-4" />
          </a>

          {/* Theme toggle */}
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
            className={cx(
              "ml-1 h-10 w-10 rounded-2xl inline-flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400",
              dark ? "hover:bg-white/10" : "hover:bg-black/5"
            )}
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile: theme toggle only */}
        <div className="md:hidden">
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
            className={cx(
              "h-10 w-10 rounded-2xl inline-flex items-center justify-center transition-colors",
              dark
                ? "hover:bg-white/10 text-white"
                : "hover:bg-black/5 text-neutral-800"
            )}
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* soft bottom edge glow / divider */}
      <div className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-black/15 to-transparent dark:via-white/20" />
    </header>
  );
}

// src/components/IntroNordicForest.jsx
// Minimal‑dependency Nordic forest intro (no framer-motion):
// - Gradient sky, parallax pines, drifting fog, fireflies
// - Cinematic name reveal (CinematicName is defined below)
// - Skip button
// - One-time with localStorage (ttlHours), supports force + storageKey

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";

function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefers(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return prefers;
}

function makeFireflies(n) {
  return Array.from({ length: n }, () => ({
    id:
      (globalThis.crypto && crypto.randomUUID?.()) ||
      Math.random().toString(36).slice(2),
    x: Math.random(),
    y: Math.random() * 0.7 + 0.15,
    d: 4 + Math.random() * 6, // seconds
    r: 1 + Math.random() * 1.8,
  }));
}

// --------- CinematicName (fixes "not defined") ----------
function CinematicName({
  text = "Sean Kipinä",
  light = false,
  reduced = false,
}) {
  return (
    <>
      <style>{`
        @keyframes nameTrack {
          0% { letter-spacing: .6em; filter: blur(6px); opacity: 0; transform: translateY(8px) }
          60% { letter-spacing: .05em; filter: blur(0); opacity: 1; transform: translateY(0) }
          100% { letter-spacing: .15em }
        }
      `}</style>
      <h1
        style={{
          fontSize: "clamp(32px, 7vw, 92px)",
          fontWeight: 900,
          letterSpacing: ".2em",
          color: light ? "#0b1a2a" : "#ffffff",
          textShadow: light
            ? "0 6px 22px rgba(60,120,200,.25)"
            : "0 8px 30px rgba(90,180,255,.35)",
          animation: `nameTrack ${
            reduced ? 0.8 : 2.1
          }s cubic-bezier(.16,1,.3,1) forwards`,
          margin: 0,
        }}
      >
        {text}
      </h1>
    </>
  );
}

// -------------------------------------------------------

export default function IntroNordicForest({
  name = "Sean Kipinä",
  theme = "dark", // "dark" | "light"
  ttlHours = 24, // localStorage TTL in hours
  onFinish, // callback when intro ends or is skipped
  allowSound = false, // (no audio wired by default)
  force = false, // show every time (for testing)
  storageKey = "intro:nordic:v4",
  durationMs = 5200, // auto-finish time
}) {
  const reduced = usePrefersReducedMotion();

  // Initial show state — respects force + storage
  const [show, setShow] = useState(() => {
    if (force) return true;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return true;
      const { t, ttl } = JSON.parse(raw);
      return Date.now() - t > ttl; // expired => show again
    } catch {
      return true;
    }
  });

  // Finish → write storage key + dismiss
  const finish = useCallback(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ t: Date.now(), ttl: ttlHours * 3600 * 1000 })
      );
    } catch {}
    setShow(false);
    onFinish?.();
  }, [onFinish, storageKey, ttlHours]);

  // Auto-finish timer
  useEffect(() => {
    if (!show) return;
    const id = setTimeout(finish, reduced ? 5000 : durationMs);
    return () => clearTimeout(id);
  }, [show, reduced, durationMs, finish]);

  // Optional audio wiring (kept disabled by default)
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(true);
  useEffect(() => {
    if (!show || !allowSound) return;
    // Example if you add a file later:
    // audioRef.current = new Audio("/audio/nordic-forest.mp3");
    // audioRef.current.loop = true;
    // audioRef.current.volume = 0.35;
    // if (!muted) audioRef.current.play().catch(() => {});
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [show, allowSound]);
  useEffect(() => {
    if (!audioRef.current) return;
    if (muted) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
  }, [muted]);

  // Parallax config + fireflies
  const layers = useMemo(
    () => [
      { z: 0, swaySec: 5.0, opacity: 1.0 },
      { z: 1, swaySec: 6.0, opacity: 0.85 },
      { z: 2, swaySec: 7.0, opacity: 0.7 },
    ],
    []
  );
  const fireflies = useMemo(() => makeFireflies(42), []);

  if (!show) return null;

  const isLight = theme === "light";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] pointer-events-auto"
      style={{
        // twilight→midnight sky (or pastel sky for light)
        background: isLight
          ? "linear-gradient(180deg, #eaf4ff 0%, #dfefff 100%)"
          : "linear-gradient(180deg, #0c1426 0%, #0a1834 60%, #0a0f22 100%)",
      }}
    >
      {/* Local CSS (scoped-ish via unique class names) */}
      <style>{`
        @keyframes fogSlideA { 0%{transform:translateX(-8%)} 50%{transform:translateX(8%)} 100%{transform:translateX(-8%)} }
        @keyframes fogSlideB { 0%{transform:translateX(10%)} 50%{transform:translateX(-6%)} 100%{transform:translateX(10%)} }
        @keyframes pulse { 0%,100%{opacity:.1} 50%{opacity:.22} }
        @keyframes floatY { 0%{transform:translateY(0)} 50%{transform:translateY(-6px)} 100%{transform:translateY(0)} }
        .intro-wrap { position:relative; width:100%; height:100%; overflow:hidden; color:#fff; }
        .fogA, .fogB { position:absolute; inset:-5%; filter:blur(${
          reduced ? 16 : 28
        }px); pointer-events:none; }
        .fogA { animation: fogSlideA ${
          reduced ? 6 : 16
        }s ease-in-out infinite; opacity:.16; }
        .fogB { animation: fogSlideB ${
          reduced ? 7 : 18
        }s ease-in-out infinite; opacity:.14; }
        .fogA::before, .fogB::before {
          content:""; position:absolute; inset:0;
          background:
            radial-gradient(40% 30% at 20% 40%, rgba(185,211,255,0.28), transparent 60%),
            radial-gradient(42% 32% at 80% 60%, rgba(159,229,207,0.23), transparent 60%);
        }
        .veil {
          position:absolute; inset:0; filter:blur(8px);
          mix-blend-mode:${isLight ? "screen" : "lighter"};
          opacity:${isLight ? 0.35 : 0.45};
          background:
            radial-gradient(60% 40% at 40% 30%, rgba(120,220,255,0.35), transparent 60%),
            radial-gradient(60% 40% at 70% 60%, rgba(190,140,255,0.30), transparent 60%);
          animation: pulse ${reduced ? 5 : 12}s ease-in-out infinite;
        }
        .nameBox {
          position:absolute; inset:0; display:grid; place-items:center; text-align:center;
          padding:24px; user-select:none; pointer-events:none;
        }
        .controls {
          position:absolute; inset-inline:0; bottom:18px; display:flex; gap:8px;
          align-items:center; justify-content:center; pointer-events:auto;
        }
        .btn {
          padding:8px 12px; border-radius:999px; font-size:12px; letter-spacing:.08em; text-transform:uppercase;
          border:1px solid rgba(255,255,255,.22); background:rgba(255,255,255,.12); color:white; cursor:pointer;
        }
      `}</style>

      <div className="intro-wrap">
        {/* Soft aurora veil */}
        <div className="veil" />

        {/* Drifting fog (disabled if reduced‑motion) */}
        {!reduced && (
          <>
            <div className="fogA" />
            <div className="fogB" />
          </>
        )}

        {/* Parallax pines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {layers.map((L) => (
            <PineLayer
              key={L.z}
              depth={L.z}
              swaySec={L.swaySec}
              opacity={L.opacity}
            />
          ))}
        </div>

        {/* Fireflies */}
        {!reduced && <Fireflies points={fireflies} />}

        {/* Name (the component that was missing) */}
        <div className="nameBox">
          <CinematicName text={name} light={isLight} reduced={reduced} />
        </div>

        {/* Controls */}
        <div className="controls">
          <button type="button" className="btn" onClick={finish}>
            Skip
          </button>
          {allowSound && (
            <button
              type="button"
              className="btn"
              onClick={() => setMuted((m) => !m)}
              aria-pressed={!muted}
            >
              {muted ? "Unmute" : "Mute"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- pieces ---------- */

function Fireflies({ points }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {points.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x * 100}%`,
            top: `${p.y * 100}%`,
            width: p.r * 2,
            height: p.r * 2,
            borderRadius: "999px",
            background: "rgba(255,255,210,0.95)",
            boxShadow:
              "0 0 12px rgba(255,255,210,0.8), 0 0 32px rgba(150,220,255,0.3)",
            animation: `floatY ${p.d}s ease-in-out infinite`,
            opacity: 0.9,
          }}
        />
      ))}
    </div>
  );
}

function PineLayer({ depth = 0, swaySec = 6, opacity = 0.8 }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    let raf = 0;
    const base = performance.now();
    const loop = () => {
      const t = (performance.now() - base) / 1000;
      const x = Math.sin(t / swaySec) * 20 * (1 + depth * 0.2);
      ref.current.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [depth, swaySec]);

  const fill = `rgba(10,20,30,${0.9 - depth * 0.2})`;

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        insetInline: 0,
        bottom: 0,
        height: "55vh",
        opacity,
      }}
    >
      <svg
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <g>
          {Array.from({ length: 26 }).map((_, i) => (
            <Pine
              key={`pine-${depth}-${i}`}
              x={i * 48}
              baseY={150 + (i % 2) * 4}
              scale={0.9 + (i % 5) * 0.06}
              fill={fill}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

function Pine({ x = 0, baseY = 160, scale = 1, fill = "#10222e" }) {
  const trunk = 6 * scale;
  return (
    <g transform={`translate(${x},0) scale(${scale})`}>
      <polygon
        points={`${x},${baseY} ${x + 24},${baseY} ${x + 12},${baseY - 28}`}
        fill={fill}
      />
      <polygon
        points={`${x - 4},${baseY - 18} ${x + 28},${baseY - 18} ${x + 12},${
          baseY - 46
        }`}
        fill={fill}
      />
      <polygon
        points={`${x - 8},${baseY - 36} ${x + 32},${baseY - 36} ${x + 12},${
          baseY - 64
        }`}
        fill={fill}
      />
      <rect x={x + 11} y={baseY} width={trunk / 3} height={10} fill={fill} />
    </g>
  );
}

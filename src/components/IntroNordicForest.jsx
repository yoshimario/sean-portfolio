// src/components/IntroNordicForest.jsx
// Nordic forest intro — dramatic version with sound-on-by-default:
// - Veil / comets / fog / fireflies / snow / parallax pines
// - Ambient loop + one-shot whoosh (tries autoplay; falls back to first gesture)
// - One-time via localStorage (ttlHours) + force + storageKey
// - Keeps ambient music playing after intro finishes

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import PropTypes from "prop-types";

/* ======================= utils ======================= */
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

function uid() {
  // stable-ish unique id
  return (
    (globalThis.crypto && crypto.randomUUID?.()) ||
    Math.random().toString(36).slice(2)
  );
}

function makeFireflies(n) {
  return Array.from({ length: n }, () => ({
    id: uid(),
    x: Math.random(),
    y: Math.random() * 0.7 + 0.15,
    d: 4 + Math.random() * 6, // seconds
    r: 1 + Math.random() * 1.8,
  }));
}

function makeSnow(n) {
  return Array.from({ length: n }, () => ({
    id: uid(),
    x: Math.random(),
    y: Math.random(),
    s: 0.5 + Math.random() * 1.2, // size
    d: 6 + Math.random() * 8, // fall duration seconds
    drift: (Math.random() - 0.5) * 0.4,
  }));
}

/* =================== CinematicName =================== */
function CinematicName({ text, light, reduced }) {
  const sparkKeys = useMemo(
    () => Array.from({ length: 16 }, () => ({ id: uid() })),
    []
  );

  return (
    <>
      <style>{`
        @keyframes nameTrack {
          0% { letter-spacing: .6em; filter: blur(6px); opacity: 0; transform: translateY(8px) }
          60% { letter-spacing: .05em; filter: blur(0); opacity: 1; transform: translateY(0) }
          100% { letter-spacing: .12em }
        }
        @keyframes sparksRise {
          0% { transform: translateY(0) scale(1); opacity: 0 }
          20% { opacity: .9 }
          100% { transform: translateY(-26px) scale(.8); opacity: 0 }
        }
      `}</style>
      <div
        style={{ position: "relative", display: "grid", placeItems: "center" }}
      >
        <h1
          style={{
            fontSize: "clamp(36px, 7.2vw, 100px)",
            fontWeight: 900,
            letterSpacing: ".2em",
            color: light ? "#0b1a2a" : "#ffffff",
            textShadow: light
              ? "0 10px 28px rgba(60,120,200,.28)"
              : "0 14px 42px rgba(90,180,255,.5)",
            animation: `nameTrack ${
              reduced ? 0.8 : 2.2
            }s cubic-bezier(.16,1,.3,1) forwards`,
            margin: 0,
          }}
        >
          {text}
        </h1>

        {!reduced && (
          <div
            style={{
              position: "relative",
              height: 22,
              marginTop: 10,
              width: "min(60ch, 80vw)",
            }}
          >
            {sparkKeys.map((item, i) => (
              <span
                key={item.id}
                style={{
                  position: "absolute",
                  left: `${(i / 15) * 100}%`,
                  top: "50%",
                  width: 2,
                  height: 2,
                  borderRadius: 999,
                  background: "rgba(180,220,255,0.95)",
                  boxShadow:
                    "0 0 10px rgba(150,220,255,0.9), 0 0 26px rgba(150,220,255,0.45)",
                  transform: "translate(-50%, -50%)",
                  animation: `sparksRise ${0.9 + (i % 3) * 0.2}s ease-out ${
                    i * 0.06
                  }s forwards`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
CinematicName.propTypes = {
  text: PropTypes.string.isRequired,
  light: PropTypes.bool,
  reduced: PropTypes.bool,
};
CinematicName.defaultProps = {
  light: false,
  reduced: false,
};

/* ================== Main component =================== */
export default function IntroNordicForest({
  name,
  theme,
  ttlHours,
  onFinish,
  allowSound,
  force,
  storageKey,
  durationMs,
  ambientSrc,
  whooshSrc,
  startVolume,
  ambientVolume,
  whooshVolume,
}) {
  const reduced = usePrefersReducedMotion();

  // Visibility state — respects force + storage
  const [show, setShow] = useState(() => {
    if (force) return true;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return true;
      const { t, ttl } = JSON.parse(raw);
      return Date.now() - t > ttl;
    } catch {
      return true;
    }
  });

  // Dismiss & persist
  const finish = useCallback(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ t: Date.now(), ttl: ttlHours * 3600 * 1000 })
      );
    } catch {
      // ignore storage errors
    }
    setShow(false);
    if (onFinish) onFinish();
  }, [onFinish, storageKey, ttlHours]);

  // Auto-finish timer (default 6000ms; you asked for ~6s)
  useEffect(() => {
    if (!show) return;
    const id = setTimeout(finish, reduced ? 2500 : durationMs);
    return () => clearTimeout(id);
  }, [show, reduced, durationMs, finish]);

  // --- Audio: start ON by default, try autoplay, keep looping after intro ---
  const ambientRef = useRef(null);
  const whooshRef = useRef(null);
  const [muted, setMuted] = useState(false); // default sound ON
  const [unlocked, setUnlocked] = useState(false); // becomes true on first gesture

  // Try to create & start audio immediately
  useEffect(() => {
    if (!allowSound) return;

    const amb = new Audio(ambientSrc);
    amb.loop = true;
    amb.volume = startVolume;

    const swoosh = new Audio(whooshSrc);
    swoosh.loop = false;
    swoosh.volume = 0;

    ambientRef.current = amb;
    whooshRef.current = swoosh;

    // Attempt autoplay
    amb
      .play()
      .then(() => {
        // fade up if not muted
        if (!muted) fadeTo(amb, ambientVolume, 1200);
        // schedule whoosh for dramatic accent
        if (!muted) {
          const id = setTimeout(() => {
            if (!whooshRef.current) return;
            whooshRef.current.currentTime = 0;
            whooshRef.current.volume = 0;
            whooshRef.current
              .play()
              .then(() => fadeTo(whooshRef.current, whooshVolume, 150))
              .catch(() => {});
          }, 900);
          return () => clearTimeout(id);
        }
        return undefined;
      })
      .catch(() => {
        // Autoplay blocked — wait for a gesture to unlock
        const unlock = () => {
          setUnlocked(true);
          amb.currentTime = 0;
          amb
            .play()
            .then(() => {
              if (!muted) fadeTo(amb, ambientVolume, 1200);
              // whoosh after unlock
              setTimeout(() => {
                if (!whooshRef.current || muted) return;
                whooshRef.current.currentTime = 0;
                whooshRef.current.volume = 0;
                whooshRef.current
                  .play()
                  .then(() => fadeTo(whooshRef.current, whooshVolume, 150))
                  .catch(() => {});
              }, 900);
            })
            .catch(() => {});
        };
        window.addEventListener("pointerdown", unlock, { once: true });
        window.addEventListener("keydown", unlock, { once: true });
        return () => {
          window.removeEventListener("pointerdown", unlock);
          window.removeEventListener("keydown", unlock);
        };
      });

    return () => {
      try {
        ambientRef.current?.pause();
        whooshRef.current?.pause();
      } catch {
        // ignore
      }
      ambientRef.current = null;
      whooshRef.current = null;
    };
  }, [
    allowSound,
    ambientSrc,
    whooshSrc,
    ambientVolume,
    whooshVolume,
    muted,
    startVolume,
  ]);

  // Keep ambient after intro ends
  useEffect(() => {
    if (!show && ambientRef.current) {
      if (!muted) {
        ambientRef.current.loop = true;
        ambientRef.current.play().catch(() => {});
      } else {
        fadeTo(ambientRef.current, 0, 400);
      }
    }
  }, [show, muted]);

  // Mute toggle handler (fades in/out)
  const toggleMute = useCallback(() => {
    const amb = ambientRef.current;
    const swoosh = whooshRef.current;
    setMuted((m) => {
      const next = !m;
      if (amb) {
        if (next) {
          // going muted
          fadeTo(amb, 0, 400);
          try {
            swoosh?.pause();
          } catch {
            // ignore
          }
        } else {
          // unmuting
          amb.play().catch(() => {});
          fadeTo(amb, ambientVolume, 800);
        }
      }
      return next;
    });
  }, [ambientVolume]);

  // simple volume fade helper
  const fadeTo = (audio, target, ms = 600) => {
    if (!audio) return;
    const start = audio.volume;
    const startTime = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - startTime) / ms);
      audio.volume = start + (target - start) * t;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Parallax + particles
  const layers = useMemo(
    () => [
      { z: 0, swaySec: 4.6, opacity: 1.0 },
      { z: 1, swaySec: 5.6, opacity: 0.85 },
      { z: 2, swaySec: 6.6, opacity: 0.7 },
    ],
    []
  );
  const fireflies = useMemo(() => makeFireflies(38), []);
  const snow = useMemo(() => makeSnow(40), []);

  if (!show) return null;
  const isLight = theme === "light";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] pointer-events-auto"
      style={{
        background: isLight
          ? "linear-gradient(180deg, #eaf4ff 0%, #dfefff 100%)"
          : "linear-gradient(180deg, #0b1426 0%, #0a1834 58%, #090f1e 100%)",
      }}
    >
      <style>{`
        @keyframes fogSlideA { 0%{transform:translateX(-10%)} 50%{transform:translateX(10%)} 100%{transform:translateX(-10%)} }
        @keyframes fogSlideB { 0%{transform:translateX(12%)} 50%{transform:translateX(-8%)} 100%{transform:translateX(12%)} }
        @keyframes pulse { 0%,100%{opacity:.12} 50%{opacity:.28} }
        @keyframes floatY { 0%{transform:translateY(0)} 50%{transform:translateY(-8px)} 100%{transform:translateY(0)} }
        @keyframes snowFall {
          0% { transform: translate3d(0,-8%,0); opacity: .0 }
          10% { opacity: .5 }
          90% { opacity: .5 }
          100% { transform: translate3d(var(--drift,0), 108%, 0); opacity: 0 }
        }
        @keyframes comet {
          0%   { transform: translate(-20vw, -10vh) rotate(12deg); opacity: 0 }
          10%  { opacity: .8 }
          60%  { opacity: .8 }
          100% { transform: translate(110vw, 40vh) rotate(12deg); opacity: 0 }
        }

        .intro-wrap { position:relative; width:100%; height:100%; overflow:hidden; }
        .vignette {
          position:absolute; inset:-2%;
          background: radial-gradient(120% 90% at 50% -10%, transparent 0%, rgba(0,0,0,${
            isLight ? 0.2 : 0.38
          }) 100%);
          pointer-events:none;
        }

        .veil {
          position:absolute; inset:0; filter: blur(10px);
          mix-blend-mode:${isLight ? "screen" : "lighter"};
          opacity:${isLight ? 0.42 : 0.55};
          background:
            radial-gradient(55% 38% at 35% 28%, rgba(120,220,255,0.42), transparent 60%),
            radial-gradient(60% 40% at 70% 58%, rgba(190,140,255,0.36), transparent 60%),
            radial-gradient(70% 50% at 50% 80%, rgba(255,120,170,0.20), transparent 70%);
          animation: pulse ${reduced ? 6 : 12}s ease-in-out infinite;
        }

        .fogA, .fogB { position:absolute; inset:-8%; pointer-events:none; }
        .fogA {
          filter: blur(${reduced ? 14 : 26}px);
          opacity:.18;
          animation: fogSlideA ${reduced ? 8 : 18}s ease-in-out infinite;
          background:
            radial-gradient(40% 30% at 20% 40%, rgba(185,211,255,0.30), transparent 60%),
            radial-gradient(42% 32% at 80% 60%, rgba(159,229,207,0.26), transparent 60%);
        }
        .fogB {
          filter: blur(${reduced ? 16 : 30}px);
          opacity:.16;
          animation: fogSlideB ${reduced ? 9 : 20}s ease-in-out infinite;
          background:
            radial-gradient(40% 30% at 70% 30%, rgba(160,230,255,0.22), transparent 60%),
            radial-gradient(42% 32% at 30% 70%, rgba(200,160,255,0.22), transparent 60%);
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
          border:1px solid rgba(255,255,255,.25); background:rgba(255,255,255,.14); color:white; cursor:pointer;
          backdrop-filter: blur(8px);
        }

        .comet {
          position:absolute; top:12vh; left:-20vw; width:28vw; height:2px; border-radius:2px;
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(200,235,255,.8) 35%, rgba(255,180,240,.6) 100%);
          filter: blur(1px);
          animation: comet ${reduced ? 3 : 5.5}s ease-out ${
        reduced ? 0.4 : 1.2
      }s 1 both;
          mix-blend-mode: ${isLight ? "screen" : "lighter"};
          opacity: .0;
        }
        .comet.two {
          top: 22vh;
          animation-delay: ${reduced ? 0.6 : 2.2}s;
        }
      `}</style>

      <div className="intro-wrap">
        <div className="veil" />

        {!reduced && (
          <>
            <div className="fogA" />
            <div className="fogB" />
          </>
        )}

        {!reduced && (
          <>
            <div className="comet" />
            <div className="comet two" />
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

        {/* Fireflies + Snow */}
        {!reduced && <Fireflies points={fireflies} />}
        {!reduced && <Snowfall flakes={snow} />}

        <div className="nameBox">
          <CinematicName text={name} light={isLight} reduced={reduced} />
        </div>

        <div className="controls">
          <button type="button" className="btn" onClick={finish}>
            Skip
          </button>
          {allowSound && (
            <button
              type="button"
              className="btn"
              onClick={toggleMute}
              aria-pressed={!muted}
              title={muted ? "Unmute" : "Mute"}
            >
              {muted ? "Unmute" : "Mute"}
            </button>
          )}
        </div>

        <div className="vignette" />
      </div>
    </div>
  );
}

IntroNordicForest.propTypes = {
  name: PropTypes.string,
  theme: PropTypes.oneOf(["dark", "light"]),
  ttlHours: PropTypes.number,
  onFinish: PropTypes.func,
  allowSound: PropTypes.bool,
  force: PropTypes.bool,
  storageKey: PropTypes.string,
  durationMs: PropTypes.number,
  ambientSrc: PropTypes.string,
  whooshSrc: PropTypes.string,
  startVolume: PropTypes.number,
  ambientVolume: PropTypes.number,
  whooshVolume: PropTypes.number,
};

IntroNordicForest.defaultProps = {
  name: "Sean Kipinä",
  theme: "dark",
  ttlHours: 24,
  onFinish: undefined,
  allowSound: true,
  force: false,
  storageKey: "intro:nordic:v5",
  durationMs: 6000,
  ambientSrc: "/audio/forest-ambience.mp3",
  whooshSrc: "/audio/aurora-whoosh.mp3",
  startVolume: 0.0,
  ambientVolume: 0.35,
  whooshVolume: 0.8,
};

/* ======================= pieces ======================= */

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
            borderRadius: 999,
            background: "rgba(255,255,210,0.95)",
            boxShadow:
              "0 0 12px rgba(255,255,210,0.8), 0 0 32px rgba(150,220,255,0.35)",
            animation: `floatY ${p.d}s ease-in-out infinite`,
            opacity: 0.95,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}
Fireflies.propTypes = {
  points: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      d: PropTypes.number.isRequired,
      r: PropTypes.number.isRequired,
    })
  ).isRequired,
};

function Snowfall({ flakes }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {flakes.map((f) => (
        <div
          key={f.id}
          style={{
            position: "absolute",
            left: `${f.x * 100}%`,
            top: `-8%`,
            width: f.s * 2,
            height: f.s * 2,
            borderRadius: 999,
            background: "rgba(255,255,255,0.9)",
            filter: "blur(0.5px)",
            opacity: 0.6,
            transform: "translate(-50%, 0)",
            animation: `snowFall ${f.d}s linear infinite`,
            "--drift": `${f.drift * 100}px`,
          }}
        />
      ))}
    </div>
  );
}
Snowfall.propTypes = {
  flakes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      s: PropTypes.number.isRequired,
      d: PropTypes.number.isRequired,
      drift: PropTypes.number.isRequired,
    })
  ).isRequired,
};

function PineLayer({ depth, swaySec, opacity }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    let raf = 0;
    const base = performance.now();
    const loop = () => {
      const t = (performance.now() - base) / 1000;
      const x = Math.sin(t / swaySec) * 20 * (1 + depth * 0.25);
      ref.current.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [depth, swaySec]);

  const fill = `rgba(10,20,30,${0.92 - depth * 0.22})`;

  const pines = useMemo(
    () => Array.from({ length: 28 }, () => ({ id: uid() })), // stable keys per mount
    []
  );

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        insetInline: 0,
        bottom: 0,
        height: "56vh",
        opacity,
      }}
    >
      <svg
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <g>
          {pines.map((item, i) => (
            <Pine
              key={item.id}
              x={i * 46}
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
PineLayer.propTypes = {
  depth: PropTypes.number.isRequired,
  swaySec: PropTypes.number.isRequired,
  opacity: PropTypes.number.isRequired,
};

function Pine({ x, baseY, scale, fill }) {
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
Pine.propTypes = {
  x: PropTypes.number.isRequired,
  baseY: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  fill: PropTypes.string.isRequired,
};

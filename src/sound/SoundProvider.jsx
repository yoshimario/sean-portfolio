// src/sound/SoundProvider.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const SoundCtx = createContext(null);
export const useSound = () => useContext(SoundCtx);

/**
 * SoundProvider
 * - Keeps one looping <audio> alive across routes
 * - Starts after the first user gesture (browser policy)
 * - Persists consent so it auto-resumes next visits
 */
export default function SoundProvider({
  src = "/audio/forest-ambience.mp3", // put your file in /public/audio/
  defaultVolume = 0.35,
  storageKey = "sound:consented",
  children,
}) {
  const audioRef = useRef(null);
  const [consented, setConsented] = useState(() => {
    try {
      return localStorage.getItem(storageKey) === "1";
    } catch {
      return false;
    }
  });
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);

  // Create audio once
  useEffect(() => {
    const el = new Audio(src);
    el.loop = true;
    el.preload = "auto";
    el.volume = 0;
    audioRef.current = el;
    return () => {
      try {
        el.pause();
      } catch {}
      audioRef.current = null;
    };
  }, [src]);

  // Save consent
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, consented ? "1" : "0");
    } catch {}
  }, [consented, storageKey]);

  // Smooth fade helper
  const fadeTo = (target, ms = 600) => {
    const el = audioRef.current;
    if (!el) return;
    const start = el.volume;
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / ms);
      el.volume = start + (target - start) * t;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const api = useMemo(
    () => ({
      consented,
      setConsented,
      isEnabled: enabled,
      currentVolume: volume,
      setVolume(v) {
        setVolume(v);
        const el = audioRef.current;
        if (el) el.volume = v;
      },
      async enable() {
        const el = audioRef.current;
        if (!el) return;
        try {
          if (el.paused) await el.play();
          setEnabled(true);
          fadeTo(volume, 800);
        } catch (e) {
          // Likely called without a user gesture — try again from a click handler.
          console.debug("[Sound] enable blocked:", e);
        }
      },
      async disable() {
        const el = audioRef.current;
        if (!el) return;
        fadeTo(0, 400);
        setTimeout(() => {
          try {
            el.pause();
          } catch {}
          setEnabled(false);
        }, 420);
      },
    }),
    [enabled, volume, consented]
  );

  // If consented, auto-enable after the first user gesture on this visit
  useEffect(() => {
    if (!consented) return;
    const onFirstGesture = async () => {
      await api.enable();
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
    window.addEventListener("pointerdown", onFirstGesture, { once: true });
    window.addEventListener("keydown", onFirstGesture, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
  }, [consented, api]);

  // Optional: pause when tab hidden, resume when visible
  useEffect(() => {
    const onVis = () => {
      const el = audioRef.current;
      if (!el) return;
      if (document.hidden) {
        try {
          el.pause();
        } catch {}
      } else if (enabled) {
        el.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [enabled]);

  return <SoundCtx.Provider value={api}>{children}</SoundCtx.Provider>;
}

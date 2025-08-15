// src/sound/SoundProvider.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";

const SoundCtx = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSound = () => useContext(SoundCtx);

export default function SoundProvider({
  src = "/audio/forest-ambience.mp3",
  defaultVolume = 0.35,
  storageKey = "sound:consented",
  children,
}) {
  const audioRef = useRef(null);
  const fadeRafRef = useRef(null);

  const [consented, setConsented] = useState(() => {
    try {
      return localStorage.getItem(storageKey) === "1";
    } catch (e) {
      if (import.meta.env?.DEV) {
        console.debug("[SoundProvider] localStorage get failed:", e);
      }
      return false;
    }
  });
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);

  useEffect(() => {
    const el = new Audio(src);
    el.loop = true;
    el.preload = "auto";
    el.volume = 0;
    audioRef.current = el;
    return () => {
      try {
        el.pause();
      } catch (e) {
        if (import.meta.env?.DEV) {
          console.debug("[SoundProvider] pause on unmount failed:", e);
        }
      }
      audioRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, consented ? "1" : "0");
    } catch (e) {
      if (import.meta.env?.DEV) {
        console.debug("[SoundProvider] localStorage set failed:", e);
      }
    }
  }, [consented, storageKey]);

  const fadeTo = (target, ms = 600) => {
    const el = audioRef.current;
    if (!el) {
      return;
    }
    if (fadeRafRef.current) {
      cancelAnimationFrame(fadeRafRef.current);
    }
    const start = el.volume;
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / ms);
      el.volume = start + (target - start) * t;
      if (t < 1) {
        fadeRafRef.current = requestAnimationFrame(tick);
      } else {
        fadeRafRef.current = null;
      }
    };
    fadeRafRef.current = requestAnimationFrame(tick);
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
        if (el) {
          el.volume = v;
        }
      },
      enable() {
        const el = audioRef.current;
        if (!el) {
          return Promise.resolve();
        }
        const playPromise = el.play();
        if (playPromise) {
          return playPromise
            .then(() => {
              setEnabled(true);
              fadeTo(volume, 800);
            })
            .catch((e) => {
              if (import.meta.env?.DEV) {
                console.debug("[SoundProvider] enable blocked:", e);
              }
            });
        }
        setEnabled(true);
        fadeTo(volume, 800);
        return Promise.resolve();
      },
      disable() {
        const el = audioRef.current;
        if (!el) {
          return Promise.resolve();
        }
        fadeTo(0, 400);
        return new Promise((resolve) => {
          setTimeout(() => {
            try {
              el.pause();
            } catch (e) {
              if (import.meta.env?.DEV) {
                console.debug("[SoundProvider] pause on disable failed:", e);
              }
            }
            setEnabled(false);
            resolve();
          }, 420);
        });
      },
    }),
    [enabled, volume, consented]
  );

  useEffect(() => {
    if (!consented) {
      return;
    }
    const onFirstGesture = () => {
      api.enable();
      ["pointerdown", "keydown", "click", "touchstart"].forEach((ev) =>
        window.removeEventListener(ev, onFirstGesture)
      );
    };
    ["pointerdown", "keydown", "click", "touchstart"].forEach((ev) =>
      window.addEventListener(ev, onFirstGesture, { once: true })
    );
    return () => {
      ["pointerdown", "keydown", "click", "touchstart"].forEach((ev) =>
        window.removeEventListener(ev, onFirstGesture)
      );
    };
  }, [consented, api]);

  useEffect(() => {
    const onVis = () => {
      const el = audioRef.current;
      if (!el) {
        return;
      }
      if (document.hidden) {
        try {
          el.pause();
        } catch (e) {
          if (import.meta.env?.DEV) {
            console.debug("[SoundProvider] pause on hidden failed:", e);
          }
        }
      } else if (enabled) {
        el.play().catch((e) => {
          if (import.meta.env?.DEV) {
            console.debug("[SoundProvider] resume play failed:", e);
          }
        });
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [enabled]);

  useEffect(() => {
    return () => {
      if (fadeRafRef.current) {
        cancelAnimationFrame(fadeRafRef.current);
      }
    };
  }, []);

  return <SoundCtx.Provider value={api}>{children}</SoundCtx.Provider>;
}

SoundProvider.propTypes = {
  src: PropTypes.string,
  defaultVolume: PropTypes.number,
  storageKey: PropTypes.string,
  children: PropTypes.node,
};

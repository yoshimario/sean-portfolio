// src/components/AuroraBackgroundVivid.jsx
import React, { useEffect, useRef } from "react";

/**
 * AuroraBackgroundVivid
 * Renders two canvases fixed behind the app:
 *  - stars (tiny, twinkling; no big white circles)
 *  - aurora (smooth, curving wisps using noise fields)
 *
 * Props let App.jsx tune behavior for dark/light.
 */
export default function AuroraBackgroundVivid({
  theme = "dark", // 'dark' | 'light'
  intensity = 0.8, // overall aurora strength
  speed = 0.22, // animation speed
  contrast = 1.05, // color contrast
  saturation = 1.0, // color pop
  scaleY = 1.1, // vertical stretch of ribbons
  stars = true, // show stars? App turns off in light mode if wanted
  starDensity = 0.85, // 0..1 density (relative to screen area)
  wispCount = 4, // number of aurora ribbons
  wispOpacity = 0.2, // per‑wisp opacity
  shimmerOpacity = 0.1, // high‑frequency shimmer overlay
}) {
  const starRef = useRef(null);
  const auroraRef = useRef(null);
  const rafRef = useRef(null);
  const starsCache = useRef(null);
  const lastSize = useRef({ w: 0, h: 0 });

  // --- Simplex/Perlin-ish noise (fast GLSL-free JS) ---
  // lightweight value-noise with smoothstep
  const makeNoise = () => {
    const perm = new Uint8Array(512);
    for (let i = 0; i < 256; i++) perm[i] = i;
    // shuffle
    for (let i = 255; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    for (let i = 0; i < 256; i++) perm[256 + i] = perm[i];

    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a, b, t) => a + (b - a) * t;
    const grad = (h, x, y) => {
      // 4 gradients
      switch (h & 3) {
        case 0:
          return x + y;
        case 1:
          return -x + y;
        case 2:
          return x - y;
        default:
          return -x - y;
      }
    };

    return (x, y) => {
      const X = Math.floor(x) & 255;
      const Y = Math.floor(y) & 255;
      x -= Math.floor(x);
      y -= Math.floor(y);
      const u = fade(x);
      const v = fade(y);

      const aa = perm[X + perm[Y]];
      const ab = perm[X + perm[Y + 1]];
      const ba = perm[X + 1 + perm[Y]];
      const bb = perm[X + 1 + perm[Y + 1]];

      const n0 = grad(aa, x, y);
      const n1 = grad(ba, x - 1, y);
      const n2 = grad(ab, x, y - 1);
      const n3 = grad(bb, x - 1, y - 1);

      const ix0 = lerp(n0, n1, u);
      const ix1 = lerp(n2, n3, u);
      // normalize to 0..1
      return (lerp(ix0, ix1, v) + 1) / 2;
    };
  };

  // Create stars once per size, cached to an offscreen canvas
  const buildStars = (w, h) => {
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const ctx = off.getContext("2d");
    ctx.clearRect(0, 0, w, h);

    // density scaled by area; tiny points only (no big circles)
    const base = Math.floor((w * h) / 1600); // 1 per 40x40px
    const count = Math.floor(base * starDensity);

    for (let i = 0; i < count; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const s = Math.random() < 0.7 ? 1 : 2; // 1px or 2px
      const a = 0.35 + Math.random() * 0.45; // subtle alpha

      // pale warm/cool spread
      const hue = 180 + Math.random() * 80; // teal to blue
      ctx.fillStyle = `hsla(${hue}, 70%, ${theme === "dark" ? 90 : 60}%, ${a})`;
      // draw as tiny square for crispness (faster than arcs)
      ctx.fillRect(x, y, s, s);

      // occasional larger very faint star
      if (Math.random() < 0.04) {
        const r = 0.5 + Math.random() * 0.8;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 2.2);
        g.addColorStop(0, `rgba(255,255,255,${0.06})`);
        g.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 2.2 + r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // faint vignette for depth
    const vg = ctx.createRadialGradient(
      w * 0.5,
      h * 0.2,
      10,
      w * 0.5,
      h * 0.5,
      Math.max(w, h) * 0.8
    );
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(
      1,
      theme === "dark" ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.18)"
    );
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);

    return off;
  };

  useEffect(() => {
    const starCanvas = starRef.current;
    const auroraCanvas = auroraRef.current;
    if (!starCanvas || !auroraCanvas) return;

    const starCtx = starCanvas.getContext("2d");
    const aurCtx = auroraCanvas.getContext("2d");

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      if (lastSize.current.w === w && lastSize.current.h === h) return;
      lastSize.current = { w, h };
      [starCanvas, auroraCanvas].forEach((c) => {
        c.width = w;
        c.height = h;
        c.style.width = w + "px";
        c.style.height = h + "px";
      });
      starsCache.current = stars ? buildStars(w, h) : null;
    };

    resize();
    window.addEventListener("resize", resize);

    // noise fields
    const n1 = makeNoise();
    const n2 = makeNoise();
    const n3 = makeNoise();

    let t0 = performance.now();

    const render = (now) => {
      const dt = (now - t0) / 1000;
      t0 = now;

      const w = auroraCanvas.width;
      const h = auroraCanvas.height;

      // draw stars (twinkle via low-amplitude sine)
      starCtx.clearRect(0, 0, w, h);
      if (stars && starsCache.current) {
        // twinkle: modulate global alpha subtly
        const twinkle = 0.92 + 0.08 * Math.sin(now * 0.0013);
        starCtx.globalAlpha = twinkle;
        starCtx.drawImage(starsCache.current, 0, 0);
        starCtx.globalAlpha = 1;
      }

      // aurora
      aurCtx.clearRect(0, 0, w, h);

      // base palette differs in light vs dark
      const baseHue = theme === "dark" ? 145 : 155; // green leaning
      const hueSpread = theme === "dark" ? 70 : 55; // add some magenta/blue
      const lightness = theme === "dark" ? 60 : 72;

      // curved ribbons: sample noise along Bezier-like vertical arcs
      const bands = Math.max(1, wispCount | 0);
      const stepY = h / (bands + 1);

      for (let b = 0; b < bands; b++) {
        const yCenter = stepY * (b + 1);
        const bandScale = 0.0009 + b * 0.00025; // spatial freq
        const bandSpeed = speed * (0.35 + b * 0.12);

        aurCtx.save();
        aurCtx.globalAlpha = Math.min(
          0.85,
          wispOpacity * intensity * (1 - b * 0.07)
        );

        // gradient across the band width with hue drift
        const hue = baseHue + (b / bands) * hueSpread;
        const grad = aurCtx.createLinearGradient(
          0,
          yCenter - 120,
          0,
          yCenter + 120
        );
        grad.addColorStop(
          0,
          `hsla(${hue + 10}, ${80 * saturation}%, ${lightness - 8}%, 0)`
        );
        grad.addColorStop(
          0.5,
          `hsla(${hue}, ${95 * saturation}%, ${lightness}%, 1)`
        );
        grad.addColorStop(
          1,
          `hsla(${hue - 25}, ${80 * saturation}%, ${lightness - 10}%, 0)`
        );
        aurCtx.fillStyle = grad;

        aurCtx.beginPath();

        // left to right curve with noise offset to mimic the "clawing" arc
        const width = w;
        const height = 240 * scaleY;

        for (let x = 0; x <= width; x += 6) {
          const nx = x * bandScale;
          const ty = now * 0.0003 * bandSpeed;

          // two layers of noise for organic motion
          const curve =
            (n1(nx * 1.3 + 100 * b, ty * 1.1) - 0.5) * 180 +
            (n2(nx * 0.6 + 50 * b, ty * 0.7) - 0.5) * 120;

          const y = yCenter + curve * 0.8;
          const thickness = 40 + (n3(nx * 0.9 - 200 * b, ty * 0.9) - 0.5) * 80; // breathing width

          if (x === 0) {
            aurCtx.moveTo(x, y - thickness);
          } else {
            aurCtx.lineTo(x, y - thickness);
          }
        }
        for (let x = width; x >= 0; x -= 6) {
          const nx = x * bandScale;
          const ty = now * 0.0003 * bandSpeed;

          const curve =
            (n1(nx * 1.3 + 100 * b, ty * 1.1) - 0.5) * 180 +
            (n2(nx * 0.6 + 50 * b, ty * 0.7) - 0.5) * 120;

          const y = yCenter + curve * 0.8;
          const thickness = 40 + (n3(nx * 0.9 - 200 * b, ty * 0.9) - 0.5) * 80;

          aurCtx.lineTo(x, y + thickness);
        }
        aurCtx.closePath();
        aurCtx.filter = `contrast(${contrast})`;
        aurCtx.fill();
        aurCtx.filter = "none";
        aurCtx.restore();
      }

      // high‑frequency shimmer smoke overlay
      aurCtx.save();
      aurCtx.globalCompositeOperation = "lighter";
      aurCtx.globalAlpha = shimmerOpacity * intensity;
      const cell = 32;
      for (let y = 0; y < h; y += cell) {
        for (let x = 0; x < w; x += cell) {
          const v =
            n2(x * 0.01 + now * 0.00025, y * 0.012 + 2000) * 0.6 +
            n3(x * 0.008 - 1000, y * 0.01 + now * 0.00035) * 0.4;
          const a = Math.min(0.8, v);
          aurCtx.fillStyle = `rgba(255,255,255,${a * 0.08})`;
          aurCtx.fillRect(x, y, cell, cell);
        }
      }
      aurCtx.restore();

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [
    theme,
    intensity,
    speed,
    contrast,
    saturation,
    scaleY,
    stars,
    starDensity,
    wispCount,
    wispOpacity,
    shimmerOpacity,
  ]);

  // Two fixed canvases behind everything
  const baseZ = -1; // ensure behind content
  const commonStyle = {
    position: "fixed",
    inset: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: baseZ,
  };

  return (
    <>
      <canvas
        ref={starRef}
        style={{ ...commonStyle, zIndex: baseZ }}
        aria-hidden
      />
      <canvas
        ref={auroraRef}
        style={{ ...commonStyle, zIndex: baseZ + 1 }}
        aria-hidden
      />
    </>
  );
}

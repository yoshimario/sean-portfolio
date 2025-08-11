// src/components/AuroraBackgroundVivid.jsx
import React, { useEffect, useRef } from "react";

/**
 * AuroraBackgroundVivid - Improved Version
 * More realistic aurora with organic flowing ribbons and better light mode visibility
 */
export default function AuroraBackgroundVivid({
  theme = "dark",
  intensity = 0.8,
  speed = 0.22,
  contrast = 1.05,
  saturation = 1.0,
  scaleY = 1.1,
  stars = true,
  starDensity = 0.85,
  wispCount = 4,
  wispOpacity = 0.2,
  shimmerOpacity = 0.1,
}) {
  const starRef = useRef(null);
  const auroraRef = useRef(null);
  const rafRef = useRef(null);
  const starsCache = useRef(null);
  const lastSize = useRef({ w: 0, h: 0 });

  // Enhanced noise with multiple octaves for more organic movement
  const makeNoise = () => {
    const perm = new Uint8Array(512);
    for (let i = 0; i < 256; i++) perm[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    for (let i = 0; i < 256; i++) perm[256 + i] = perm[i];

    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a, b, t) => a + (b - a) * t;
    const grad = (h, x, y) => {
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
      return (lerp(ix0, ix1, v) + 1) / 2;
    };
  };

  // Multi-octave noise for more complex patterns
  const fbm = (noise1, noise2, x, y, octaves = 4) => {
    let value = 0;
    let amplitude = 0.5;
    let frequency = 1;

    for (let i = 0; i < octaves; i++) {
      value += amplitude * noise1(x * frequency, y * frequency);
      amplitude *= 0.5;
      frequency *= 2;
    }

    // Add some cross-noise for more organic feel
    value += 0.1 * noise2(x * 0.5, y * 0.8);

    return Math.max(0, Math.min(1, value));
  };

  const buildStars = (w, h) => {
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const ctx = off.getContext("2d");
    ctx.clearRect(0, 0, w, h);

    const base = Math.floor((w * h) / 1600);
    const count = Math.floor(base * starDensity);

    for (let i = 0; i < count; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const s = Math.random() < 0.7 ? 1 : 2;
      const a = 0.35 + Math.random() * 0.45;

      const hue = 180 + Math.random() * 80;
      ctx.fillStyle = `hsla(${hue}, 70%, ${theme === "dark" ? 90 : 60}%, ${a})`;
      ctx.fillRect(x, y, s, s);

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

    const n1 = makeNoise();
    const n2 = makeNoise();
    const n3 = makeNoise();
    const n4 = makeNoise();

    let t0 = performance.now();

    const render = (now) => {
      const dt = (now - t0) / 1000;
      t0 = now;

      const w = auroraCanvas.width;
      const h = auroraCanvas.height;

      // Stars with enhanced twinkling
      starCtx.clearRect(0, 0, w, h);
      if (stars && starsCache.current) {
        const twinkle =
          0.88 + 0.12 * Math.sin(now * 0.0013) + 0.05 * Math.sin(now * 0.0031);
        starCtx.globalAlpha = twinkle;
        starCtx.drawImage(starsCache.current, 0, 0);
        starCtx.globalAlpha = 1;
      }

      // Enhanced Aurora
      aurCtx.clearRect(0, 0, w, h);

      // Better color palettes for both themes
      const isDark = theme === "dark";
      const baseHues = isDark ? [140, 160, 180, 200] : [145, 165, 185, 205];
      const lightness = isDark ? [55, 65, 75] : [45, 55, 65];
      const alpha = isDark ? 1.0 : 0.8;

      const time = now * 0.0001;
      const bands = Math.max(1, wispCount | 0);

      // Create more organic, flowing ribbons
      for (let b = 0; b < bands; b++) {
        const bandProgress = b / Math.max(1, bands - 1);
        const yOffset = h * 0.2 + h * 0.6 * bandProgress;
        const baseHue = baseHues[b % baseHues.length];
        const bandSpeed = speed * (0.8 + bandProgress * 0.4);

        aurCtx.save();

        // Improved opacity calculation for light mode
        const baseOpacity = isDark ? wispOpacity : wispOpacity * 1.8;
        aurCtx.globalAlpha =
          Math.min(0.9, baseOpacity * intensity * (1.2 - bandProgress * 0.3)) *
          alpha;

        // Create flowing ribbon path using multiple noise layers
        const path = new Path2D();
        const points = [];
        const resolution = 8; // Higher resolution for smoother curves

        for (let x = 0; x <= w; x += resolution) {
          const nx = x / w;
          const t = time * bandSpeed;

          // Multiple noise octaves for organic movement
          const wave1 = fbm(n1, n2, nx * 2 + b * 0.5, t * 0.7) - 0.5;
          const wave2 = fbm(n3, n4, nx * 1.2 + b * 0.8, t * 0.5) - 0.5;
          const wave3 = n1(nx * 4 + b, t * 1.2) - 0.5;

          // Combine waves for natural aurora movement
          const yDisp = (wave1 * 120 + wave2 * 80 + wave3 * 40) * scaleY;
          const thickness = 30 + wave2 * 25 + Math.sin(nx * Math.PI * 3) * 15;

          const y = yOffset + yDisp;
          points.push({ x, y, thickness: Math.abs(thickness) });
        }

        // Create smooth ribbon with variable thickness
        if (points.length > 2) {
          // Top curve
          path.moveTo(points[0].x, points[0].y - points[0].thickness);
          for (let i = 1; i < points.length - 1; i++) {
            const curr = points[i];
            const next = points[i + 1];
            const cpX = (curr.x + next.x) / 2;
            const cpY =
              (curr.y + next.y) / 2 - (curr.thickness + next.thickness) / 2;
            path.quadraticCurveTo(curr.x, curr.y - curr.thickness, cpX, cpY);
          }
          path.lineTo(
            points[points.length - 1].x,
            points[points.length - 1].y - points[points.length - 1].thickness
          );

          // Bottom curve (reverse)
          for (let i = points.length - 1; i > 0; i--) {
            const curr = points[i];
            const prev = points[i - 1];
            const cpX = (curr.x + prev.x) / 2;
            const cpY =
              (curr.y + prev.y) / 2 + (curr.thickness + prev.thickness) / 2;
            path.quadraticCurveTo(curr.x, curr.y + curr.thickness, cpX, cpY);
          }
          path.closePath();

          // Enhanced gradient with more realistic aurora colors
          const grad = aurCtx.createLinearGradient(
            0,
            yOffset - 100,
            0,
            yOffset + 100
          );
          const sat = Math.floor(60 + 30 * saturation);
          const light = lightness[b % lightness.length];

          grad.addColorStop(
            0,
            `hsla(${baseHue + 20}, ${sat}%, ${light + 10}%, 0)`
          );
          grad.addColorStop(
            0.2,
            `hsla(${baseHue + 10}, ${sat + 10}%, ${light + 5}%, 0.6)`
          );
          grad.addColorStop(
            0.5,
            `hsla(${baseHue}, ${sat + 20}%, ${light}%, 1)`
          );
          grad.addColorStop(
            0.8,
            `hsla(${baseHue - 10}, ${sat + 10}%, ${light + 5}%, 0.6)`
          );
          grad.addColorStop(
            1,
            `hsla(${baseHue - 20}, ${sat}%, ${light + 10}%, 0)`
          );

          aurCtx.fillStyle = grad;
          aurCtx.filter = `contrast(${contrast}) blur(${isDark ? 0.5 : 0.8}px)`;
          aurCtx.fill(path);
          aurCtx.filter = "none";
        }

        aurCtx.restore();
      }

      // Enhanced shimmer effect - more visible in light mode
      if (shimmerOpacity > 0) {
        aurCtx.save();
        aurCtx.globalCompositeOperation = isDark ? "lighter" : "overlay";
        aurCtx.globalAlpha = shimmerOpacity * intensity * (isDark ? 1 : 2);

        const shimmerSize = isDark ? 40 : 60;
        for (let y = 0; y < h; y += shimmerSize) {
          for (let x = 0; x < w; x += shimmerSize) {
            const noise = fbm(
              n2,
              n3,
              x * 0.008 + time * 0.3,
              y * 0.01 + time * 0.2,
              3
            );
            const brightness = Math.pow(noise, 2) * 0.8;

            if (brightness > 0.2) {
              const shimmerAlpha = (brightness - 0.2) * 0.15;
              aurCtx.fillStyle = isDark
                ? `rgba(200,240,255,${shimmerAlpha})`
                : `rgba(160,200,240,${shimmerAlpha * 0.6})`;
              aurCtx.fillRect(x, y, shimmerSize, shimmerSize);
            }
          }
        }
        aurCtx.restore();
      }

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

  const baseZ = -1;
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

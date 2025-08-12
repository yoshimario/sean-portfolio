// src/components/AuroraBackgroundVivid.jsx
// Dark mode: deep navy sky + stars + calm flowing ribbons
// Light mode: clean pastel background, no aurora or stars (unless enabled)

import React, { useEffect, useRef } from "react";

export default function AuroraBackgroundVivid({
  theme = "dark", // "dark" | "light"
  showInLight = false, // default: no aurora in light mode
  zIndex = 0,

  lightSky = "none", // "none" | "pastel" | "white"

  stars = true,
  starsInLight = false,
  starDensity = 0.38,
  starSize = 0.8,
  starTwinkle = true,

  intensity = 0.22,
  maxOpacity = 0.18,
  lightIntensity = 0.1,
  lightMaxOpacity = 0.08,
  saturation = 1.0,
  lightSaturation = 0.95,

  bloom = 1.0,
  lightBloom = 1.0,

  ribbonCount = 2,
  speed = 0.085,
  curveAmp = 0.18,
  curveFreq = 1.1,
  weaveAmp = 0.08,
  noiseWarp = 0.08,

  puffRadius = 120,
  puffStepPx = 64,

  safeBandTop = 0.3,
  safeBandBottom = 0.75,
  safeBandReduce = 0.65,

  className,
}) {
  const skyRef = useRef(null);
  const starRef = useRef(null);
  const aurRef = useRef(null);
  const rafRef = useRef(null);
  const skyCache = useRef(null);
  const starsCache = useRef(null);
  const last = useRef({ w: 0, h: 0, dpr: 1 });

  const isLight = theme === "light";
  const active = isLight ? showInLight : true;

  const eff = Math.min(
    isLight ? lightMaxOpacity : maxOpacity,
    Math.max(0, isLight ? lightIntensity : intensity)
  );
  const sat = (isLight ? lightSaturation : saturation) * 100;
  const bloomAmt = isLight ? lightBloom : bloom;

  // Noise generator
  const makeNoise = () => {
    const perm = new Uint8Array(512);
    for (let i = 0; i < 256; i++) perm[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    perm.set(perm.subarray(0, 256), 256);
    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a, b, t) => a + (b - a) * t;
    const grad = (h, x, y) => (h & 1 ? -x : x) + (h & 2 ? -y : y);
    return (x, y) => {
      const X = Math.floor(x) & 255,
        Y = Math.floor(y) & 255;
      x -= Math.floor(x);
      y -= Math.floor(y);
      const u = fade(x),
        v = fade(y);
      const aa = perm[X + perm[Y]],
        ab = perm[X + perm[Y + 1]],
        ba = perm[X + 1 + perm[Y]],
        bb = perm[X + 1 + perm[Y + 1]];
      const n0 = grad(aa, x, y),
        n1 = grad(ba, x - 1, y),
        n2 = grad(ab, x, y - 1),
        n3 = grad(bb, x - 1, y - 1);
      const ix0 = lerp(n0, n1, u),
        ix1 = lerp(n2, n3, u);
      return (lerp(ix0, ix1, v) + 1) / 2;
    };
  };

  const lerpHue = (a, b, t) => {
    let d = ((b - a + 540) % 360) - 180;
    return a + d * Math.max(0, Math.min(1, t));
  };

  // Sky background
  const buildSky = (w, h, dpr) => {
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.floor(w * dpr));
    c.height = Math.max(1, Math.floor(h * dpr));
    const ctx = c.getContext("2d", { alpha: true });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    if (isLight) {
      if (lightSky === "none") return c;
      if (lightSky === "white") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        return c;
      }
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#eaf4ff");
      g.addColorStop(1, "#eef6ff");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      return c;
    }

    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#07132b");
    g.addColorStop(0.5, "#0b1a38");
    g.addColorStop(1, "#12244c");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    return c;
  };

  // Stars
  const buildStars = (w, h, dpr) => {
    if (isLight && !starsInLight) return null;
    const c = document.createElement("canvas");
    c.width = w * dpr;
    c.height = h * dpr;
    const ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    const base = Math.floor((w * h) / 3600);
    const count = Math.floor(base * starDensity);
    for (let i = 0; i < count; i++) {
      const x = Math.random() * w,
        y = Math.random() * h;
      const r = Math.random() < 0.9 ? starSize : starSize * 1.4;
      const a = 0.35 + Math.random() * 0.45;
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    return c;
  };

  useEffect(() => {
    if (!active && isLight) {
      // In light mode with showInLight = false → only show background
      const skyCanvas = skyRef.current;
      if (skyCanvas) {
        const ctx = skyCanvas.getContext("2d");
        const w = window.innerWidth,
          h = window.innerHeight,
          dpr = Math.min(2, window.devicePixelRatio || 1);
        skyCanvas.width = Math.floor(w * dpr);
        skyCanvas.height = Math.floor(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.drawImage(buildSky(w, h, dpr), 0, 0);
      }
      return;
    }

    const skyCanvas = skyRef.current;
    const starCanvas = starRef.current;
    const aurCanvas = aurRef.current;
    if (!skyCanvas || !starCanvas || !aurCanvas) return;

    const skyCtx = skyCanvas.getContext("2d");
    const starCtx = starCanvas.getContext("2d");
    const aurCtx = aurCanvas.getContext("2d");

    const measure = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = window.innerWidth,
        h = window.innerHeight;
      last.current = { w, h, dpr };
      [skyCanvas, starCanvas, aurCanvas].forEach((c) => {
        c.width = Math.floor(w * dpr);
        c.height = Math.floor(h * dpr);
        c.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
      });
      skyCache.current = buildSky(w, h, dpr);
      starsCache.current = buildStars(w, h, dpr);
    };

    measure();
    window.addEventListener("resize", measure);

    const n = makeNoise();

    const render = (now) => {
      const w = aurCanvas.width / last.current.dpr;
      const h = aurCanvas.height / last.current.dpr;
      const t = now * 0.0001 * speed;

      // Sky
      skyCtx.clearRect(0, 0, w, h);
      if (skyCache.current) skyCtx.drawImage(skyCache.current, 0, 0, w, h);

      // Stars (only if enabled in current mode)
      starCtx.clearRect(0, 0, w, h);
      if (starsCache.current) {
        const tw = starTwinkle
          ? 0.92 + 0.05 * Math.sin(now * 0.0011) + 0.03 * Math.cos(now * 0.002)
          : 1;
        starCtx.globalAlpha = tw;
        starCtx.drawImage(starsCache.current, 0, 0, w, h);
        starCtx.globalAlpha = 1;
      }

      // Aurora (skip in light mode if disabled)
      if (!isLight || (isLight && showInLight)) {
        aurCtx.clearRect(0, 0, w, h);
        aurCtx.save();
        aurCtx.globalCompositeOperation = isLight ? "screen" : "lighter";

        const segs = 76;
        const baseAlpha = eff;

        for (let r = 0; r < ribbonCount; r++) {
          const pts = [];
          for (let i = 0; i <= segs; i++) {
            const nx = i / segs;
            const x = nx * w;
            const center =
              0.5 + Math.sin(nx * Math.PI * curveFreq + t * 0.7) * curveAmp;
            const weave =
              Math.sin(
                nx * Math.PI * (curveFreq + 0.5) + t * 0.9 + r * Math.PI
              ) * weaveAmp;
            const warp =
              (n(nx * 1.4 + r * 0.7 + t * 0.4, t * 0.4 + r) - 0.5) * noiseWarp;
            const y = (center + weave + warp) * h;
            pts.push({ x, y });
          }

          for (let i = 1; i < pts.length; i++) {
            const p0 = pts[i - 1],
              p1 = pts[i];
            const dx = p1.x - p0.x,
              dy = p1.y - p0.y;
            const segLen = Math.hypot(dx, dy);

            let d = 0;
            while (d <= segLen) {
              const tseg = d / segLen;
              const cx = p0.x + dx * tseg;
              const cy = p0.y + dy * tseg;

              const jitter = n(cx * 0.004 + t, cy * 0.004 + r) - 0.5;
              const R = Math.max(90, puffRadius + jitter * 32);

              const hueTeal = 150,
                hueBlue = 210,
                huePurple = 285,
                hueRed = 350;
              const sweep =
                0.5 + 0.5 * Math.sin((cx / w) * Math.PI * 1.1 + t * 0.7 + r);
              const redPulse = Math.max(0, Math.sin(t * 0.5 + r) - 0.94) / 0.06;
              const hue = lerpHue(
                lerpHue(hueTeal, hueBlue, sweep),
                huePurple,
                sweep * 0.6
              );
              const hueWithRed = lerpHue(hue, hueRed, Math.min(1, redPulse));

              const yn = cy / h;
              const inBand =
                yn > safeBandTop && yn < safeBandBottom ? safeBandReduce : 0;
              const alphaMul = 1 - inBand;

              const grad = aurCtx.createRadialGradient(cx, cy, 0, cx, cy, R);
              grad.addColorStop(
                0.0,
                `hsla(${hueWithRed}, ${sat}%, ${isLight ? 86 : 76}%, ${
                  baseAlpha * 0.6 * alphaMul
                })`
              );
              grad.addColorStop(
                0.45,
                `hsla(${hueWithRed + 18}, ${Math.min(100, sat * 0.9)}%, ${
                  isLight ? 87 : 78
                }%, ${baseAlpha * 0.42 * alphaMul})`
              );
              grad.addColorStop(
                1.0,
                `hsla(${hueWithRed + 90}, 60%, ${isLight ? 88 : 80}%, 0)`
              );

              aurCtx.shadowBlur = 12;
              aurCtx.shadowColor = `hsla(${hueBlue}, 90%, ${
                isLight ? 88 : 78
              }%, ${baseAlpha * alphaMul})`;
              aurCtx.fillStyle = grad;
              aurCtx.beginPath();
              aurCtx.arc(cx, cy, R, 0, Math.PI * 2);
              aurCtx.fill();

              d += puffStepPx;
            }
          }
        }

        aurCtx.restore();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("resize", measure);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [
    active,
    theme,
    showInLight,
    lightSky,
    stars,
    starsInLight,
    starDensity,
    starSize,
    starTwinkle,
    intensity,
    maxOpacity,
    lightIntensity,
    lightMaxOpacity,
    saturation,
    lightSaturation,
    bloom,
    lightBloom,
    ribbonCount,
    speed,
    curveAmp,
    curveFreq,
    weaveAmp,
    noiseWarp,
    puffRadius,
    puffStepPx,
    safeBandTop,
    safeBandBottom,
    safeBandReduce,
  ]);

  if (!active && isLight) {
    return (
      <div aria-hidden>
        <canvas ref={skyRef} className="aurora-canvas" style={{ zIndex }} />
      </div>
    );
  }

  return (
    <div aria-hidden>
      <canvas ref={skyRef} className="aurora-canvas" style={{ zIndex }} />
      <canvas ref={starRef} className="aurora-canvas" style={{ zIndex }} />
      <canvas ref={aurRef} className="aurora-canvas" style={{ zIndex }} />
    </div>
  );
}

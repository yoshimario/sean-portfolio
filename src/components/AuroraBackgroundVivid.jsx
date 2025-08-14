// src/components/AuroraBackgroundVivid.jsx
import React, { useEffect, useRef } from "react";

export default function AuroraBackgroundVivid({
  // Theme
  theme = "light", // "light" | "dark"
  showInLight = true, // render aurora in light mode
  zIndex = 0,

  // Light sky: "none" (transparent), "pastel" (#eaf4ff grad), "white"
  lightSky = "none",

  // Stars
  stars = true,
  starsInLight = false,
  starDensity = 0.34,
  starSize = 0.9,
  starTwinkle = true,

  // Dark (tuned for readability)
  intensity = 0.24,
  maxOpacity = 0.26,
  saturation = 1.25,
  bloom = 1.1,

  // Light (make it bright & visible)
  lightIntensity = 0.44,
  lightMaxOpacity = 0.36,
  lightSaturation = 1.3,
  lightBloom = 1.25,

  // Flow (more movement)
  ribbonCount = 3, // center + upper + lower
  speed = 0.14, // ↑ speed for more motion
  curveAmp = 0.24, // deeper swoop
  curveFreq = 1.25,
  weaveAmp = 0.12, // stronger weave
  noiseWarp = 0.12, // extra wispy wobble

  // Smoke puffs
  puffRadius = 140,
  puffStepPx = 52,

  // Readability band (smooth dimming)
  safeBandTop = 0.24,
  safeBandBottom = 0.86,
  safeBandReduce = 0.78, // dark mode max reduce; light capped internally
}) {
  const skyRef = useRef(null);
  const starRef = useRef(null);
  const aurRef = useRef(null);
  const rafRef = useRef(null);
  const skyCache = useRef(null);
  const starsCache = useRef(null);
  const last = useRef({ w: 0, h: 0, dpr: 1 });

  const isLight = theme === "light";
  const allowAurora = !isLight || (isLight && showInLight);

  const eff = Math.min(
    isLight ? lightMaxOpacity : maxOpacity,
    Math.max(0, isLight ? lightIntensity : intensity)
  );
  const sat = (isLight ? Math.max(lightSaturation, 1.15) : saturation) * 100;
  const bloomAmt = isLight ? lightBloom : bloom;

  // ---------- utils ----------
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
        ab = perm[X + perm[Y + 1]];
      const ba = perm[X + 1 + perm[Y]],
        bb = perm[X + 1 + perm[Y + 1]];
      const n0 = grad(aa, x, y),
        n1 = grad(ba, x - 1, y),
        n2 = grad(ab, x, y - 1),
        n3 = grad(bb, x - 1, y - 1);
      const ix0 = lerp(n0, n1, u),
        ix1 = lerp(n2, n3, u);
      return (lerp(ix0, ix1, v) + 1) / 2; // 0..1
    };
  };

  const lerpHue = (a, b, t) => {
    let d = ((b - a + 540) % 360) - 180;
    return a + d * Math.max(0, Math.min(1, t));
  };

  // ---------- sky ----------
  const buildSky = (w, h, dpr) => {
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.floor(w * dpr));
    c.height = Math.max(1, Math.floor(h * dpr));
    const ctx = c.getContext("2d", { alpha: true });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    if (isLight) {
      if (lightSky === "none") return c; // transparent → body (#eaf4ff) shows
      if (lightSky === "white") {
        ctx.fillStyle = "#fff";
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

  // ---------- stars ----------
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

      // 1) Sky
      skyCtx.clearRect(0, 0, w, h);
      if (skyCache.current) skyCtx.drawImage(skyCache.current, 0, 0, w, h);

      // 2) Stars
      starCtx.clearRect(0, 0, w, h);
      if (starsCache.current) {
        const tw = starTwinkle
          ? 0.92 + 0.05 * Math.sin(now * 0.0011) + 0.03 * Math.cos(now * 0.002)
          : 1;
        starCtx.globalAlpha = tw;
        starCtx.drawImage(starsCache.current, 0, 0, w, h);
        starCtx.globalAlpha = 1;
      }

      // 3) Aurora
      aurCtx.clearRect(0, 0, w, h);
      if (allowAurora) {
        aurCtx.save();
        aurCtx.globalCompositeOperation = isLight ? "screen" : "lighter";

        const segs = 76;
        const t = now * 0.0001 * speed;
        const baseAlpha = eff * (isLight ? 1.2 : 1.0); // boost light mode

        // leader + followers (more separation + phase)
        const threeSpec = [
          { role: "center", sign: 0, phase: 0.0, alpha: 1.0, sep: 0.0 },
          { role: "upper", sign: -1, phase: +0.45, alpha: 0.88, sep: 0.2 },
          { role: "lower", sign: +1, phase: -0.45, alpha: 0.88, sep: 0.2 },
        ];
        const specs =
          ribbonCount === 3
            ? threeSpec
            : Array.from({ length: ribbonCount }, (_, i) => ({
                role: "r" + i,
                sign:
                  (i - (ribbonCount - 1) / 2) / Math.max(1, ribbonCount - 1),
                phase: (i - (ribbonCount - 1) / 2) * 0.35,
                alpha: 1 - Math.abs(i - (ribbonCount - 1) / 2) * 0.25,
                sep: 0.14,
              }));

        // global drifts & pulses
        const driftX = Math.sin(now * 0.00006) * 0.15; // -0.15..0.15 of width
        const driftY = Math.sin(now * 0.00004 + 1.2) * 0.1; // -0.10..0.10 of height
        const curvePulse = 0.6 + 0.4 * Math.sin(now * 0.0002);
        const weavePulse = 0.6 + 0.4 * Math.cos(now * 0.00023);

        for (let r = 0; r < specs.length; r++) {
          const S = specs[r];

          // build points along curvy path
          const pts = [];
          for (let i = 0; i <= segs; i++) {
            const nx = i / segs;
            const x = nx * w + driftX * w;

            const baseFreq = curveFreq + 0.2 * curvePulse;
            const baseAmp = curveAmp * (0.9 + 0.6 * curvePulse);
            const centerCurve =
              0.5 +
              Math.sin(nx * Math.PI * baseFreq + t * 7) * baseAmp +
              driftY;

            const weave =
              Math.sin(nx * Math.PI * (curveFreq + 0.5) + t * 13 + S.phase) *
              weaveAmp *
              (0.7 + 0.6 * weavePulse);
            const warp =
              (n(nx * 1.8 + r * 0.7 + t * 2.5, t * 3.5 + r) - 0.5) *
              (noiseWarp * 1.4);

            const sepDrift = 0.1 * Math.sin(t * 8 + nx * 4.0 + r);
            const sepY = S.sign * (S.sep + sepDrift);

            const y = (centerCurve + weave + warp + sepY) * h;
            pts.push({ x, y });
          }

          // draw smoke puffs along the path
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

              // hues: teal → blue → purple (rare red)
              const hueTeal = 150,
                hueBlue = 210,
                huePurple = 285,
                hueRed = 350;
              const sweep =
                0.5 + 0.5 * Math.sin((cx / w) * Math.PI * 1.1 + t * 7 + r);
              const redPulse = Math.max(0, Math.sin(t * 5 + r) - 0.94) / 0.06;
              const hue = lerpHue(
                lerpHue(hueTeal, hueBlue, sweep),
                huePurple,
                sweep * 0.6
              );
              const hueWithRed = lerpHue(hue, hueRed, Math.min(1, redPulse));

              // smooth safe-band dimming (stronger in dark, gentle in light)
              const bandTop = safeBandTop;
              const bandBot = safeBandBottom;
              const bandWidth = Math.max(0.001, bandBot - bandTop);
              const bandCenter = bandTop + bandWidth * 0.5;
              const bandHalf = bandWidth * 0.5;
              const inside = cy / h > bandTop && cy / h < bandBot;
              let falloff = 0;
              if (inside) {
                const yn = cy / h;
                const xFall = 1 - Math.abs(yn - bandCenter) / bandHalf; // 0..1
                falloff = xFall * xFall * (3 - 2 * xFall); // smoothstep
              }
              const targetReduce = isLight
                ? Math.min(0.35, safeBandReduce)
                : safeBandReduce;
              const reduction = falloff * targetReduce;
              const alphaMul =
                Math.max(0, Math.min(1, 1 - reduction)) * S.alpha;

              // slightly darker core in light so it shows on #eaf4ff
              const lCore = isLight ? 74 : 78;
              const lMid = isLight ? 78 : 80;

              const grad = aurCtx.createRadialGradient(cx, cy, 0, cx, cy, R);
              grad.addColorStop(
                0.0,
                `hsla(${hueWithRed}, ${sat}%, ${lCore}%, ${
                  baseAlpha * (isLight ? 0.95 : 0.8) * alphaMul
                })`
              );
              grad.addColorStop(
                0.45,
                `hsla(${hueWithRed + 18}, ${Math.min(
                  100,
                  sat * 0.9
                )}%, ${lMid}%, ${
                  baseAlpha * (isLight ? 0.75 : 0.6) * alphaMul
                })`
              );
              grad.addColorStop(
                1.0,
                `hsla(${hueWithRed + 90}, 60%, ${lMid + 2}%, 0)`
              );

              aurCtx.shadowBlur = 12 + bloomAmt * 4;
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

        // gentle bloom (less in light so colors stay)
        aurCtx.globalCompositeOperation = isLight ? "screen" : "lighter";
        aurCtx.globalAlpha = Math.min(isLight ? 0.55 : 0.6, eff);
        aurCtx.filter = `blur(${
          (isLight ? 8 : 10) + bloomAmt * (isLight ? 6 : 8)
        }px)`;
        aurCtx.drawImage(aurRef.current, 0, 0);
        aurCtx.filter = "none";
        aurCtx.globalAlpha = 1;

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
    saturation,
    bloom,
    lightIntensity,
    lightMaxOpacity,
    lightSaturation,
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

  if (!allowAurora) {
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

// src/components/AuroraBackgroundR3F.jsx
import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// Fullscreen quad that ignores the camera (positions are already in clip-space)
function FullscreenQuad({
  dark,
  intensity,
  hue,
  speed,
  scaleY,
  contrast,
  saturation,
}) {
  const matRef = React.useRef();

  const uniforms = React.useMemo(
    () => ({
      uTime: { value: 0 },
      uDark: { value: dark ? 1.0 : 0.0 },
      uIntensity: { value: intensity },
      uHue: { value: hue },
      uSpeed: { value: speed },
      uScaleY: { value: scaleY },
      uContrast: { value: contrast },
      uSaturation: { value: saturation },
    }),
    [] // uniforms object kept stable; values updated below
  );

  React.useEffect(() => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uDark.value = dark ? 1.0 : 0.0;
    u.uIntensity.value = intensity;
    u.uHue.value = hue;
    u.uSpeed.value = speed;
    u.uScaleY.value = scaleY;
    u.uContrast.value = contrast;
    u.uSaturation.value = saturation;
  }, [dark, intensity, hue, speed, scaleY, contrast, saturation]);

  useFrame((_, dt) => {
    if (matRef.current)
      matRef.current.uniforms.uTime.value += dt * uniforms.uSpeed.value;
  });

  const fragment = /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime, uDark, uIntensity, uHue, uScaleY, uContrast, uSaturation;

    // simplex-like noise (iq)
    vec2 hash(vec2 p){
      p = vec2(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5,183.3)));
      return -1.0 + 2.0*fract(sin(p)*43758.5453123);
    }
    float noise(vec2 p){
      const float K1 = 0.366025404; // (sqrt(3)-1)/2
      const float K2 = 0.211324865; // (3-sqrt(3))/6
      vec2 i = floor(p + (p.x+p.y)*K1);
      vec2 a = p - i + (i.x+i.y)*K2;
      vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
      vec2 b = a - o + K2;
      vec2 c = a - 1.0 + 2.0*K2;
      vec3 h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
      vec3 n = h*h*h*h * vec3(dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
      return dot(n, vec3(70.0));
    }
    float fbm(vec2 p){
      float v=0.0, a=0.5;
      for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.0; a *= 0.5; }
      return v;
    }

    vec3 auroraPalette(float t){
      // vivid greens/teals with purple skirts; hue offset via uHue
      float g = 0.65 + 0.35 * sin(t*0.35 + 1.5 + uHue*6.2831853);
      float b = 0.45 + 0.40 * sin(t*0.27 + 4.0 + uHue*3.2);
      float p = 0.25 + 0.40 * sin(t*0.22 + 6.0 + uHue*2.1);
      return normalize(vec3(0.2*b + 0.08, 0.75*g + 0.12, 0.55*b + 0.35*p));
    }

    vec3 saturateColor(vec3 c, float s){
      float l = dot(c, vec3(0.299,0.587,0.114));
      return mix(vec3(l), c, s);
    }
    vec3 contrastColor(vec3 c, float k){
      return (c - 0.5) * k + 0.5;
    }

    void main(){
      vec2 uv = vUv;
      // vertical tall curtains
      uv.y = (uv.y - 0.5) * uScaleY + 0.5;

      float t = uTime;

      // broad curtains drifting upward
      float base = fbm(vec2(uv.x*2.0, uv.y*1.1 - t*0.06));
      base += 0.5*fbm(vec2(uv.x*3.6 + 1.2, uv.y*1.8 + t*0.05));
      base = smoothstep(0.42, 0.95, base);

      // fine streak filaments
      float streaks = fbm(vec2(uv.x*8.0 - t*0.15, uv.y*2.8 + t*0.04));
      float banding = 0.30 + 0.85 * smoothstep(0.25, 0.9, streaks);

      // horizon glow toward lower half
      float horizon = smoothstep(0.05, 0.95, 1.0 - uv.y);

      vec3 aur = auroraPalette(t) * base * banding * horizon;

      // sky (light vs dark)
      vec3 skyDark  = vec3(0.015, 0.02, 0.06);
      vec3 skyLight = vec3(0.93, 0.97, 1.0);
      vec3 sky = mix(skyLight, skyDark, uDark);

      vec3 col = sky + aur * (1.4 * uIntensity);
      col = saturateColor(col, uSaturation);
      col = contrastColor(col, uContrast);

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const vertex = /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    attribute vec3 position;
    attribute vec2 uv;
    void main(){
      vUv = uv;
      // positions are already in clip space (-1..1), so no camera needed
      gl_Position = vec4(position, 1.0);
    }
  `;

  // Fullscreen quad in clip space
  const geom = React.useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]); // single big triangle that covers the screen
    const uvs = new Float32Array([0, 0, 2, 0, 0, 2]);
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    return g;
  }, []);

  return (
    <mesh geometry={geom}>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent={false}
      />
    </mesh>
  );
}

export default function AuroraBackgroundR3F({
  theme = "dark",
  intensity = 1.3,
  hueShift = 0.25,
  speed = 1.0,
  scaleY = 1.8,
  contrast = 1.5,
  saturation = 1.6,
  className = "",
}) {
  const dark = theme === "dark";
  return (
    <div className={`fixed inset-0 -z-50 pointer-events-none ${className}`}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }} // transparent, no black sheet
      >
        {/* Subtle, natural starfield */}
        <Stars
          radius={300}
          depth={80}
          count={1800}
          factor={3}
          saturation={0}
          fade
        />
        <FullscreenQuad
          dark={dark}
          intensity={intensity}
          hue={hueShift}
          speed={speed}
          scaleY={scaleY}
          contrast={contrast}
          saturation={saturation}
        />
      </Canvas>
    </div>
  );
}

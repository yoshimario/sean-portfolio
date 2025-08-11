import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";

/* ---------- Aurora shader (vivid bands, vertical sweep) ---------- */
function AuroraMaterial({
  dark = true,
  intensity = 1.2,
  hue = 0.25, // 0..1 hue shift
  speed = 1.0, // animation speed
  saturation = 1.4, // boost color
  contrast = 1.2, // pop the bands
  scaleY = 1.6, // stretch vertically
}) {
  const mat = React.useRef();
  const uniforms = React.useMemo(
    () => ({
      uTime: { value: 0 },
      uDark: { value: dark ? 1.0 : 0.0 },
      uIntensity: { value: intensity },
      uHue: { value: hue },
      uSpeed: { value: speed },
      uSat: { value: saturation },
      uCon: { value: contrast },
      uScaleY: { value: scaleY },
    }),
    [] // uniforms object identity stays stable; values get updated below
  );

  React.useEffect(() => {
    if (!mat.current) return;
    mat.current.uniforms.uDark.value = dark ? 1.0 : 0.0;
    mat.current.uniforms.uIntensity.value = intensity;
    mat.current.uniforms.uHue.value = hue;
    mat.current.uniforms.uSpeed.value = speed;
    mat.current.uniforms.uSat.value = saturation;
    mat.current.uniforms.uCon.value = contrast;
    mat.current.uniforms.uScaleY.value = scaleY;
  }, [dark, intensity, hue, speed, saturation, contrast, scaleY]);

  useFrame((_, dt) => {
    if (mat.current)
      mat.current.uniforms.uTime.value += dt * uniforms.uSpeed.value;
  });

  const fragment = /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime, uDark, uIntensity, uHue, uSat, uCon, uScaleY;

    vec2 hash(vec2 p){
      p = vec2(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5,183.3)));
      return -1.0 + 2.0*fract(sin(p)*43758.5453123);
    }
    float noise(in vec2 p){
      const float K1=0.366025404, K2=0.211324865;
      vec2 i=floor(p+(p.x+p.y)*K1);
      vec2 a=p-i+(i.x+i.y)*K2;
      vec2 o=(a.x>a.y)?vec2(1.0,0.0):vec2(0.0,1.0);
      vec2 b=a-o+K2, c=a-1.0+2.0*K2;
      vec3 h=max(0.5-vec3(dot(a,a),dot(b,b),dot(c,c)),0.0);
      vec3 n=h*h*h*h*vec3(dot(a,hash(i+0.0)),dot(b,hash(i+o)),dot(c,hash(i+1.0)));
      return dot(n, vec3(70.0));
    }
    float fbm(vec2 p){
      float v=0.0,a=0.5;
      for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.0; a*=0.5; }
      return v;
    }

    vec3 auroraPalette(float t){
      // green/teal/purple like Finland skies, slowly shifting hue
      float h = uHue*6.28318;       // radians
      float g = 0.60 + 0.35*sin(t*0.37 + 0.8 + h);
      float b = 0.48 + 0.38*sin(t*0.29 + 2.7 + h*0.85);
      float p = 0.20 + 0.35*sin(t*0.22 + 4.0 + h*0.55);
      vec3 raw = normalize(vec3(0.18*b+0.10, 0.70*g+0.12, 0.55*b+0.35*p));
      // saturation boost
      float l = dot(raw, vec3(0.2126,0.7152,0.0722));
      return mix(vec3(l), raw, uSat);
    }

    void main(){
      vec2 uv = vUv;
      uv.y = (uv.y-0.5)*uScaleY + 0.5;  // stretch vertically

      float t = uTime;

      // vertical “curtains” drifting upward
      float base = fbm(vec2(uv.x*2.0, uv.y*1.1 - t*0.06));
      base += 0.5*fbm(vec2(uv.x*3.6 + 1.2, uv.y*1.8 + t*0.05));
      base = smoothstep(0.45, 0.95, base);

      // fine streaks (filaments)
      float streaks = fbm(vec2(uv.x*7.0 - t*0.15, uv.y*2.5 + t*0.04));
      float band = 0.35 + 0.75*smoothstep(0.25, 0.85, streaks);

      // horizon falloff (more glow in lower half)
      float horizon = smoothstep(0.05, 0.9, 1.0 - uv.y);

      vec3 skyDark  = vec3(0.015, 0.02, 0.055);
      vec3 skyLight = vec3(0.93, 0.97, 1.00);
      vec3 sky = mix(skyLight, skyDark, uDark);

      vec3 aur = auroraPalette(t) * base * band * horizon;

      // contrast punch
      aur = (aur - 0.5) * uCon + 0.5;

      vec3 color = sky + aur * (1.4 * uIntensity);
      gl_FragColor = vec4(color, 1.0);
    }
  `;
  const vertex = /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    void main(){ vUv = uv; gl_Position = vec4(position,1.0); }
  `;

  return (
    <shaderMaterial
      ref={mat}
      fragmentShader={fragment}
      vertexShader={vertex}
      uniforms={uniforms}
      transparent={false}
    />
  );
}

/* ---------- Simple starfield (random points + slight twinkle) ---------- */
function Stars({ count = 1500, brightness = 0.9, size = 0.01 }) {
  const points = React.useRef();
  const [geom] = React.useState(() => new THREE.BufferGeometry());
  const [mat] = React.useState(
    () =>
      new THREE.PointsMaterial({
        size,
        transparent: true,
        depthWrite: false,
      })
  );

  React.useEffect(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // spread stars in a big sphere shell so they feel infinite
      const r = 3 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  }, [count, geom]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // subtle twinkle by modulating alpha
    mat.opacity = brightness * (0.75 + 0.25 * Math.sin(t * 0.7));
  });

  return <points ref={points} geometry={geom} material={mat} />;
}

/* ---------- Fullscreen plane + camera ---------- */
function FullscreenAurora(props) {
  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[2, 2]} />
      <AuroraMaterial {...props} />
    </mesh>
  );
}

export default function AuroraBackgroundR3F({
  theme = "dark",
  intensity = 1.3,
  hueShift = 0.28,
  speed = 1.1,
  saturation = 1.5,
  contrast = 1.25,
  scaleY = 1.6,
  stars = true,
}) {
  const dark = theme === "dark";
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none">
      <Canvas
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <OrthographicCamera makeDefault position={[0, 0, 1]} />
        {stars && (
          <Stars count={1400} brightness={dark ? 1.0 : 0.65} size={0.01} />
        )}
        <FullscreenAurora
          dark={dark}
          intensity={intensity}
          hue={hueShift}
          speed={speed}
          saturation={saturation}
          contrast={contrast}
          scaleY={scaleY}
        />
      </Canvas>
    </div>
  );
}

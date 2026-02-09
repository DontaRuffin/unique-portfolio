import { useRef, useMemo } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { EffectComposer, RenderPass, ShaderPass, UnrealBloomPass } from 'three/examples/jsm/Addons.js';
import * as THREE from 'three';

// Extend Three.js with post-processing
extend({ EffectComposer, RenderPass, ShaderPass, UnrealBloomPass });

// Chromatic Aberration Shader
const ChromaticAberrationShader = {
  uniforms: {
    tDiffuse: { value: null },
    uOffset: { value: 0.003 },
    uTime: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uOffset;
    uniform float uTime;
    varying vec2 vUv;
    
    void main() {
      vec2 center = vec2(0.5);
      vec2 dir = vUv - center;
      float dist = length(dir);
      
      // Offset increases towards edges
      float offset = uOffset * dist * dist;
      
      // Add subtle animation
      offset *= 1.0 + sin(uTime * 0.5) * 0.1;
      
      vec2 rUv = vUv + dir * offset;
      vec2 gUv = vUv;
      vec2 bUv = vUv - dir * offset;
      
      float r = texture2D(tDiffuse, rUv).r;
      float g = texture2D(tDiffuse, gUv).g;
      float b = texture2D(tDiffuse, bUv).b;
      
      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `,
};

// Film Grain Shader
const FilmGrainShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uIntensity: { value: 0.05 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uIntensity;
    varying vec2 vUv;
    
    float random(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      
      // Generate noise
      float noise = random(vUv + uTime) * 2.0 - 1.0;
      
      // Apply grain
      color.rgb += noise * uIntensity;
      
      gl_FragColor = color;
    }
  `,
};

// Vignette Shader
const VignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    uDarkness: { value: 0.5 },
    uOffset: { value: 1.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uDarkness;
    uniform float uOffset;
    varying vec2 vUv;
    
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      
      vec2 center = vec2(0.5);
      float dist = distance(vUv, center);
      float vignette = smoothstep(0.8, uOffset * 0.5, dist * (uDarkness + uOffset));
      
      color.rgb *= vignette;
      
      gl_FragColor = color;
    }
  `,
};

// Pixelation Shader (for retro PS1 aesthetic)
const PixelationShader = {
  uniforms: {
    tDiffuse: { value: null },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uPixelSize: { value: 4.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    uniform float uPixelSize;
    varying vec2 vUv;
    
    void main() {
      vec2 dxy = uPixelSize / uResolution;
      vec2 coord = dxy * floor(vUv / dxy);
      gl_FragColor = texture2D(tDiffuse, coord);
    }
  `,
};

// Scanlines Shader
const ScanlinesShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uCount: { value: 800.0 },
    uIntensity: { value: 0.1 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uCount;
    uniform float uIntensity;
    varying vec2 vUv;
    
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      
      // Scanline effect
      float scanline = sin(vUv.y * uCount + uTime * 2.0) * 0.5 + 0.5;
      scanline = pow(scanline, 1.5);
      
      color.rgb -= scanline * uIntensity;
      
      gl_FragColor = color;
    }
  `,
};

interface PostProcessingProps {
  enableChromatic?: boolean;
  enableGrain?: boolean;
  enableVignette?: boolean;
  enablePixelation?: boolean;
  enableScanlines?: boolean;
  enableBloom?: boolean;
  chromaticOffset?: number;
  grainIntensity?: number;
  pixelSize?: number;
}

export function PostProcessing({
  enableChromatic = true,
  enableGrain = true,
  enableVignette = true,
  enablePixelation = false,
  enableScanlines = false,
  enableBloom = false,
  chromaticOffset = 0.003,
  grainIntensity = 0.04,
  pixelSize = 4,
}: PostProcessingProps) {
  const composerRef = useRef<EffectComposer | null>(null);
  const { gl, scene, camera, size } = useThree();
  
  // Create effect composer
  const [composer, passes] = useMemo(() => {
    const effectComposer = new EffectComposer(gl);
    effectComposer.setSize(size.width, size.height);
    
    // Render pass (always first)
    const renderPass = new RenderPass(scene, camera);
    effectComposer.addPass(renderPass);
    
    const passRefs: { [key: string]: ShaderPass } = {};
    
    // Bloom pass
    if (enableBloom) {
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(size.width, size.height),
        0.5, // strength
        0.4, // radius
        0.85 // threshold
      );
      effectComposer.addPass(bloomPass);
    }
    
    // Pixelation pass
    if (enablePixelation) {
      const pixelPass = new ShaderPass(PixelationShader);
      pixelPass.uniforms.uResolution.value.set(size.width, size.height);
      pixelPass.uniforms.uPixelSize.value = pixelSize;
      effectComposer.addPass(pixelPass);
      passRefs.pixel = pixelPass;
    }
    
    // Chromatic aberration pass
    if (enableChromatic) {
      const chromaticPass = new ShaderPass(ChromaticAberrationShader);
      chromaticPass.uniforms.uOffset.value = chromaticOffset;
      effectComposer.addPass(chromaticPass);
      passRefs.chromatic = chromaticPass;
    }
    
    // Scanlines pass
    if (enableScanlines) {
      const scanlinesPass = new ShaderPass(ScanlinesShader);
      effectComposer.addPass(scanlinesPass);
      passRefs.scanlines = scanlinesPass;
    }
    
    // Vignette pass
    if (enableVignette) {
      const vignettePass = new ShaderPass(VignetteShader);
      effectComposer.addPass(vignettePass);
      passRefs.vignette = vignettePass;
    }
    
    // Grain pass (always last for best effect)
    if (enableGrain) {
      const grainPass = new ShaderPass(FilmGrainShader);
      grainPass.uniforms.uIntensity.value = grainIntensity;
      effectComposer.addPass(grainPass);
      passRefs.grain = grainPass;
    }
    
    return [effectComposer, passRefs];
  }, [
    gl, scene, camera, size,
    enableChromatic, enableGrain, enableVignette, 
    enablePixelation, enableScanlines, enableBloom,
    chromaticOffset, grainIntensity, pixelSize
  ]);
  
  // Update on resize
  useMemo(() => {
    composer.setSize(size.width, size.height);
    if (passes.pixel) {
      passes.pixel.uniforms.uResolution.value.set(size.width, size.height);
    }
  }, [composer, passes, size]);
  
  // Render loop
  useFrame((state) => {
    // Update time-based uniforms
    if (passes.chromatic) {
      passes.chromatic.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (passes.grain) {
      passes.grain.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (passes.scanlines) {
      passes.scanlines.uniforms.uTime.value = state.clock.elapsedTime;
    }
    
    composer.render();
  }, 1);
  
  return null;
}

export default PostProcessing;

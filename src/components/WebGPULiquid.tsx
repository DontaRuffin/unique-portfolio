import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Simplex noise implementation for the shader
const noiseGLSL = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

// Vertex shader with liquid displacement
const vertexShader = `
  ${noiseGLSL}
  
  uniform float uTime;
  uniform float uNoiseScale;
  uniform float uNoiseStrength;
  uniform vec2 uMouse;
  
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    
    // Create multiple layers of noise for organic movement
    float noise1 = snoise(vec3(position.x * uNoiseScale, position.y * uNoiseScale, uTime * 0.3));
    float noise2 = snoise(vec3(position.x * uNoiseScale * 2.0, position.y * uNoiseScale * 2.0, uTime * 0.5 + 100.0));
    float noise3 = snoise(vec3(position.x * uNoiseScale * 4.0, position.y * uNoiseScale * 4.0, uTime * 0.7 + 200.0));
    
    // Combine noise layers with different weights
    float combinedNoise = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
    
    // Mouse interaction - create ripple effect
    float distToMouse = distance(uv, uMouse);
    float mouseInfluence = smoothstep(0.5, 0.0, distToMouse) * 0.3;
    
    // Calculate elevation
    vElevation = combinedNoise * uNoiseStrength + mouseInfluence * sin(distToMouse * 20.0 - uTime * 3.0);
    
    // Displace position
    vec3 newPosition = position;
    newPosition.z += vElevation;
    
    // Calculate displaced normal for lighting
    float delta = 0.01;
    float nx = snoise(vec3((position.x + delta) * uNoiseScale, position.y * uNoiseScale, uTime * 0.3)) - 
               snoise(vec3((position.x - delta) * uNoiseScale, position.y * uNoiseScale, uTime * 0.3));
    float ny = snoise(vec3(position.x * uNoiseScale, (position.y + delta) * uNoiseScale, uTime * 0.3)) - 
               snoise(vec3(position.x * uNoiseScale, (position.y - delta) * uNoiseScale, uTime * 0.3));
    
    vNormal = normalize(vec3(-nx * 2.0, -ny * 2.0, 1.0));
    vPosition = newPosition;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

// Fragment shader with liquid metal appearance
const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform vec3 uHighlight;
  uniform float uMetalness;
  uniform float uRoughness;
  
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    // Fresnel effect for metallic look
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 3.0);
    
    // Color mixing based on elevation and position
    float colorMix1 = smoothstep(-0.3, 0.3, vElevation);
    float colorMix2 = smoothstep(-0.1, 0.4, vElevation + sin(vUv.x * 10.0 + uTime) * 0.1);
    
    // Three-way color blend
    vec3 baseColor = mix(uColorA, uColorB, colorMix1);
    baseColor = mix(baseColor, uColorC, colorMix2 * 0.5);
    
    // Add highlight based on normal
    float highlight = pow(max(dot(vNormal, vec3(0.5, 0.5, 1.0)), 0.0), 8.0);
    baseColor += uHighlight * highlight * 0.5;
    
    // Metallic reflection
    vec3 reflection = mix(baseColor, uHighlight, fresnel * uMetalness);
    
    // Add subtle iridescence
    float iridescence = sin(vElevation * 20.0 + uTime * 2.0) * 0.5 + 0.5;
    reflection += vec3(iridescence * 0.1, iridescence * 0.05, iridescence * 0.15) * fresnel;
    
    // Output with slight transparency at edges
    float alpha = 0.9 + fresnel * 0.1;
    
    gl_FragColor = vec4(reflection, alpha);
  }
`;

interface LiquidMeshProps {
  colorScheme?: 'brutalist' | 'cyber' | 'sunset' | 'monochrome';
}

function LiquidMesh({ colorScheme = 'brutalist' }: LiquidMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const { viewport } = useThree();
  
  // Color schemes matching Neo-Brutalist aesthetic
  const colorSchemes = {
    brutalist: {
      colorA: new THREE.Color('#FF6B35'), // Brutal Orange
      colorB: new THREE.Color('#7C3AED'), // Brutal Violet
      colorC: new THREE.Color('#000000'), // Black
      highlight: new THREE.Color('#FFFFFF'),
    },
    cyber: {
      colorA: new THREE.Color('#06B6D4'), // Cyan
      colorB: new THREE.Color('#F472B6'), // Pink
      colorC: new THREE.Color('#000000'),
      highlight: new THREE.Color('#A3E635'), // Lime
    },
    sunset: {
      colorA: new THREE.Color('#FF6B35'), // Orange
      colorB: new THREE.Color('#EC4899'), // Pink
      colorC: new THREE.Color('#7C3AED'), // Violet
      highlight: new THREE.Color('#FCD34D'), // Yellow
    },
    monochrome: {
      colorA: new THREE.Color('#000000'),
      colorB: new THREE.Color('#333333'),
      colorC: new THREE.Color('#666666'),
      highlight: new THREE.Color('#FFFFFF'),
    },
  };
  
  const colors = colorSchemes[colorScheme];
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uNoiseScale: { value: 1.5 },
    uNoiseStrength: { value: 0.4 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uColorA: { value: colors.colorA },
    uColorB: { value: colors.colorB },
    uColorC: { value: colors.colorC },
    uHighlight: { value: colors.highlight },
    uMetalness: { value: 0.9 },
    uRoughness: { value: 0.1 },
  }), [colors]);
  
  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Smooth mouse following
      const targetX = (state.pointer.x + 1) / 2;
      const targetY = (state.pointer.y + 1) / 2;
      mouseRef.current.x += (targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetY - mouseRef.current.y) * 0.05;
      material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
    }
  });
  
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 6, 0, 0]} position={[0, 0, -1]}>
      <planeGeometry args={[viewport.width * 1.5, viewport.height * 1.5, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Particle system that floats above the liquid
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 100;
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = Math.random() * 2;
      
      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    
    return [pos, vel];
  }, []);
  
  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];
        
        // Wrap around
        if (positions[i * 3] > 5) positions[i * 3] = -5;
        if (positions[i * 3] < -5) positions[i * 3] = 5;
        if (positions[i * 3 + 1] > 3) positions[i * 3 + 1] = -3;
        if (positions[i * 3 + 1] < -3) positions[i * 3 + 1] = 3;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#000000"
        size={0.03}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Grid overlay for brutalist aesthetic
function GridOverlay() {
  const gridRef = useRef<THREE.LineSegments>(null);
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const gridSize = 20;
    const divisions = 40;
    const step = gridSize / divisions;
    
    // Vertical lines
    for (let i = 0; i <= divisions; i++) {
      const x = -gridSize / 2 + i * step;
      positions.push(x, -gridSize / 2, 0.1);
      positions.push(x, gridSize / 2, 0.1);
    }
    
    // Horizontal lines
    for (let i = 0; i <= divisions; i++) {
      const y = -gridSize / 2 + i * step;
      positions.push(-gridSize / 2, y, 0.1);
      positions.push(gridSize / 2, y, 0.1);
    }
    
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);
  
  return (
    <lineSegments ref={gridRef} geometry={geometry} rotation={[-Math.PI / 6, 0, 0]} position={[0, 0, -0.5]}>
      <lineBasicMaterial color="#000000" transparent opacity={0.05} />
    </lineSegments>
  );
}

interface WebGPULiquidProps {
  colorScheme?: 'brutalist' | 'cyber' | 'sunset' | 'monochrome';
  showGrid?: boolean;
  showParticles?: boolean;
  className?: string;
}

export default function WebGPULiquid({ 
  colorScheme = 'brutalist',
  showGrid = true,
  showParticles = true,
  className = ''
}: WebGPULiquidProps) {
  return (
    <div className={`absolute inset-0 -z-10 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, 5]} intensity={0.4} color="#FF6B35" />
        
        <LiquidMesh colorScheme={colorScheme} />
        {showGrid && <GridOverlay />}
        {showParticles && <FloatingParticles />}
      </Canvas>
    </div>
  );
}

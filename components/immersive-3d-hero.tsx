"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  OrbitControls, 
  Stars, 
  Float, 
  Text3D, 
  Center,
  MeshDistortMaterial,
  Sphere,
  Trail,
  useTexture,
  Html
} from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MousePointer2, Volume2, VolumeX, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

// Floating geometric shapes
function FloatingShape({ 
  position, 
  color, 
  shape = "box",
  speed = 1 
}: { 
  position: [number, number, number]; 
  color: string; 
  shape?: "box" | "sphere" | "torus" | "icosahedron";
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
    }
  });

  const geometry = useMemo(() => {
    switch (shape) {
      case "sphere": return <sphereGeometry args={[0.8, 32, 32]} />;
      case "torus": return <torusGeometry args={[0.6, 0.2, 16, 100]} />;
      case "icosahedron": return <icosahedronGeometry args={[0.7, 0]} />;
      default: return <boxGeometry args={[1, 1, 1]} />;
    }
  }, [shape]);

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.3 : 1}
      >
        {geometry}
        <MeshDistortMaterial
          color={color}
          distort={hovered ? 0.4 : 0.2}
          speed={3}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>
    </Float>
  );
}

// Particle field
function ParticleField({ count = 100 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.05;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#8b5cf6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Animated blob
function AnimatedBlob() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={[0, 0, 0]} scale={2}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#6366f1"
          distort={0.5}
          speed={2}
          roughness={0.1}
          metalness={0.9}
          emissive="#4f46e5"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

// Interactive cursor follower
function CursorFollower() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, mouse } = useThree();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = mouse.x * viewport.width * 0.5;
      meshRef.current.position.y = mouse.y * viewport.height * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 2]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} />
    </mesh>
  );
}

// 3D Text
function HeroText() {
  const textRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={textRef} position={[0, 2, -3]}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.8}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          NEMO
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.9}
            roughness={0.1}
            emissive="#6366f1"
            emissiveIntensity={0.2}
          />
        </Text3D>
      </Center>
    </group>
  );
}

// Shooting stars
function ShootingStars() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.position.x -= 0.1 * (i + 1);
        if (child.position.x < -15) {
          child.position.x = 15;
          child.position.y = (Math.random() - 0.5) * 10;
          child.position.z = (Math.random() - 0.5) * 10;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[10 + i * 3, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
          <Trail width={2} length={4} color="#ffffff" attenuation={(t) => t * t}>
            <mesh position={[0.5, 0, 0]}>
              <sphereGeometry args={[0.02, 4, 4]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
            </mesh>
          </Trail>
        </mesh>
      ))}
    </group>
  );
}

// Main 3D Scene
function Scene({ audioEnabled }: { audioEnabled: boolean }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#6366f1" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />
      <pointLight position={[10, -10, 10]} intensity={0.5} color="#06b6d4" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.5} fade speed={1} />
      
      <ParticleField count={200} />
      
      <AnimatedBlob />
      
      <FloatingShape position={[-4, 1, -2]} color="#ec4899" shape="box" speed={1.2} />
      <FloatingShape position={[4, -1, -3]} color="#06b6d4" shape="sphere" speed={0.8} />
      <FloatingShape position={[-3, -2, 1]} color="#f59e0b" shape="torus" speed={1.5} />
      <FloatingShape position={[3, 2, -1]} color="#8b5cf6" shape="icosahedron" speed={1} />
      <FloatingShape position={[0, -3, -2]} color="#10b981" shape="box" speed={0.6} />
      
      <ShootingStars />
      
      <CursorFollower />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

// Easter egg component
function EasterEgg({ found, onClose }: { found: boolean; onClose: () => void }) {
  if (!found) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-3xl text-center max-w-md mx-4"
        initial={{ rotate: -10 }}
        animate={{ rotate: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <Sparkles className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
        <h2 className="text-3xl font-bold text-white mb-2">Secret Found! 🎉</h2>
        <p className="text-white/80 mb-4">
          You discovered the hidden 3D realm! The shapes respond to your presence.
        </p>
        <p className="text-sm text-white/60">
          Try clicking and dragging to explore from different angles.
        </p>
      </motion.div>
    </motion.div>
  );
}

export function Immersive3DHero() {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (clickCount >= 5 && !showEasterEgg) {
      setShowEasterEgg(true);
    }
  }, [clickCount, showEasterEgg]);

  const handleCanvasClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* 3D Canvas */}
      <div className="absolute inset-0" onClick={handleCanvasClick}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene audioEnabled={audioEnabled} />
        </Canvas>
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Nemo
              </span>
            </h1>
            <p className="text-white/70 text-lg mt-2">Creative Developer</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2 pointer-events-auto"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
          </motion.div>
        </div>

        {/* Center hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
            >
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <MousePointer2 className="w-4 h-4" />
                <span>Click shapes to interact • Drag to rotate</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-0 left-0 right-0 p-6 pointer-events-auto"
        >
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white/60 text-sm">
              <p>Built with Three.js + React Three Fiber</p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              >
                Explore More
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                onClick={() => window.location.href = '/contact'}
              >
                Get in Touch
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Click counter easter egg hint */}
        {clickCount > 0 && clickCount < 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/40 text-xs"
          >
            {5 - clickCount} more clicks to unlock secret...
          </motion.div>
        )}
      </div>

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* Easter Egg Modal */}
      <AnimatePresence>
        {showEasterEgg && (
          <EasterEgg found={showEasterEgg} onClose={() => setShowEasterEgg(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}

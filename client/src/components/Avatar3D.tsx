import { useRef, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import beautifulGirl from '../assets/beautiful-girl.jpg';

// 3D Beautiful Girl Avatar Component - Static
function BeautifulGirlMesh({ isActive = false }: { isActive?: boolean }) {
  const texture = useLoader(THREE.TextureLoader, beautifulGirl);

  return (
    <mesh position={[0, 0, 0]}>
      <circleGeometry args={[1.2, 64]} />
      <meshPhongMaterial 
        map={texture}
        transparent
        opacity={0.98}
        side={THREE.DoubleSide}
      />
      
      {/* Subtle glowing rim effect */}
      <mesh position={[0, 0, -0.01]}>
        <ringGeometry args={[1.15, 1.25, 64]} />
        <meshBasicMaterial 
          color={isActive ? "#60EFFF" : "#A855F7"}
          transparent
          opacity={0.4}
        />
      </mesh>
    </mesh>
  );
}

interface Avatar3DProps {
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
  className?: string;
}

export default function Avatar3D({ size = 'md', isActive = false, className = '' }: Avatar3DProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48',
    lg: 'w-96 h-96'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className} relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        scale: isHovered ? 1.05 : 1,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-zeo-primary to-zeo-secondary opacity-20 blur-xl animate-pulse" />
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        className="rounded-full"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#A855F7" />
        <BeautifulGirlMesh isActive={isActive || isHovered} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>

      {/* Pulse rings */}
      {isActive && (
        <div className="absolute inset-0 rounded-full">
          <div className="absolute inset-0 rounded-full border-2 border-zeo-primary animate-ping opacity-75" />
          <div className="absolute inset-4 rounded-full border border-zeo-secondary animate-ping opacity-50" style={{ animationDelay: '0.5s' }} />
        </div>
      )}
    </motion.div>
  );
}
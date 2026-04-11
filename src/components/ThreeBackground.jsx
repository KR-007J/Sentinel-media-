import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 3000 }) {
  const mesh = useRef();
  const light = useRef();

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.005 + Math.random() / 400; // Slowed down for professional feel
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t) * 0.5 + 0.5; // Scale pulsing
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s * 0.5, s * 0.5, s * 0.5);
      dummy.rotation.set(s * 2, s * 2, s * 2);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <pointLight ref={light} distance={40} intensity={10} color="#00f3ff" />
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <dodecahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial color="#00f3ff" roughness={0} metalness={1} emissive="#00f3ff" emissiveIntensity={2} />
      </instancedMesh>
    </>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 80], fov: 60 }}>
        <fog attach="fog" args={['#050505', 40, 120]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[100, 10, -50]} intensity={15} color="#bc13fe" />
        <pointLight position={[-100, -100, -100]} intensity={5} color="#00f3ff" />
        <Particles />
      </Canvas>
    </div>
  );
}

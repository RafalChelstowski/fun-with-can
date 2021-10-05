import { useRef } from 'react';

import { Object3DNode } from '@react-three/fiber';
import * as THREE from 'three';

type RefObject = Object3DNode<
  THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>,
  typeof THREE.Mesh
>;

interface CubeProps {
  position: [x: number, y: number, z: number];
}

export function Cube({ position }: CubeProps): JSX.Element {
  const meshRef = useRef<RefObject | null>(null);

  return (
    <mesh ref={meshRef} position={position}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" roughness={0.4} />
    </mesh>
  );
}

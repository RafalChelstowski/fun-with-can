import { useEffect, useState } from 'react';

import { a, useSpring } from '@react-spring/three';
import { Triplet, useBox } from '@react-three/cannon';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Mesh } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { degToRad } from 'three/src/math/MathUtils';

import { glassMaterial } from '../../../common/materials/materials';

type GLTFResult = GLTF & {
  nodes: {
    window_bound: THREE.Mesh;
    Cylinder002: THREE.Mesh;
    Cylinder002_1: THREE.Mesh;
    Cylinder002_2: THREE.Mesh;
  };
  materials: {
    elementsMaterial: THREE.MeshStandardMaterial;
    glassMaterial: THREE.MeshStandardMaterial;
    whiteMaterial: THREE.MeshStandardMaterial;
  };
};

export function InteractiveWindow(): JSX.Element {
  const { nodes, materials } = useGLTF('/window.gltf') as unknown as GLTFResult;
  const texture = useTexture('/elements.jpg');

  const [windowOpen, toggleWindowOpen] = useState(0);
  const { spring } = useSpring({
    spring: windowOpen,
    config: { mass: 20, tension: 400, friction: 300, precision: 0.0001 },
  });
  const rotation = spring.to([0, 1], [0, degToRad(65)]);

  const { position, geometry, scale } = nodes.window_bound;
  const box = new THREE.Box3().setFromObject(nodes.window_bound);
  const dimensions: Triplet = [
    box.max.x - box.min.x,
    box.max.y - box.min.y,
    box.max.z - box.min.z,
  ];

  const [ref, api] = useBox<Mesh>(() => ({
    type: 'Static',
    position: [...position.toArray()],
    args: dimensions,
  }));

  useEffect(() => {
    if (windowOpen) {
      const { x, y, z } = position;
      api.position.set(x, y + 5, z);
    }
  }, [api.position, position, windowOpen]);

  return (
    <group dispose={null}>
      <mesh ref={ref} geometry={geometry} scale={scale}>
        <meshBasicMaterial visible={false} />
      </mesh>
      <a.group
        position={[-2.99, 1.57, -5.26]}
        rotation-y={rotation}
        onClick={(e) => {
          e.stopPropagation();
          if (e.distance > 1.5) {
            return;
          }

          toggleWindowOpen(Number(!windowOpen));
          // addAchievement(AchievementName.TEST);
        }}
      >
        <mesh geometry={nodes.Cylinder002.geometry}>
          <meshStandardMaterial
            map={texture}
            // normalMap={normalMap}
            // metalnessMap={metalMap}
            // normalScale={new THREE.Vector2(1, 1)}
            // roughnessMap={roughnessMap}
          />
        </mesh>
        <mesh
          geometry={nodes.Cylinder002_1.geometry}
          material={glassMaterial}
        />
        <mesh
          geometry={nodes.Cylinder002_2.geometry}
          material={materials.whiteMaterial}
        />
      </a.group>
    </group>
  );
}

useGLTF.preload('/window.gltf');

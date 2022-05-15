import { useState } from 'react';

import { a, useSpring } from '@react-spring/three';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
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

  return (
    <group dispose={null}>
      {/* <mesh
        geometry={nodes.window_bound.geometry}
        material={nodes.window_bound.material}
        position={[-3.06, 1.57, -4.91]}
      /> */}
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

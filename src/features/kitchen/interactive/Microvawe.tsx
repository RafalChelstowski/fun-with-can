import { useState } from 'react';

import { a, useSpring } from '@react-spring/three';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { degToRad } from 'three/src/math/MathUtils';

type GLTFResult = GLTF & {
  nodes: {
    Cube192: THREE.Mesh;
    Cube192_1: THREE.Mesh;
    Cube193: THREE.Mesh;
    Cube193_1: THREE.Mesh;
  };
  materials: {
    elementsMaterial: THREE.MeshStandardMaterial;
    steelMaterial: THREE.MeshStandardMaterial;
    blackPlasticMaterial: THREE.MeshStandardMaterial;
  };
};

export function Microwave(): JSX.Element {
  const { nodes, materials } = useGLTF(
    '/microvawe.gltf'
  ) as unknown as GLTFResult;

  const texture = useTexture('/elements.jpg');

  const [microwaveOpen, toggleMicrowaveOpen] = useState(0);
  const { spring } = useSpring({
    spring: microwaveOpen,
    config: { mass: 20, tension: 400, friction: 300, precision: 0.0001 },
  });
  const rotation = spring.to([0, 1], [0, degToRad(-115)]);

  return (
    <group dispose={null}>
      <group position={[-2.76, 0.85, -3.42]}>
        <mesh geometry={nodes.Cube192.geometry}>
          <meshStandardMaterial
            map={texture}
            // normalMap={normalMap}
            // metalnessMap={metalMap}
            // normalScale={new THREE.Vector2(1, 1)}
            // roughnessMap={roughnessMap}
          />
        </mesh>
        <mesh
          geometry={nodes.Cube192_1.geometry}
          material={materials.steelMaterial}
        />
      </group>
      <a.group
        position={[-2.69, 0.86, -3.2]}
        rotation-y={rotation}
        onClick={(e) => {
          e.stopPropagation();
          if (e.distance > 1.5) {
            return;
          }

          toggleMicrowaveOpen(Number(!microwaveOpen));
          // addAchievement(AchievementName.TEST);
        }}
      >
        <mesh geometry={nodes.Cube193.geometry}>
          <meshStandardMaterial
            map={texture}
            // normalMap={normalMap}
            // metalnessMap={metalMap}
            // normalScale={new THREE.Vector2(1, 1)}
            // roughnessMap={roughnessMap}
          />
        </mesh>
        <mesh
          geometry={nodes.Cube193_1.geometry}
          material={materials.blackPlasticMaterial}
        />
      </a.group>
    </group>
  );
}

useGLTF.preload('/microvawe.gltf');

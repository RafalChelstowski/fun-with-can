import { useState } from 'react';

import { a, useSpring } from '@react-spring/three';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { degToRad } from 'three/src/math/MathUtils';

type GLTFResult = GLTF & {
  nodes: {
    bake_shelfDoors: THREE.Mesh;
    cupboard: THREE.Mesh;
  };
};

export function Cupboard(): JSX.Element {
  const { nodes } = useGLTF('/cupboard.gltf') as unknown as GLTFResult;
  const texture = useTexture('/elements.jpg');
  const [cupboardOpen, toggleCupboardOpen] = useState(0);
  const { spring } = useSpring({
    spring: cupboardOpen,
    config: { mass: 20, tension: 400, friction: 300, precision: 0.0001 },
  });
  const rotation = spring.to([0, 1], [0, degToRad(65)]);
  // const { addAchievement } = useAchievement();

  return (
    <>
      <a.group
        position={nodes.bake_shelfDoors.position}
        rotation-y={rotation}
        onClick={(e) => {
          e.stopPropagation();
          if (e.distance > 1.5) {
            return;
          }

          toggleCupboardOpen(Number(!cupboardOpen));
          // addAchievement(AchievementName.TEST);
        }}
      >
        <mesh geometry={nodes.bake_shelfDoors.geometry}>
          <meshStandardMaterial
            map={texture}
            // normalMap={normalMap}
            // metalnessMap={metalMap}
            // normalScale={new THREE.Vector2(1, 1)}
            // roughnessMap={roughnessMap}
          />
        </mesh>
      </a.group>
      <mesh
        geometry={nodes.cupboard.geometry}
        material={nodes.cupboard.material}
        position={nodes.cupboard.position}
      />
    </>
  );
}

useGLTF.preload('/cupboard.gltf');

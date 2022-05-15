import { useState } from 'react';

import { a, useSpring } from '@react-spring/three';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// import { useAchievement } from '../../../api/hooks/useAchievement';

type GLTFResult = GLTF & {
  nodes: {
    Cube165: THREE.Mesh;
    Cube165_1: THREE.Mesh;
  };
  materials: {
    elementsMaterial: THREE.MeshStandardMaterial;
    woodMaterial: THREE.MeshStandardMaterial;
  };
};

export function Drawer(): JSX.Element {
  const { nodes, materials } = useGLTF('/drawer.gltf') as unknown as GLTFResult;
  const texture = useTexture('/elements.jpg');

  const [drawerOpen, toggleDrawerOpen] = useState(0);

  const { spring } = useSpring({
    spring: drawerOpen,
    config: { mass: 10, tension: 300, friction: 300, precision: 0.0001 },
  });
  const positionX = spring.to([0, 1], [2.42, 2.2]);
  // const { addAchievement } = useAchievement()

  return (
    <group dispose={null}>
      <a.group
        onClick={(e) => {
          e.stopPropagation();
          if (e.distance > 1.5) {
            return;
          }

          toggleDrawerOpen(Number(!drawerOpen));
          // addAchievement(AchievementName.TEST);
        }}
        position={[2.42, 0.75, 0.245]}
        position-x={positionX}
      >
        <mesh geometry={nodes.Cube165.geometry}>
          <meshStandardMaterial
            map={texture}
            // normalMap={normalMap}
            // metalnessMap={metalMap}
            // normalScale={new THREE.Vector2(1, 1)}
            // roughnessMap={roughnessMap}
          />
        </mesh>
        <mesh
          geometry={nodes.Cube165_1.geometry}
          material={materials.woodMaterial}
        />
      </a.group>
    </group>
  );
}

useGLTF.preload('/drawer.gltf');

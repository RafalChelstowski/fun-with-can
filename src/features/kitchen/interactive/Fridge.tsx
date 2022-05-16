import { useState } from 'react';

import { a, useSpring } from '@react-spring/three';
import { useGLTF, useTexture } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { degToRad } from 'three/src/math/MathUtils';

import { useAchievement } from '../../../api/hooks/useAchievement';
import { glassMaterial } from '../../../common/materials/materials';
import { AchievementName } from '../../../types';

type GLTFResult = GLTF & {
  nodes: {
    Cube010: THREE.Mesh;
    Cube010_1: THREE.Mesh;
    Cube010_2: THREE.Mesh;
    fridgeInside: THREE.Mesh;
    glass: THREE.Mesh;
  };
};

export function Fridge(): JSX.Element {
  const { nodes } = useGLTF('/fridge.gltf') as unknown as GLTFResult;
  const texture = useTexture('/elements.jpg');
  const [fridgeOpen, toggleFridgeOpen] = useState(0);
  const { spring } = useSpring({
    spring: fridgeOpen,
    config: { mass: 20, tension: 400, friction: 300, precision: 0.0001 },
  });
  const rotation = spring.to([0, 1], [0, degToRad(88)]);
  const { addAchievement } = useAchievement();

  return (
    <>
      <a.group
        position={[2.72, 1, -3.52]}
        rotation-y={rotation}
        onClick={(e) => {
          e.stopPropagation();
          if (e.distance > 1.5) {
            return;
          }

          toggleFridgeOpen(Number(!fridgeOpen));
          addAchievement(AchievementName.TEST);
        }}
      >
        <mesh geometry={nodes.Cube010.geometry}>
          <meshStandardMaterial
            map={texture}
            // normalMap={normalMap}
            // metalnessMap={metalMap}
            // normalScale={new THREE.Vector2(1, 1)}
            // roughnessMap={roughnessMap}
          />
        </mesh>
        <mesh geometry={nodes.Cube010_1.geometry}>
          <meshPhongMaterial color="white" />
        </mesh>
        <mesh geometry={nodes.Cube010_2.geometry} material={glassMaterial} />
      </a.group>

      <mesh
        geometry={nodes.fridgeInside.geometry}
        material={nodes.fridgeInside.material}
        position={[3.08, 1.48, -4.16]}
      >
        <meshPhongMaterial color="white" />
      </mesh>
      <mesh
        geometry={nodes.glass.geometry}
        position={[1.58, 0.33, -3.82]}
        material={glassMaterial}
      />
    </>
  );
}

useGLTF.preload('/fridge.gltf');

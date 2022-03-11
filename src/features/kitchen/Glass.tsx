import { Suspense } from 'react';

import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, unknown>;
};

type Props = JSX.IntrinsicElements['group'];

export function Glass(props: Props): JSX.Element {
  const { nodes } = useGLTF('/glass.gltf') as unknown as GLTFResult;

  // const meshes =;

  return (
    <group {...props} dispose={null}>
      <Suspense fallback={null}>
        {Object.entries(nodes)
          .filter((mesh) => mesh[1].type === 'Mesh')
          .map(([key, mesh]) => {
            return (
              <mesh
                key={key}
                position={mesh.position}
                rotation={mesh.rotation}
                geometry={mesh.geometry}
                scale={mesh.scale}
              >
                <Suspense fallback={<meshStandardMaterial />}>
                  <meshPhysicalMaterial
                    metalness={0.35}
                    roughness={0}
                    transmission={1}
                    thickness={0.08}
                  />
                </Suspense>
              </mesh>
            );
          })}
      </Suspense>
    </group>
  );
}

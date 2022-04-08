import { Suspense } from 'react';

import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import { glassMaterial } from '../../common/materials';

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, unknown>;
};

export function Glass(): JSX.Element {
  const { nodes } = useGLTF('/glass.gltf') as unknown as GLTFResult;

  return (
    <group dispose={null}>
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
                material={glassMaterial}
                scale={mesh.scale}
              />
            );
          })}
      </Suspense>
    </group>
  );
}

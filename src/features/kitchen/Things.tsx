import { Suspense } from 'react';

import { useGLTF, useTexture } from '@react-three/drei';
// import { useXR } from '@react-three/xr';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, unknown>;
};

type Props = JSX.IntrinsicElements['group'];

export function Things(props: Props): JSX.Element {
  //   const { isPresenting } = useXR();
  const texture = useTexture('/things.jpg');
  texture.flipY = false;
  texture.encoding = THREE.sRGBEncoding;
  const { nodes } = useGLTF('/things.gltf') as unknown as GLTFResult;

  const meshes = Object.entries(nodes)
    .filter((mesh) => mesh[1].type === 'Mesh')
    .map((node) => {
      const [key, mesh] = node;
      return (
        <mesh
          key={key}
          position={mesh.position}
          rotation={mesh.rotation}
          geometry={mesh.geometry}
          scale={mesh.scale}
        >
          <Suspense fallback={<meshStandardMaterial />}>
            <meshBasicMaterial map={texture} />
          </Suspense>
        </mesh>
      );
    });

  return (
    <group {...props} dispose={null}>
      <Suspense fallback={null}>{meshes}</Suspense>
    </group>
  );
}

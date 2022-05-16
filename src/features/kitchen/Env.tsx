import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, unknown>;
};

export function Env(): JSX.Element {
  const { nodes } = useGLTF('/env.gltf') as unknown as GLTFResult;

  return (
    <>
      {Object.entries(nodes)
        .filter((mesh) => mesh[1].type === 'Mesh')
        .map((node) => {
          const [key, mesh] = node;
          return (
            <mesh
              key={key}
              position={mesh.position}
              rotation={mesh.rotation}
              geometry={mesh.geometry}
              material={mesh.material}
              scale={mesh.scale}
            />
          );
        })}
    </>
  );
}

useGLTF.preload('/env.gltf');

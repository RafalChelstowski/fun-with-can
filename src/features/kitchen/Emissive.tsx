import { useGLTF } from '@react-three/drei';

import { GLTFResult } from '../../types';

export function Emissive(): JSX.Element {
  const { nodes } = useGLTF('/emissive.gltf') as unknown as GLTFResult;

  return (
    <>
      {Object.entries(nodes).map((node) => {
        const [key, mesh] = node;

        return (
          <mesh
            key={key}
            position={mesh.position}
            rotation={mesh.rotation}
            geometry={mesh.geometry}
            scale={mesh.scale}
            name={`emissive-${mesh.name}`}
          >
            <meshStandardMaterial emissive="white" />
          </mesh>
        );
      })}
    </>
  );
}

useGLTF.preload('/emissive.gltf');

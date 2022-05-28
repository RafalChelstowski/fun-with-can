import { useGLTF } from '@react-three/drei';

import { GLTFResult } from '../../types';
import { useKitchenGltf } from './useKitchenGltf';

export function KitchenModel(): JSX.Element {
  const { nodes } = useGLTF('/kitchen.gltf') as unknown as GLTFResult;
  const { kitchenMaterial } = useKitchenGltf();

  return (
    <group name="nonInteractive">
      {Object.entries(nodes)
        .filter(
          (mesh) =>
            mesh[1].type === 'Mesh' && !mesh[1].name.includes('interactive')
        )
        .map((node) => {
          const [key, mesh] = node;

          return (
            <mesh
              key={key}
              position={mesh.position}
              rotation={mesh.rotation}
              geometry={mesh.geometry}
              scale={mesh.scale}
              name={`area-${mesh.name}`}
              // onClick={(e) => {
              //   e.stopPropagation();
              // }}
            >
              {kitchenMaterial}
            </mesh>
          );
        })}
    </group>
  );
}

useGLTF.preload('/kitchen.gltf');

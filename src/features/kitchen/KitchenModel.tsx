import { useGLTF } from '@react-three/drei';

import { useStore } from '../../store/store';
import { GLTFResult } from '../../types';
import { useKitchenGltf } from './useKitchenGltf';

export function KitchenModel(): JSX.Element {
  const { nodes } = useGLTF('/kitchen.gltf') as unknown as GLTFResult;
  const { kitchenMaterial } = useKitchenGltf();
  const lights = useStore((state) => state.gfxSettings.lights);

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
              receiveShadow={lights === 3}
              key={key}
              position={mesh.position}
              rotation={mesh.rotation}
              geometry={mesh.geometry}
              scale={mesh.scale}
              name={`area-${mesh.name}`}
            >
              {kitchenMaterial}
            </mesh>
          );
        })}
    </group>
  );
}

useGLTF.preload('/kitchen.gltf');

import { useGLTF } from '@react-three/drei';

import { glassMaterial } from '../../common/materials/materials';
import { useStore } from '../../store/store';
import { GLTFResult } from '../../types';

export function Glass(): JSX.Element | null {
  const { nodes } = useGLTF('/glass.gltf') as unknown as GLTFResult;
  const glass = useStore((state) => state.gfxSettings.glass);

  if (!glass) {
    return null;
  }

  return (
    <>
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
              name={`area-${mesh.name}`}
            />
          );
        })}
    </>
  );
}

useGLTF.preload('/glass.gltf');

import { Ref } from 'react';

import { usePlane } from '@react-three/cannon';
import { BufferGeometry, Material, Mesh } from 'three';

export function Floor(): JSX.Element {
  const [ref] = usePlane(() => ({
    position: [0, 0, 0],
    rotation: [-Math.PI / 2, 0, 0],
    type: 'Static',
  }));

  return (
    <mesh
      ref={
        ref as unknown as
          | Ref<Mesh<BufferGeometry, Material | Material[]>>
          | undefined
      }
    >
      <planeBufferGeometry args={[100, 100]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
}

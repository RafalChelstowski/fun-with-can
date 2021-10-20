import { useRef } from 'react';

import { useCylinder } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
};

export function Cylinders({ num }: { num: number }): JSX.Element {
  const { nodes, materials } = useGLTF('/can_uv.gltf') as unknown as GLTFResult;
  const [ref, api] = useCylinder(() => ({
    mass: 1,
    args: [0.08, 0.08, 0.18, 5],
    position: [0, 30 * Math.random(), 0],
    rotation: [Math.random(), Math.random(), Math.random()],
    allowSleep: false,
  }));

  const prevTime = useRef(0);
  const currentTime = useRef<number>();

  useFrame(({ clock }) => {
    currentTime.current = clock.getElapsedTime();

    if (currentTime.current - prevTime.current > 0.4) {
      api
        .at(Math.floor(Math.random() * num))
        .position.set(0, 30 + Math.random() * 2, 0);
      prevTime.current = clock.getElapsedTime();
    }
  });

  return (
    <group>
      <instancedMesh
        ref={ref}
        name="Can"
        args={[undefined, undefined, num]}
        material={materials.harnasblue}
        geometry={nodes.Cylinder.geometry}
        castShadow
      />
    </group>
  );
}

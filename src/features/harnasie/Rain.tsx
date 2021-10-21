import { useEffect, useRef } from 'react';

import { useCylinder } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
};

export function Rain({ num }: { num: number }): JSX.Element {
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

export function Static({ num }: { num: number }): JSX.Element {
  const { nodes, materials } = useGLTF('/can_uv.gltf') as unknown as GLTFResult;
  const [ref, api] = useCylinder(() => ({
    mass: 1,
    args: [0.08, 0.08, 0.18, 5],
    position: [0, 0, 0],
    allowSleep: false,
  }));

  useEffect(() => {
    const grid: number[][][] = Array.from({ length: num / 5 }).map(() => []);
    Array.from({ length: num }).forEach((_, idx) => {
      const gridIdx = Math.floor(idx / 5);
      grid[gridIdx].push([gridIdx, idx - gridIdx * 5]);
    });

    Array.from({ length: num }).forEach((_, i) => {
      const gridIdx = Math.floor(i / 5);
      const [x, z] = grid[gridIdx][i - gridIdx * 5];

      api.at(i).position.set(1 + x * 0.15, 1, 0.3 + z * 0.15);
    });
  }, [api, api.at, num]);

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

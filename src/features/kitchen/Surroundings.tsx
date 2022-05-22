import { useGLTF } from '@react-three/drei';

import { GLTFResult } from '../../types';

export function Surroundings(): JSX.Element {
  const { nodes, materials } = useGLTF(
    '/surroundings.gltf'
  ) as unknown as GLTFResult;

  return (
    <>
      <mesh
        geometry={nodes.tree.geometry}
        material={nodes.tree.material}
        position={[-28.43, -5, 35.49]}
        scale={1.27}
      >
        <mesh
          geometry={nodes.leaves.geometry}
          material={nodes.leaves.material}
        />
      </mesh>
      <mesh
        geometry={nodes.tree001.geometry}
        material={nodes.tree001.material}
        position={[-38.86, -5.22, 48.86]}
        scale={1.23}
      >
        <mesh
          geometry={nodes.leaves001.geometry}
          material={nodes.leaves001.material}
        />
      </mesh>
      <mesh
        geometry={nodes.Cube046.geometry}
        material={materials.fenceMaterial}
        position={[-22.94, -4.61, 87.38]}
      />
      <mesh
        geometry={nodes.Cube047.geometry}
        material={materials.parkingMaterial}
        position={[-51.6, -1.76, -64.53]}
        rotation={[0, -0.11, 0]}
      />
      <mesh
        geometry={nodes.Plane.geometry}
        material={materials.outerPlaneMaterial}
        position={[-4.21, -4.16, -50.46]}
      />
      <mesh
        geometry={nodes.Plane016.geometry}
        material={materials.grassMaterial}
        position={[-4.21, -4.16, -50.46]}
      />
    </>
  );
}

useGLTF.preload('/surroundings.gltf');

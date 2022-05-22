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
        material={materials.parkingMaterial}
        position={[-29.41, -5.02, 36.74]}
      >
        <mesh
          geometry={nodes.leaves.geometry}
          material={materials.parkingMaterial}
        />
      </mesh>
      <mesh
        geometry={nodes.tree001.geometry}
        material={materials.parkingMaterial}
        position={[-37.88, -5.2, 47.61]}
      >
        <mesh
          geometry={nodes.leaves001.geometry}
          material={materials.parkingMaterial}
        />
      </mesh>
      <mesh
        geometry={nodes.Cube143.geometry}
        material={materials.parkingMaterial}
        position={[-39.59, 4.39, 34.62]}
        rotation={[0, -0.11, 0]}
      />
      <mesh
        geometry={nodes.Cube047.geometry}
        material={materials.parkingMaterial}
        position={[-38.85, 5.46, 35.49]}
        rotation={[0, -0.11, 0]}
      />
      <mesh
        geometry={nodes.Cube046.geometry}
        material={materials.parkingMaterial}
        position={[-22.94, -4.61, 87.38]}
      />
      <mesh
        geometry={nodes.Cube144.geometry}
        material={materials.parkingMaterial}
        position={[-41.1, 10.93, 31.18]}
        rotation={[0, -0.11, 0]}
      />
      <mesh
        geometry={nodes.Cube145.geometry}
        material={materials.parkingMaterial}
        position={[-46.24, 1.75, 36.56]}
        rotation={[0, -0.11, 0]}
      />
      <mesh
        geometry={nodes.Cube146.geometry}
        material={materials.parkingMaterial}
        position={[-51.44, -2.03, -64.51]}
        rotation={[0, -0.11, 0]}
      />
      <mesh
        geometry={nodes.Cube147.geometry}
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
        material={materials.parkingMaterial}
        position={[-4.21, -4.16, -50.46]}
      />
    </>
  );
}

useGLTF.preload('/surroundings.gltf');

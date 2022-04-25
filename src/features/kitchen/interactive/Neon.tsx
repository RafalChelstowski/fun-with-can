import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import { disabledNeonMaterial } from '../../../common/materials/materials';
import { useStore } from '../../../store/store';
import { InteractiveObjectStatus } from '../../../types';

type GLTFResult = GLTF & {
  nodes: {
    NurbsPath001: THREE.Mesh;
    NurbsPath002: THREE.Mesh;
    NurbsPath003: THREE.Mesh;
    Cube108: THREE.Mesh;
    Cube109: THREE.Mesh;
    Cube110: THREE.Mesh;
    Cube111: THREE.Mesh;
    Cube112: THREE.Mesh;
    Cube113: THREE.Mesh;
    NurbsPath: THREE.Mesh;
    NurbsPath004: THREE.Mesh;
    Cube114: THREE.Mesh;
    NurbsPath005: THREE.Mesh;
    NurbsPath006: THREE.Mesh;
    NurbsPath007: THREE.Mesh;
    Cube115: THREE.Mesh;
    NurbsPath008: THREE.Mesh;
  };
  materials: {
    neonMaterialWhite: THREE.MeshStandardMaterial;
    neonMaterialGreen: THREE.MeshStandardMaterial;
    neonMaterialPurple: THREE.MeshStandardMaterial;
    blackPlasticMaterial: THREE.MeshStandardMaterial;
  };
};

export function Neon({
  ...props
}: JSX.IntrinsicElements['group']): JSX.Element {
  const { nodes, materials } = useGLTF('/neon.gltf') as unknown as GLTFResult;
  const neonOn =
    useStore((state) => state.interactiveObjects.neon.status) ===
    InteractiveObjectStatus.ON;

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.NurbsPath001.geometry}
        material={neonOn ? materials.neonMaterialWhite : disabledNeonMaterial}
        position={[5.29, 1.06, -2.66]}
      />
      <mesh
        geometry={nodes.NurbsPath002.geometry}
        material={neonOn ? materials.neonMaterialGreen : disabledNeonMaterial}
        position={[5.29, 1.06, -2.66]}
      />
      <mesh
        geometry={nodes.NurbsPath003.geometry}
        material={neonOn ? materials.neonMaterialPurple : disabledNeonMaterial}
        position={[5.29, 1.06, -2.66]}
      />
      <mesh
        geometry={nodes.Cube108.geometry}
        material={materials.blackPlasticMaterial}
        position={[5.31, 0.87, -2.54]}
      />
      <mesh
        geometry={nodes.Cube109.geometry}
        material={materials.blackPlasticMaterial}
        position={[5.31, 0.97, -2.48]}
      />
      <mesh
        geometry={nodes.Cube110.geometry}
        material={materials.blackPlasticMaterial}
        position={[5.31, 0.7, -2.39]}
      />
      <mesh
        geometry={nodes.Cube111.geometry}
        material={materials.blackPlasticMaterial}
        position={[5.31, 0.65, -3.18]}
      />
      <mesh
        geometry={nodes.Cube112.geometry}
        material={materials.blackPlasticMaterial}
        position={[5.31, 1, -2.28]}
      />
      <mesh
        geometry={nodes.Cube113.geometry}
        material={nodes.Cube113.material}
        position={[5.31, 1.2, -3.09]}
      />
      <mesh
        geometry={nodes.NurbsPath.geometry}
        material={materials.blackPlasticMaterial}
        position={[5.31, 1.72, -2.96]}
      />
      <mesh
        geometry={nodes.NurbsPath004.geometry}
        material={materials.blackPlasticMaterial}
        position={[5.31, 1.72, -2.95]}
      />
      <mesh
        geometry={nodes.Cube114.geometry}
        material={materials.blackPlasticMaterial}
        position={[5.31, 1.28, -2.79]}
      />
      <mesh
        geometry={nodes.NurbsPath005.geometry}
        material={materials.blackPlasticMaterial}
        position={[5.32, 1.72, -2.95]}
      />
      <mesh
        geometry={nodes.NurbsPath006.geometry}
        material={materials.blackPlasticMaterial}
        position={[5.31, 0.99, -3.34]}
      />
      <mesh
        geometry={nodes.NurbsPath007.geometry}
        material={materials.blackPlasticMaterial}
        position={[5.31, 1.22, -2.71]}
      />
      <mesh
        geometry={nodes.Cube115.geometry}
        material={materials.blackPlasticMaterial}
        position={[5.31, 0.7, -2.57]}
      />
      <mesh
        geometry={nodes.NurbsPath008.geometry}
        material={materials.blackPlasticMaterial}
        position={[5.31, 1.7, -2.2]}
      />
    </group>
  );
}

useGLTF.preload('/neon.gltf');

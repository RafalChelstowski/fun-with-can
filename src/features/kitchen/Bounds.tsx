import { Suspense } from 'react';

import { Triplet, useBox, useCylinder } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Mesh } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, unknown>;
};

function CubeBoundary({ mesh }: { mesh: THREE.Mesh }) {
  const { position, geometry, scale, rotation } = mesh;
  const box = new THREE.Box3().setFromObject(mesh);
  const dimensions: Triplet = [
    rotation.y === 0 ? box.max.x - box.min.x : (box.max.x - box.min.x) / 2,
    box.max.y - box.min.y,
    box.max.z - box.min.z,
  ];

  const [ref] = useBox<Mesh>(() => ({
    type: 'Static',
    position: [...position.toArray()],
    args: dimensions,
    rotation: [rotation.x, rotation.y, rotation.z],
  }));

  return (
    <mesh ref={ref} geometry={geometry} scale={scale}>
      <meshBasicMaterial visible={false} />
    </mesh>
  );
}

function CylinderBoundary({ mesh }: { mesh: THREE.Mesh }) {
  const box = new THREE.Box3().setFromObject(mesh);
  const radius = (box.max.x - box.min.x) / 2;
  const height = box.max.y - box.min.y;
  const { position, geometry, scale } = mesh;

  const [ref] = useCylinder<Mesh>(() => ({
    type: 'Static',
    position: [...position.toArray()],
    args: [radius, radius, height, 16],
  }));

  return (
    <mesh ref={ref} geometry={geometry} scale={scale}>
      <meshBasicMaterial visible={false} />
    </mesh>
  );
}

export function StaticBounds(): JSX.Element {
  const { nodes } = useGLTF('/bounds.gltf') as unknown as GLTFResult;

  const meshes = Object.entries(nodes)
    .filter((mesh) => mesh[1].type === 'Mesh')
    .map((node) => {
      const [key, mesh] = node;

      if (mesh.name.includes('Cube')) {
        return <CubeBoundary key={key} mesh={mesh} />;
      }

      if (mesh.name.includes('Cylinder')) {
        return <CylinderBoundary key={key} mesh={mesh} />;
      }

      return null;
    });

  return (
    <group dispose={null}>
      <Suspense fallback={null}>
        <>{meshes}</>
      </Suspense>
    </group>
  );
}

import { useRef } from 'react';

import { useCylinder } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import { Static } from '../harnasie/Rain';

type GLTFResult = GLTF & {
  nodes: {
    textured_output: THREE.Mesh;
    c1: THREE.Mesh;
    c2: THREE.Mesh;
    c3: THREE.Mesh;
    c4: THREE.Mesh;
    k1: THREE.Mesh;
    k2: THREE.Mesh;
    k3: THREE.Mesh;
  };
  materials: {
    ['material_0.004']: THREE.MeshStandardMaterial;
  };
};

function getMatrixPosition(obj: THREE.Mesh): [x: number, y: number, z: number] {
  const { boundingBox } = obj.geometry;

  if (!boundingBox) {
    return [0, 0, 0];
  }

  const position = new THREE.Vector3();
  position.subVectors(boundingBox.max, boundingBox.min);
  position.multiplyScalar(0.5);
  position.add(boundingBox.min);
  position.applyMatrix4(obj.matrixWorld);

  return position.toArray();
}

function getCylinderArgs(obj: THREE.Mesh): [x: number, y: number, z: number] {
  const { boundingBox } = obj.geometry;

  if (!boundingBox) {
    return [1, 1, 1];
  }

  const { min, max } = boundingBox;

  const h = (max.z - min.z) / 2;
  const r = (max.x - min.x) / 2;

  return [r, r, h];
}

function Cylinder({ obj }: { obj: THREE.Mesh }) {
  const [ref] = useCylinder(() => ({
    type: 'Static',
    mass: 1,
    args: [...getCylinderArgs(obj), 10],
    position: getMatrixPosition(obj),
    allowSleep: false,
  }));

  return <mesh scale={1} ref={ref} />;
}
export function Kitchen({
  ...props
}: JSX.IntrinsicElements['group']): JSX.Element {
  const group = useRef<THREE.Group>();
  const { nodes, materials } = useGLTF(
    '/kitchen.gltf'
  ) as unknown as GLTFResult;

  return (
    <>
      <group ref={group} {...props} dispose={null}>
        <mesh
          geometry={nodes.textured_output.geometry}
          material={materials['material_0.004']}
        />
        {[nodes.c1, nodes.c2, nodes.c3, nodes.c4].map((obj) => {
          return <Cylinder key={obj.name} obj={obj} />;
        })}
      </group>
      <Static num={30} />
    </>
  );
}

useGLTF.preload('/kitchen.gltf');

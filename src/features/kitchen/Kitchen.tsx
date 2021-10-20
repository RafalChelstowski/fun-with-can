// import { useRef } from 'react';

// import { useCylinder } from '@react-three/cannon';
// import { useGLTF } from '@react-three/drei';
// import { useFrame } from '@react-three/fiber';
// import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// type GLTFResult = GLTF & {
//   nodes: Record<string, THREE.Mesh>;
//   materials: Record<string, THREE.Material>;
// };

// export function Kitchen(): JSX.Element {
//   const { nodes, materials } = useGLTF(
//     '/kitchen.gltf'
//   ) as unknown as GLTFResult;

//   console.log(nodes);

//   //   const [ref, api] = useCylinder(() => ({
//   //     mass: 1,
//   //     args: [0.08, 0.08, 0.18, 5],
//   //     position: [0, 30 * Math.random(), 0],
//   //     rotation: [Math.random(), Math.random(), Math.random()],
//   //     allowSleep: false,
//   //   }));

//   //   const prevTime = useRef(0);
//   //   const currentTime = useRef<number>();

//   //   useFrame(({ clock }) => {
//   //     currentTime.current = clock.getElapsedTime();

//   //     if (currentTime.current - prevTime.current > 0.4) {
//   //       api
//   //         .at(Math.floor(Math.random() * num))
//   //         .position.set(0, 30 + Math.random() * 2, 0);
//   //       prevTime.current = clock.getElapsedTime();
//   //     }
//   //   });

//   return (
//     <group>
//       {/* <instancedMesh
//         // ref={ref}
//         name="Can"
//         // args={[undefined, undefined, num]}
//         material={materials.harnasblue}
//         geometry={nodes.Cylinder.geometry}
//         castShadow
//       /> */}
//       <mesh>
//         <boxBufferGeometry />
//         <meshStandardMaterial />
//       </mesh>
//     </group>
//   );
// }

import { useRef } from 'react';

import { useBox, useCylinder } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

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
    ['material_0.002']: THREE.MeshStandardMaterial;
  };
};

function getPositionFromNode(
  obj: THREE.Mesh
): [x: number, y: number, z: number] {
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
    position: getPositionFromNode(obj),
    allowSleep: false,
  }));

  return <mesh scale={1} ref={ref} />;
}

function getBoxArgs(obj: THREE.Mesh): [x: number, y: number, z: number] {
  const { boundingBox } = obj.geometry;

  if (!boundingBox) {
    return [1, 1, 1];
  }

  const { min, max } = boundingBox;

  const w = (max.x - min.x) / 2;
  const d = (max.y - min.y) / 2;
  const h = (max.z - min.z) / 2;

  return [w, d, h];
}

function Box({ obj }: { obj: THREE.Mesh }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    mass: 1,
    args: [...getBoxArgs(obj)],
    position: getPositionFromNode(obj),
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
    <group ref={group} {...props} dispose={null}>
      <mesh
        geometry={nodes.textured_output.geometry}
        material={materials['material_0.002']}
      />
      {[nodes.c1, nodes.c2, nodes.c3, nodes.c4].map((obj) => {
        return <Cylinder key={obj.name} obj={obj} />;
      })}
      {[nodes.k1, nodes.k2, nodes.k3].map((obj) => {
        return <Box key={obj.name} obj={obj} />;
      })}

      {/* <mesh geometry={nodes.k1.geometry} material={nodes.k1.material} />
      <mesh geometry={nodes.k2.geometry} material={nodes.k2.material} />
      <mesh geometry={nodes.k3.geometry} material={nodes.k3.material} /> */}
    </group>
  );
}

useGLTF.preload('/kitchen.gltf');

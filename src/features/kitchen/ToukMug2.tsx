import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useCylinder } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import { useStore } from '../../store/store';

type GLTFResult = GLTF & {
  nodes: {
    toukMug2: THREE.Mesh;
  };
  materials: {
    salmonToukCupMaterial: THREE.MeshStandardMaterial;
  };
};

export function ToukMug2(): JSX.Element {
  const point = useStore((state) => state.clickedPoint);
  const camera = useThree((state) => state.camera);
  const { nodes, materials } = useGLTF('/toukMug2.gltf') as GLTFResult;
  const box = new THREE.Box3().setFromObject(nodes.toukMug2);
  const radius = (box.max.x - box.min.x) / 2;
  const height = box.max.y - box.min.y;
  const num = 10;
  const pickedRef = useRef(false);

  const [picked, setPicked] = useState<number | undefined>();

  const [ref, api] = useCylinder(() => ({
    mass: 1,
    args: [radius, radius, height, 5],
    position: [0, 0, 0],
    rotation: [0, Math.random(), 0],
    allowSleep: true,
    type: 'Dynamic',
  }));

  const objName = 'ToukMug2';

  useLayoutEffect(() => {
    const grid: number[][][] = Array.from({ length: num / 5 }).map(() => []);
    Array.from({ length: num }).forEach((_, idx) => {
      const gridIdx = Math.floor(idx / 5);
      grid[gridIdx].push([idx - gridIdx * 5, gridIdx]);
    });

    Array.from({ length: num }).forEach((_, i) => {
      const gridIdx = Math.floor(i / 5);
      const [x, z] = grid[gridIdx][i - gridIdx * 5];

      api.at(i).position.set(-2.2 + x * 0.11, 1.5 + height, -5.5 + z * 0.11);
    });
  }, [api, api.at, height, num]);

  useEffect(() => {
    if (picked && point && pickedRef.current === true) {
      api.at(picked).position.set(point.x, point.y + height, point.z);
      setPicked(undefined);
      pickedRef.current = false;
    } else if (picked && point && pickedRef.current === false) {
      pickedRef.current = true;
    }
  }, [api, height, picked, point]);

  useFrame(() => {
    if (picked !== undefined) {
      const zCamVec = new THREE.Vector3(0.15, -0.15, -0.3);
      const position = camera.localToWorld(zCamVec);

      api.at(picked).position.set(...position.toArray());
      api.at(picked).velocity.set(0, 0, 0);
      api.at(picked).rotation.set(0, 0, 0);
    }
  });

  return (
    <instancedMesh
      onClick={(e) => {
        e.stopPropagation();
        if (picked || e.distance > 2) {
          return;
        }

        setPicked(e.instanceId);
      }}
      ref={ref}
      args={[nodes.toukMug2.geometry, materials.salmonToukCupMaterial, num]}
      name={objName}
    />
  );
}

useGLTF.preload('/toukMug2.gltf');

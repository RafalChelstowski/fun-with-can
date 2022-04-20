import { useEffect, useLayoutEffect } from 'react';

import { useCylinder } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import { useStore } from '../../store/store';
import { InteractiveObjectStatus, PlayerStatus } from '../../types';

type GLTFResult = GLTF & {
  nodes: {
    toukMug2: THREE.Mesh;
  };
  materials: {
    salmonToukCupMaterial: THREE.MeshStandardMaterial;
  };
};
const num = 8;
const grid: number[][][] = Array.from({ length: num / 4 }).map(() => []);
Array.from({ length: num }).forEach((_, idx) => {
  const gridIdx = Math.floor(idx / 4);
  grid[gridIdx].push([idx - gridIdx * 4, gridIdx]);
});

export function ToukMug2(): JSX.Element {
  const camera = useThree((state) => state.camera);
  const { nodes, materials } = useGLTF(
    '/toukMug2.gltf'
  ) as unknown as GLTFResult;
  const box = new THREE.Box3().setFromObject(nodes.toukMug2);
  const radius = (box.max.x - box.min.x) / 2;
  const height = (box.max.y - box.min.y) * 1.07;

  const { playerStatus, setPlayerStatus, mugs2, setInteractiveObject, point } =
    useStore((state) => ({
      mugs2: state.interactiveObjects.mugs2,
      setInteractiveObject: state.setInteractiveObject,
      playerStatus: state.playerStatus,
      setPlayerStatus: state.setPlayerStatus,
      point: state.point,
    }));

  const [ref, api] = useCylinder(() => ({
    mass: 1,
    args: [radius, radius, height, 5],
    position: [0, 0, 0],
    rotation: [0, Math.random() * 3, 0],
    allowSleep: true,
    type: 'Dynamic',
  }));

  const objName = 'ToukMug2';

  useLayoutEffect(() => {
    Array.from({ length: num }).forEach((_, i) => {
      const gridIdx = Math.floor(i / 4);
      const [x, z] = grid[gridIdx][i - gridIdx * 4];

      api
        .at(i)
        .position.set(
          -2.45 + x * 0.11,
          1.5 + height + height,
          -5.57 + z * 0.11
        );
    });
  }, [api, api.at, height]);

  useEffect(() => {
    const { status, instanceId } = mugs2;
    if (instanceId && point && status === InteractiveObjectStatus.DROPPED) {
      api.at(instanceId).position.set(point.x, point.y + height, point.z);

      setInteractiveObject('mugs2', {
        status: InteractiveObjectStatus.DROPPED,
        instanceId: undefined,
      });
    }
  }, [api, height, mugs2, point, setInteractiveObject]);

  useFrame(() => {
    const { status, instanceId } = mugs2;
    if (instanceId && status === InteractiveObjectStatus.PICKED) {
      const zCamVec = new THREE.Vector3(0.15, -0.15, -0.3);
      const position = camera.localToWorld(zCamVec);
      api.at(instanceId).position.set(...position.toArray());
      api.at(instanceId).velocity.set(0, 0, 0);
      api.at(instanceId).rotation.set(0, 0, 0);
    }
  });

  return (
    <instancedMesh
      onClick={(e) => {
        e.stopPropagation();
        if (e.distance > 2 || playerStatus === PlayerStatus.PICKED) {
          return;
        }

        setInteractiveObject('mugs2', {
          status: InteractiveObjectStatus.PICKED,
          instanceId: e.instanceId,
        });
        setPlayerStatus(PlayerStatus.PICKED);
      }}
      ref={ref as unknown as React.RefObject<React.ReactNode>}
      args={[nodes.toukMug2.geometry, materials.salmonToukCupMaterial, num]}
      name={objName}
    />
  );
}

useGLTF.preload('/toukMug2.gltf');

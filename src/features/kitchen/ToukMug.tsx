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
    toukMug1: THREE.Mesh;
  };
  materials: {
    yellowToukCupMaterial: THREE.MeshStandardMaterial;
  };
};

const num = 10;
const grid: number[][][] = Array.from({ length: num / 5 }).map(() => []);
Array.from({ length: num }).forEach((_, idx) => {
  const gridIdx = Math.floor(idx / 5);
  grid[gridIdx].push([idx - gridIdx * 5, gridIdx]);
});

export function ToukMug(): JSX.Element {
  const camera = useThree((state) => state.camera);
  const { nodes, materials } = useGLTF(
    '/toukMug.gltf'
  ) as unknown as GLTFResult;
  const box = new THREE.Box3().setFromObject(nodes.toukMug1);
  const radius = (box.max.x - box.min.x) / 2;
  const height = (box.max.y - box.min.y) * 1.07;

  const { playerStatus, setPlayerStatus, mugs, setInteractiveObject, point } =
    useStore((state) => ({
      mugs: state.interactiveObjects.mugs,
      setInteractiveObject: state.setInteractiveObject,
      playerStatus: state.playerStatus,
      setPlayerStatus: state.setPlayerStatus,
      point: state.point,
    }));

  const isPickedByPlayer =
    mugs.status === InteractiveObjectStatus.PICKED &&
    playerStatus === PlayerStatus.PICKED;
  const isThrownByPlayer =
    mugs.status === InteractiveObjectStatus.PICKED &&
    playerStatus === PlayerStatus.THROWING;
  const [ref, api] = useCylinder(() => ({
    mass: 0.5,
    args: [radius, radius, height, 5],
    position: [0, 0, 0],
    rotation: [0, Math.random() * 3, 0],
    allowSleep: true,
    type: 'Dynamic',
  }));

  const objName = 'ToukMug2';

  useLayoutEffect(() => {
    Array.from({ length: num }).forEach((_, i) => {
      const gridIdx = Math.floor(i / 5);
      const [x, z] = grid[gridIdx][i - gridIdx * 5];

      api.at(i).position.set(-2.5 + x * 0.11, 1.5 + height, -5.55 + z * 0.13);
    });
  }, [api, api.at, height]);

  useEffect(() => {
    const { status, instanceId } = mugs;
    if (instanceId && point && status === InteractiveObjectStatus.DROPPED) {
      api.at(instanceId).position.set(point.x, point.y + height, point.z);

      setInteractiveObject('mugs', {
        status: InteractiveObjectStatus.DROPPED,
        instanceId: undefined,
      });
    }
  }, [api, height, mugs, point, setInteractiveObject]);

  useEffect(() => {
    const { instanceId } = mugs;
    if (instanceId && point && isThrownByPlayer) {
      const camPosition = new THREE.Vector3();
      const position = camera.getWorldPosition(camPosition);
      const target = new THREE.Vector3();
      const distance = position.distanceTo(point);

      target
        .subVectors(point, position)
        .normalize()
        .addScalar(distance / 4);

      api.at(instanceId).velocity.set(...target.toArray());
      api
        .at(instanceId)
        .rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);

      setInteractiveObject('mugs', {
        status: InteractiveObjectStatus.DROPPED,
        instanceId: undefined,
      });

      setPlayerStatus(null);
    }
  }, [
    api,
    camera,
    isThrownByPlayer,
    mugs,
    point,
    setInteractiveObject,
    setPlayerStatus,
  ]);

  useFrame(() => {
    const { instanceId } = mugs;
    if (instanceId && isPickedByPlayer) {
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

        setInteractiveObject('mugs', {
          status: InteractiveObjectStatus.PICKED,
          instanceId: e.instanceId,
        });
        setPlayerStatus(PlayerStatus.PICKED);
      }}
      ref={ref as unknown as React.RefObject<React.ReactNode>}
      args={[nodes.toukMug1.geometry, materials.yellowToukCupMaterial, num]}
      name={objName}
    />
  );
}

useGLTF.preload('/toukMug.gltf');

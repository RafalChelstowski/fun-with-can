import { Ref, useEffect, useLayoutEffect, useMemo } from 'react';

import { Triplet, useBox } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { BufferGeometry, InstancedMesh, Material } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import { useStore } from '../../store/store';
import { InteractiveObjectStatus, PlayerStatus } from '../../types';

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.MeshStandardMaterial>;
};

interface Props {
  initialPosition: Triplet;
  objName: 'mugs' | 'mugs2' | 'ikeaGlass' | 'ikeaMug1' | 'ikeaMug2';
  geometryName: string;
  materialName: string;
  customMaterial?: THREE.Material;
  gltfName: string;
  itemsNumber?: number;
  rowModifier?: number;
}

export function InstancedKitchenObject({
  initialPosition,
  objName,
  geometryName,
  materialName,
  customMaterial,
  gltfName,
  itemsNumber = 10,
  rowModifier = 5,
}: Props): JSX.Element {
  const grid: number[][][] = useMemo(
    () =>
      Array.from({
        length: itemsNumber / rowModifier,
      }).map(() => []),
    [itemsNumber, rowModifier]
  );
  const camera = useThree((state) => state.camera);
  const { nodes, materials } = useGLTF(gltfName) as unknown as GLTFResult;

  const { playerStatus, setPlayerStatus, obj, setInteractiveObject, point } =
    useStore((state) => ({
      obj: state.interactiveObjects[objName],
      setInteractiveObject: state.setInteractiveObject,
      playerStatus: state.playerStatus,
      setPlayerStatus: state.setPlayerStatus,
      point: state.point,
    }));

  const isPickedByPlayer =
    obj.status === InteractiveObjectStatus.PICKED &&
    playerStatus === PlayerStatus.PICKED;
  const isThrownByPlayer =
    obj.status === InteractiveObjectStatus.PICKED &&
    playerStatus === PlayerStatus.THROWING;

  const [ref, api] = useBox(() => ({
    mass: 1,
    args: [0.1, 0.08, 0.1],
    position: [0, 0, 0],
    rotation: [0, Math.random() * 3, 0],
    allowSleep: true,
    type: 'Dynamic',
  }));

  useLayoutEffect(() => {
    Array.from({ length: itemsNumber }).forEach((_, idx) => {
      const gridIdx = Math.floor(idx / rowModifier);
      grid[gridIdx].push([idx - gridIdx * rowModifier, gridIdx]);
    });
    Array.from({ length: itemsNumber }).forEach((_, i) => {
      const gridIdx = Math.floor(i / rowModifier);
      const [x, z] = grid[gridIdx][i - gridIdx * rowModifier];

      api
        .at(i)
        .position.set(
          initialPosition[0] + x * 0.11,
          initialPosition[1] + 0.2,
          initialPosition[2] + z * 0.13
        );
    });
  }, [api, grid, initialPosition, itemsNumber, rowModifier]);

  useEffect(() => {
    const { status, instanceId } = obj;
    if (instanceId && point && status === InteractiveObjectStatus.DROPPED) {
      api.at(instanceId).position.set(point.x, point.y + 0.2, point.z);

      setInteractiveObject(objName, {
        status: InteractiveObjectStatus.DROPPED,
        instanceId: undefined,
      });
    }
  }, [api, obj, objName, point, setInteractiveObject]);

  useEffect(() => {
    const { instanceId } = obj;
    if (instanceId && point && isThrownByPlayer) {
      const camPosition = new THREE.Vector3();
      const position = camera.getWorldPosition(camPosition);
      const target = new THREE.Vector3();
      const distance = position.distanceTo(point);
      camera.getWorldDirection(target);
      const { x, y, z } = target.multiplyScalar(distance * 2);

      api.at(instanceId).velocity.set(x, y, z);
      api
        .at(instanceId)
        .rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);

      setInteractiveObject(objName, {
        status: InteractiveObjectStatus.DROPPED,
        instanceId: undefined,
      });

      setPlayerStatus(null);
    }
  }, [
    api,
    camera,
    isThrownByPlayer,
    obj,
    objName,
    point,
    setInteractiveObject,
    setPlayerStatus,
  ]);

  const zCamVec = new THREE.Vector3();
  const rotationDirection = new THREE.Vector3();

  useFrame(() => {
    const { instanceId } = obj;
    if (instanceId && isPickedByPlayer) {
      zCamVec.set(0.15, -0.15, -0.4);
      const position = camera.localToWorld(zCamVec);
      camera.getWorldDirection(rotationDirection);
      rotationDirection.normalize();
      const theta = Math.atan2(rotationDirection.x, rotationDirection.z);

      api.at(instanceId).position.set(...position.toArray());
      api.at(instanceId).velocity.set(0, 0, 0);
      api.at(instanceId).rotation.set(0, theta + Math.PI, 0);
    }
  });

  return (
    <instancedMesh
      onClick={(e) => {
        e.stopPropagation();
        if (e.distance > 2 || playerStatus === PlayerStatus.PICKED) {
          return;
        }

        setInteractiveObject(objName, {
          status: InteractiveObjectStatus.PICKED,
          instanceId: e.instanceId,
        });
        setPlayerStatus(PlayerStatus.PICKED);
      }}
      ref={
        ref as unknown as
          | Ref<InstancedMesh<BufferGeometry, Material | Material[]>>
          | undefined
      }
      args={[
        nodes[geometryName].geometry,
        customMaterial || materials[materialName],
        itemsNumber,
      ]}
      name={objName}
    />
  );
}

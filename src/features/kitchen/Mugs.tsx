import { useLayoutEffect, useMemo, useRef } from 'react';
import { useEvent } from 'react-use';

import { Triplet, useBox } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { InstancedMesh } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import { getState, setState } from '../../store/store';
import { PlayerStatus } from '../../types';

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

export function Mugs({
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
  const raycaster = useThree((state) => state.raycaster);
  const scene = useThree((state) => state.scene);
  const instanceId = useRef<number | undefined>(undefined);

  const { nodes, materials } = useGLTF(gltfName) as unknown as GLTFResult;

  const [ref, api] = useBox<InstancedMesh>(() => ({
    mass: 20,
    args: [0.1, 0.08, 0.1],
    position: [0, 0, 0],
    rotation: [0, Math.random() * 3, 0],
    allowSleep: true,
    type: 'Dynamic',
    sleepSpeedLimit: 0.1,
    sleepTimeLimit: 0.5,
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

  useEvent('click', () => {
    const { playerStatus } = getState();
    const x = raycaster
      .intersectObjects(scene.children)
      .filter(
        (o) =>
          o.object.name.includes('area') ||
          o.object.name.includes('interactive')
      )?.[0];

    if (x?.object.name.includes('interactive')) {
      if (instanceId.current || playerStatus === PlayerStatus.PICKED) {
        return;
      }

      instanceId.current = x.instanceId;
      setState({ playerStatus: PlayerStatus.PICKED });

      return;
    }

    if (instanceId.current && x && x.distance < 2) {
      const { point } = x;
      api.at(instanceId.current).position.set(point.x, point.y + 0.2, point.z);
      instanceId.current = undefined;
      setState({ playerStatus: null });
    }
  });

  useEvent('keydown', ({ key }) => {
    if (!key) {
      return;
    }

    if (key === ' ') {
      if (instanceId.current) {
        const camPosition = new THREE.Vector3();
        const position = camera.getWorldPosition(camPosition);
        const target = new THREE.Vector3();
        const targetMesh = raycaster.intersectObjects(scene.children)?.[0];

        if (targetMesh) {
          const distance = position.distanceTo(targetMesh.point);
          camera.getWorldDirection(target);
          const { x, y, z } = target.multiplyScalar(Math.min(distance * 2, 15));

          api.at(instanceId.current).velocity.set(x, y, z);
          api
            .at(instanceId.current)
            .rotation.set(
              Math.random() * 3,
              Math.random() * 3,
              Math.random() * 3
            );

          instanceId.current = undefined;
          setState({ playerStatus: null });
        }
      }
    }
  });

  const zCamVec = new THREE.Vector3();
  const rotationDirection = new THREE.Vector3();

  useFrame(() => {
    if (instanceId.current) {
      zCamVec.set(0.15, -0.15, -0.4);
      const position = camera.localToWorld(zCamVec);
      camera.getWorldDirection(rotationDirection);
      rotationDirection.normalize();
      const theta = Math.atan2(rotationDirection.x, rotationDirection.z);

      api
        .at(instanceId.current)
        .position.set(position.x, position.y, position.z);
      api.at(instanceId.current).velocity.set(0, 0, 0);
      api.at(instanceId.current).rotation.set(0, theta + Math.PI, 0);
    }
  });

  return (
    <instancedMesh
      ref={ref}
      args={[
        nodes[geometryName].geometry,
        customMaterial || materials[materialName],
        itemsNumber,
      ]}
      name={`interactive-${objName}`}
    />
  );
}

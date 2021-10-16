import { useEffect, useRef, useState } from 'react';

import { useBox, useSphere } from '@react-three/cannon';
import { Box } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  Interactive,
  RayGrab,
  useController,
  useInteraction,
  useXR,
  useXREvent,
  XRInteractionEvent,
} from '@react-three/xr';
import * as THREE from 'three';

interface CubeProps {
  position: [x: number, y: number, z: number];
}

export function Cube({ position }: CubeProps): JSX.Element {
  const { addInteraction, hoverState } = useXR();

  const [color] = useState<string | number>('green');
  const [grabbed, setGrabbed] = useState(false);
  const rightController = useController('right');
  const leftController = useController('left');
  const [cubeRef, cubeApi] = useBox(() => ({
    type: 'Dynamic',
    mass: 1,
    args: [0.5, 0.5, 0.5],
    position,
    allowSleep: false,
  }));

  const [rightHandRef, rightHandApi] = useSphere(() => ({
    type: 'Static',
    mass: 1,
    args: [0.05],
  }));
  const [leftHandRef, leftHandApi] = useSphere(() => ({
    type: 'Static',
    mass: 1,
    args: [0.05],
  }));

  const grabbingController = useRef<THREE.Object3D>();
  const previousTransform = useRef<THREE.Matrix4 | undefined>(undefined);
  const groupRef = useRef<THREE.Group>();

  // useInteraction(cubeRef, 'onHover', (e) => {
  //   console.log('onHover!', e);
  //   if (e.intersection?.distance && e.intersection.distance < 0.1) {
  //     console.log('distance < 0.1');
  //   }
  // });

  useFrame(() => {
    if (rightController) {
      rightHandApi.position.set(
        rightController.controller.position.x,
        rightController.controller.position.y,
        rightController.controller.position.z
      );
    }
    if (leftController) {
      leftHandApi.position.set(
        leftController.controller.position.x,
        leftController.controller.position.y,
        leftController.controller.position.z
      );
    }

    if (
      !grabbingController.current ||
      !previousTransform.current ||
      !groupRef.current
    ) {
      return;
    }

    const controller = grabbingController.current;
    const group = groupRef.current;

    group.applyMatrix4(previousTransform.current);

    group.applyMatrix4(controller.matrixWorld);
    group.updateWorldMatrix(false, true);

    const p = new THREE.Vector3().setFromMatrixPosition(controller.matrixWorld);
    const r = new THREE.Euler().setFromRotationMatrix(controller.matrixWorld);
    cubeApi.position.set(...p.toArray());
    cubeApi.rotation.set(...r.toVector3().toArray());

    previousTransform.current = controller.matrixWorld.clone().invert();
  });

  useXREvent('selectend', (e) => {
    if (e.controller.controller === grabbingController.current) {
      grabbingController.current = undefined;
      previousTransform.current = undefined;
      setGrabbed(false);
      cubeApi.mass.set(1);
    }
  });

  return (
    <>
      <Interactive
        ref={groupRef}
        onSelectStart={(e) => {
          setGrabbed(true);
          grabbingController.current = e.controller.controller;
          previousTransform.current = e.controller.controller.matrixWorld
            .clone()
            .invert();
          cubeApi.mass.set(0);
        }}
      >
        <mesh ref={cubeRef} name="cube">
          <boxBufferGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial
            color={grabbed ? 'pink' : color}
            roughness={0.4}
          />
        </mesh>
      </Interactive>
      <mesh name="rightHand" ref={rightHandRef}>
        <sphereBufferGeometry args={[0.05]} />
      </mesh>
      <mesh name="leftHand" ref={leftHandRef}>
        <sphereBufferGeometry args={[0.05]} />
      </mesh>
    </>
  );
}

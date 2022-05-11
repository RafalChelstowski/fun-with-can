import React, { useEffect, useRef } from 'react';

import { useSphere } from '@react-three/cannon';
import { extend, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

import { useControls } from '../../common/hooks/useControls';
import { useEventListener } from '../../common/hooks/useEventListener';
import { useStore } from '../../store/store';
import { ControlsLock } from '../../types';

extend({ PointerLockControls });

const INITIAL_POSITION: [x: number, y: number, z: number] = [0, 0.2, 1];
const SPEED = 3.5;

const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();
const cameraPosition = new THREE.Vector3();

export function Player(): JSX.Element {
  const controlsRef = useRef<ControlsLock | null>(null);
  const velocityRef = useRef([0, 0, 0]);

  const { toggleIsLocked, pointerSpeed } = useStore((state) => ({
    toggleIsLocked: state.toggleIsLocked,
    pointerSpeed: state.pointerSpeed,
  }));

  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);

  const { controlsUp, controlsDown, controlsLeft, controlsRight } =
    useControls();

  const [ref, api] = useSphere(() => ({
    args: [0.1],
    mass: 20,
    type: 'Dynamic',
    position: INITIAL_POSITION,
  }));

  useEffect(() => {
    if (controlsRef.current?.isLocked) {
      api.velocity.subscribe((v) => {
        velocityRef.current = v;
      });
    }
  }, [api.velocity]);
  useEventListener(
    'click',
    (e) => {
      if ((e.target as HTMLButtonElement)?.name === 'Play') {
        controlsRef.current?.lock();
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    document as any
  );
  useEventListener(
    'pointerlockchange',
    () => {
      toggleIsLocked();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    document as any
  );

  useFrame((state) => {
    if (ref.current && controlsRef.current?.isLocked) {
      state.camera.position.copy(
        cameraPosition.set(
          ref.current.position.x,
          ref.current.position.y + 1.6,
          ref.current.position.z
        )
      );
      frontVector.set(0, 0, Number(controlsDown) - Number(controlsUp));
      sideVector.set(Number(controlsLeft) - Number(controlsRight), 0, 0);
      direction
        .subVectors(frontVector, sideVector)
        .normalize()
        .multiplyScalar(SPEED)
        .applyEuler(camera.rotation);

      api.velocity.set(direction.x, velocityRef.current[1], direction.z);
      api.rotation.set(0, 0, 0);
      ref.current.getWorldPosition(ref.current.position);
    } else {
      api.velocity.set(0, 0, 0);
    }
  });

  return (
    <>
      <pointerLockControls
        args={[camera, gl.domElement]}
        ref={controlsRef}
        pointerSpeed={pointerSpeed}
      />
      <mesh ref={ref as unknown as React.RefObject<React.ReactNode>} />
    </>
  );
}

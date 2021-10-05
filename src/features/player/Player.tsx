import { useCallback, useEffect, useRef } from 'react';

import { useSphere } from '@react-three/cannon';
import { extend, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

import useControls from '../../common/hooks/useControls';
import { useStore } from '../../store/store';
import { ControlsLock } from '../../types';

extend({ PointerLockControls });

const INITIAL_POSITION: [x: number, y: number, z: number] = [0, 0, 0];
const SPEED = 5;

export function Player(): JSX.Element {
  const controlsRef = useRef<ControlsLock | null>(null);
  const velocityRef = useRef([0, 0, 0]);
  const isLocked = useStore(useCallback((state) => state.isLocked, []));
  const { gl, camera } = useThree();

  const { controlsUp, controlsDown, controlsLeft, controlsRight } =
    useControls();

  const [playerRef, playerApi] = useSphere(() => ({
    args: 0.4,
    mass: 1,
    type: 'Dynamic',
    position: INITIAL_POSITION,
  }));

  useEffect(() => {
    if (isLocked) {
      playerApi.velocity.subscribe((v) => {
        velocityRef.current = v;
      });
    }
  }, [isLocked, playerApi.velocity]);

  useEffect(() => {
    if (isLocked) {
      controlsRef?.current?.lock();
    }
  }, [isLocked]);

  useFrame(() => {
    if (isLocked && playerRef.current) {
      camera.position.copy(playerRef.current.position);
      const direction = new THREE.Vector3();

      const frontVector = new THREE.Vector3(
        0,
        0,
        Number(controlsDown) - Number(controlsUp)
      );
      const sideVector = new THREE.Vector3(
        Number(controlsLeft) - Number(controlsRight),
        0,
        0
      );
      direction
        .subVectors(frontVector, sideVector)
        .normalize()
        .multiplyScalar(SPEED)
        .applyEuler(camera.rotation);

      playerApi.velocity.set(direction.x, velocityRef.current[1], direction.z);
    }
  });

  return (
    <>
      <pointerLockControls args={[camera, gl.domElement]} ref={controlsRef} />
      <mesh ref={playerRef} />
    </>
  );
}

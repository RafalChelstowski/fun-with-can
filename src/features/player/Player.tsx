import { useCallback, useEffect, useRef } from 'react';

import { useSphere } from '@react-three/cannon';
import { extend, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

import { useControls } from '../../common/hooks/useControls';
import { useEventListener } from '../../common/hooks/useEventListener';
import { useStore } from '../../store/store';
import { ControlsLock } from '../../types';

extend({ PointerLockControls });

const INITIAL_POSITION: [x: number, y: number, z: number] = [0, 10, 0];
const SPEED = 5;

export function Player(): JSX.Element {
  const controlsRef = useRef<ControlsLock | null>(null);
  const velocityRef = useRef([0, 0, 0]);
  // const isLocked = useStore(useCallback((state) => state.isLocked, []));

  console.log(velocityRef.current);

  const toggleIsLocked = useStore(
    useCallback((state) => state.toggleIsLocked, [])
  );
  const { gl, camera } = useThree();

  const { controlsUp, controlsDown, controlsLeft, controlsRight } =
    useControls();

  const [playerRef, playerApi] = useSphere(() => ({
    args: [0.4],
    mass: 1,
    type: 'Dynamic',
    // position: INITIAL_POSITION,
  }));

  useEffect(() => {
    if (controlsRef.current?.isLocked) {
      console.log('subsc');

      playerApi.velocity.subscribe((v) => {
        velocityRef.current = v;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (isLocked) {
  //     controlsRef?.current?.lock();
  //   }
  // }, [isLocked]);

  useEventListener(
    'click',
    (e) => {
      if ((e.target as HTMLButtonElement)?.name === 'Play') {
        controlsRef.current?.lock();
      }
    },
    document as any
  );

  useEventListener(
    'pointerlockchange',
    () => {
      toggleIsLocked();
    },
    document as any
  );

  useFrame(() => {
    if (controlsRef.current?.isLocked && playerRef.current) {
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

      // console.log(direction, frontVector, sideVector);

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

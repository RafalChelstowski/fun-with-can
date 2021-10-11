import { useEffect, useState } from 'react';

import { useBox, useSphere } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import {
  Interactive,
  RayGrab,
  useController,
  useInteraction,
  useXREvent,
  XRInteractionEvent,
} from '@react-three/xr';

interface CubeProps {
  position: [x: number, y: number, z: number];
}

export function Cube({ position }: CubeProps): JSX.Element {
  const [color, setColor] = useState<string | number>('green');
  const rightController = useController('right');
  const leftController = useController('left');
  const [squeezed, setSqueezed] = useState(false);

  const [cubeRef, cubeApi] = useBox(() => ({
    // type: cubeSqueezed ? 'Static' : 'Dynamic',
    mass: 1,
    args: [0.5, 0.5, 0.5],
    position,
  }));

  const [rightHandRef, rightHandApi] = useSphere(() => ({
    type: 'Static',
    mass: 1,
    args: 0.05,
  }));
  // useInteraction(ref, 'onSelect', () => console.log('selected!'));
  const [leftHandRef, leftHandApi] = useSphere(() => ({
    type: 'Static',
    mass: 1,
    args: 0.05,
  }));

  // useInteraction(ref, 'onSelect', () => console.log('selected!'));

  useXREvent(
    'selectstart',
    (e) => {
      console.log('selectstart', e);
    },
    {
      handedness: 'right',
    }
  );
  useXREvent(
    'selectend',
    (e) => {
      console.log('selectend', e);

      // setCubeSqueezed(false);
    },
    {
      handedness: 'right',
    }
  );

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

    if (squeezed && rightController) {
      cubeApi.position.set(
        rightController.controller.position.x,
        rightController.controller.position.y,
        rightController.controller.position.z - 1
      );
    }
  });

  return (
    <>
      {/* <Interactive
        onSqueezeStart={() => {
          console.log('squeeze start');

          setSqueezed(true);
          cubeApi.mass?.set(0);
          // cubeApi.velocity?.set(0, 0, 0);
        }}
        onSqueezeEnd={() => {
          console.log('squeeze end');

          setSqueezed(false);
          cubeApi.mass?.set(1);
        }}
      > */}
      <RayGrab>
        <mesh name="cube" position={position} ref={cubeRef}>
          <boxBufferGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      </RayGrab>
      {/* </Interactive> */}
      <mesh name="rightHand" ref={rightHandRef}>
        <sphereBufferGeometry args={[0.05]} />
      </mesh>
      <mesh name="leftHand" ref={leftHandRef}>
        <sphereBufferGeometry args={[0.05]} />
      </mesh>
    </>
  );
}

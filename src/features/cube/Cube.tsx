import { useRef, useState } from 'react';

import { useBox } from '@react-three/cannon';
import { Interactive, RayGrab, useXREvent } from '@react-three/xr';
import * as THREE from 'three';

interface CubeProps {
  position: [x: number, y: number, z: number];
}

export function Cube({ position }: CubeProps): JSX.Element {
  // const { addInteraction, hoverState } = useXR();

  const [color] = useState<string | number>('green');
  const [grabbed, setGrabbed] = useState(false);

  const [cubeRef, cubeApi] = useBox(() => ({
    type: 'Dynamic',
    mass: 1,
    args: [0.2, 0.2, 0.2],
    position,
    allowSleep: false,
  }));

  const grabbingController = useRef<THREE.Object3D>();
  const previousTransform = useRef<THREE.Matrix4 | undefined>(undefined);
  const groupRef = useRef<THREE.Group>();

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
      <RayGrab>
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
            <boxBufferGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial
              color={grabbed ? 'pink' : color}
              roughness={0.4}
            />
          </mesh>
        </Interactive>
      </RayGrab>
    </>
  );
}

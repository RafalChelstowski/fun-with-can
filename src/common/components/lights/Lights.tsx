import { useLayoutEffect } from 'react';

import { Sky } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

export function Lights(): JSX.Element {
  const { gl } = useThree();

  useLayoutEffect(() => {
    gl.physicallyCorrectLights = true;
  }, [gl]);

  return (
    <>
      <ambientLight />
      <fog attach="fog" color="white" near={5} far={50} />
      <directionalLight />
      <Sky />
    </>
  );
}

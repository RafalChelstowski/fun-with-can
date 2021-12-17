import { useLayoutEffect } from 'react';

import { useThree } from '@react-three/fiber';

export function Lights(): JSX.Element {
  const { gl } = useThree();

  useLayoutEffect(() => {
    gl.physicallyCorrectLights = true;
  }, [gl]);

  return (
    <>
      <ambientLight intensity={0.2} />
      {/* <hemisphereLight /> */}
      {/* <pointLight /> */}
    </>
  );
}

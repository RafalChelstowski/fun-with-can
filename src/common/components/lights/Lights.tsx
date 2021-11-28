import { useEffect } from 'react';

import { useThree } from '@react-three/fiber';

export function Lights(): JSX.Element {
  const { gl } = useThree();

  useEffect(() => {
    gl.physicallyCorrectLights = true;
  }, [gl]);

  return (
    <>
      {/* <ambientLight intensity={1} /> */}
      {/* <hemisphereLight /> */}
      {/* <directionalLight intensity={4}/> */}
      {/* <pointLight position={[1, 2, -5]} intensity={1} power={30} decay={2} /> */}
      {/* <spotLight position={[0, 1.7, 0]} intensity={1} power={10} decay={2} /> */}
      {/* <pointLight position={[-1, 1.7, -5]} decay={2} intensity={1} power={50} /> */}
      {/* <pointLight position={[1, 1.7, 5]} decay={2} intensity={1} power={50} /> */}
    </>
  );
}

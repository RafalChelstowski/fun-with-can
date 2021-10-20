import { useRef } from 'react';

// import { useXR } from '@react-three/xr';

export function VrPlayer(): JSX.Element {
  // const { controllers, player, isPresenting } = useXR();
  // console.log(controllers, player, isPresenting);

  const playerRef = useRef();
  return (
    <>
      <mesh ref={playerRef} />
    </>
  );
}

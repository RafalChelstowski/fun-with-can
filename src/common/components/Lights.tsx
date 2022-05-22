import { Sky } from '@react-three/drei';

export function Lights(): JSX.Element {
  return (
    <>
      <ambientLight />
      {/* <fog attach="fog" color="white" near={5} far={50} /> */}
      <directionalLight />
      <Sky />
    </>
  );
}

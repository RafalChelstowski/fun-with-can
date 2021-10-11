import { usePlane } from '@react-three/cannon';

export function Floor(): JSX.Element {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    args: [20, 20],
    type: 'Static',
    position: [0, 1, 0],
  }));

  return (
    <mesh ref={ref}>
      <planeBufferGeometry args={[20, 20]} attach="geometry" />
      <meshPhongMaterial attach="material" color="gray" />
    </mesh>
  );
}

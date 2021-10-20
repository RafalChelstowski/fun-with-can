import { usePlane } from '@react-three/cannon';

export function Floor(): JSX.Element {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    args: [20, 20],
    type: 'Static',
    position: [0, 0, 0],
  }));

  return (
    <mesh receiveShadow ref={ref}>
      <planeBufferGeometry args={[100, 100]} />
      <meshStandardMaterial color="lightgreen" />
    </mesh>
  );
}

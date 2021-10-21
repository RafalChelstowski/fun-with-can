import { useRef } from 'react';

import { Triplet, usePlane } from '@react-three/cannon';
import { Interactive, useXR } from '@react-three/xr';

const num = 100;
const grid: number[][][] = Array.from({ length: num / 10 }).map(() => []);
Array.from({ length: num }).forEach((_, idx) => {
  const gridIdx = Math.floor(idx / 10);
  grid[gridIdx].push([gridIdx, idx - gridIdx * 10]);
});

export function Floor({
  transparent = false,
  interactive = false,
  position = [0, 0.05, 0],
}: {
  transparent?: boolean;
  interactive?: boolean;
  position?: Triplet;
}): JSX.Element {
  const { player } = useXR();
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    args: [15, 15],
    type: 'Static',
    position,
  }));

  const px = useRef(0);
  const pz = useRef(0);

  return (
    <>
      {interactive && (
        <group scale={1.5} position={[-7, 0, -7]}>
          {Array.from({ length: num }).map((_, i) => {
            const gridIdx = Math.floor(i / 10);
            const [x, z] = grid[gridIdx][i - gridIdx * 10];

            return (
              <Interactive
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                onHover={(e) => {
                  if (e.intersection) {
                    px.current = e.intersection.point.x;
                    pz.current = e.intersection.point.z;
                  }
                }}
                onSelect={() => {
                  player.position.x = px.current;
                  player.position.z = pz.current;
                }}
              >
                <mesh position={[x, 0.15, z]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeBufferGeometry args={[1, 1]} />
                  <meshStandardMaterial
                    color={undefined}
                    transparent
                    opacity={0}
                  />
                </mesh>
              </Interactive>
            );
          })}
        </group>
      )}
      <mesh receiveShadow ref={ref}>
        <planeBufferGeometry args={[15, 15]} />
        <meshStandardMaterial
          color={transparent ? undefined : 'lightgreen'}
          transparent={transparent}
          opacity={transparent ? 0 : 1}
        />
      </mesh>
    </>
  );
}

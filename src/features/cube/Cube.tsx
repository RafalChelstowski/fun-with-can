import { useState } from 'react';

import { Interactive, RayGrab } from '@react-three/xr';

interface CubeProps {
  position: [x: number, y: number, z: number];
}

export function Cube({ position }: CubeProps): JSX.Element {
  const [color, setColor] = useState<string | number>('gray');

  return (
    <Interactive
      onSelectStart={() => setColor('pink')}
      onSelectEnd={() => setColor('gray')}
    >
      <RayGrab>
        <mesh castShadow receiveShadow name="cube" position={position}>
          <boxBufferGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      </RayGrab>
    </Interactive>
  );
}

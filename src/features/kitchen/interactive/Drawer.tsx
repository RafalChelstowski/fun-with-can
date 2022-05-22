import { useState } from 'react';

import { a, useSpring } from '@react-spring/three';

import { useKitchenGltf } from '../useKitchenGltf';

export function Drawer(): JSX.Element {
  const { nodes, materials, kitchenMaterial } = useKitchenGltf();

  const [drawerOpen, toggleDrawerOpen] = useState(0);

  const { spring } = useSpring({
    spring: drawerOpen,
    config: { mass: 10, tension: 300, friction: 300, precision: 0.0001 },
  });

  const positionX = spring.to([0, 1], [2.42, 2.2]);

  return (
    <group dispose={null}>
      <a.group
        onClick={(e) => {
          e.stopPropagation();
          if (e.distance > 1.5) {
            return;
          }

          toggleDrawerOpen(Number(!drawerOpen));
        }}
        position={[2.42, 0.75, 0.245]}
        position-x={positionX}
      >
        <mesh geometry={nodes.Cube165.geometry}>{kitchenMaterial}</mesh>
        <mesh
          geometry={nodes.Cube165_1.geometry}
          material={materials.woodMaterial}
        />
      </a.group>
    </group>
  );
}

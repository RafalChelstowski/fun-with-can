import { useContextBridge } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import { OrbitControls } from './common/components/controls/OrbitControls';
import { Lights } from './common/components/lights/Lights';
import { Cube } from './features/cube/Cube';
import { Floor } from './features/floor/Floor';

export function App(): JSX.Element {
  if (!window.ReactQueryClientContext) {
    throw new Error('no react query context');
  }

  const ContextBridge = useContextBridge(window.ReactQueryClientContext);

  return (
    <main className="w-screen h-screen overflow-hidden">
      <Canvas>
        <ContextBridge>
          <Lights />
          <Cube position={[-2, 0, 0]} />
          <Cube position={[0, 0, 0]} />
          <Cube position={[2, 0, 0]} />
          <Floor />
          <OrbitControls />
        </ContextBridge>
      </Canvas>
    </main>
  );
}

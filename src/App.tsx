import { Debug, Physics } from '@react-three/cannon';
import { useContextBridge } from '@react-three/drei';
import { DefaultXRControllers, Hands, VRCanvas } from '@react-three/xr';

import { OrbitControls } from './common/components/controls/OrbitControls';
import { Lights } from './common/components/lights/Lights';
import { Cube } from './features/cube/Cube';
import { Floor } from './features/floor/Floor';
import { VrPlayer } from './features/vrplayer/VrPlayer';

export function App(): JSX.Element {
  if (!window.ReactQueryClientContext) {
    throw new Error('no react query context');
  }

  const ContextBridge = useContextBridge(window.ReactQueryClientContext);

  return (
    <main className="w-screen h-screen overflow-hidden">
      <VRCanvas>
        <ContextBridge>
          <DefaultXRControllers />
          <Hands />
          <Lights />
          <Physics>
            <Debug color="black" scale={1.1}>
              <Cube position={[0, 2, -0.5]} />
              <Floor />
              <VrPlayer />
            </Debug>
          </Physics>
          <OrbitControls />
        </ContextBridge>
      </VRCanvas>
    </main>
  );
}

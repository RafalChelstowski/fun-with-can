import { Suspense } from 'react';

import { Debug, Physics } from '@react-three/cannon';
import { Sky, useContextBridge } from '@react-three/drei';
import { DefaultXRControllers, Hands, VRCanvas } from '@react-three/xr';

import { OrbitControls } from './common/components/controls/OrbitControls';
import { HandsReady } from './common/components/HandColliders';
import { Lights } from './common/components/lights/Lights';
// import { Cube } from './features/cube/Cube';
import { Floor } from './features/floor/Floor';
import { Cylinders } from './features/harnasie/Rain';
import { Kitchen } from './features/kitchen/Kitchen';
import { VrPlayer } from './features/vrplayer/VrPlayer';

export function App(): JSX.Element {
  if (!window.ReactQueryClientContext) {
    throw new Error('no react query context');
  }

  const ContextBridge = useContextBridge(window.ReactQueryClientContext);

  return (
    <main className="w-screen h-screen overflow-hidden">
      <VRCanvas shadows>
        <ContextBridge>
          <Lights />
          <Physics
            gravity={[0, -2, 0]}
            iterations={30}
            defaultContactMaterial={{
              friction: 0.09,
            }}
          >
            <Debug color="black" scale={1.1}>
              {/* <Cube position={[0, 2, -0.5]} /> */}
              <Cylinders num={50} />
              <Floor />
              <VrPlayer />
              <Hands />
              <DefaultXRControllers />
              <HandsReady />
              <Suspense fallback={null}>
                <Kitchen />
              </Suspense>
            </Debug>
          </Physics>
          <Sky
            distance={450000}
            sunPosition={[0, 1, 0]}
            inclination={0}
            azimuth={0.25}
          />
          <OrbitControls />
        </ContextBridge>
      </VRCanvas>
    </main>
  );
}

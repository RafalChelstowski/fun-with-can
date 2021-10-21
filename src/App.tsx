import { Suspense } from 'react';

import { Physics } from '@react-three/cannon';
import { Sky, useContextBridge } from '@react-three/drei';
import { DefaultXRControllers, Hands, VRCanvas } from '@react-three/xr';
import { Route } from 'wouter';

import { OrbitControls } from './common/components/controls/OrbitControls';
import { Colliders } from './common/components/HandColliders';
import { Lights } from './common/components/lights/Lights';
import { Cube } from './features/cube/Cube';
import { Floor } from './features/floor/Floor';
import { Rain } from './features/harnasie/Rain';
import { Kitchen } from './features/kitchen/Kitchen';
import { Nav } from './features/nav/Nav';

export function App(): JSX.Element {
  if (!window.ReactQueryClientContext) {
    throw new Error('no react query context');
  }

  const ContextBridge = useContextBridge(window.ReactQueryClientContext);

  return (
    <main className="w-screen h-screen overflow-hidden">
      <Route path="/">
        <VRCanvas shadows>
          <ContextBridge>
            <Nav />
            <Lights />
            <Cube position={[0, 2, -1.5]} />
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
              <planeBufferGeometry args={[100, 100]} />
              <meshStandardMaterial color="white" />
            </mesh>
            <DefaultXRControllers />
            <spotLight castShadow position={[0, 4, 0]} />
            <OrbitControls />
          </ContextBridge>
        </VRCanvas>
      </Route>
      <Route path="/physics">
        <VRCanvas>
          <ContextBridge>
            <Nav />
            <Lights />
            <Physics
              gravity={[0, -2, 0]}
              iterations={20}
              defaultContactMaterial={{
                friction: 0.09,
              }}
            >
              <Rain num={50} />
              {/* <Debug color="black" scale={1.1}> */}
              <Floor position={[0, 1, 0]} />
              <Hands />
              <DefaultXRControllers />
              <Colliders />
              {/* </Debug> */}
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
      </Route>
      <Route path="/kitchen">
        <VRCanvas>
          <ContextBridge>
            <Nav />
            <Lights />
            <Physics
              gravity={[0, -2, 0]}
              iterations={20}
              defaultContactMaterial={{
                friction: 0.09,
              }}
            >
              {/* <Debug color="black" scale={1.1}> */}
              <Floor transparent interactive />
              <Hands />
              <DefaultXRControllers />
              <Colliders />
              <Suspense fallback={null}>
                <Kitchen />
              </Suspense>
              {/* </Debug> */}
            </Physics>
            <OrbitControls />
          </ContextBridge>
        </VRCanvas>
      </Route>
    </main>
  );
}

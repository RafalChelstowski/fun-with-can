import { Suspense } from 'react';

import { useContextBridge } from '@react-three/drei';
import { DefaultXRControllers, VRCanvas } from '@react-three/xr';
import { Route } from 'wouter';

import { OrbitControls } from './common/components/controls/OrbitControls';
import { Lights } from './common/components/lights/Lights';
import { EnviromentSetup } from './features/enviroment/EnviromentSetup';
// import Kitchen from './features/kitchen/Kitchen';
import { Env } from './features/kitchen/Env';
import { Glass } from './features/kitchen/Glass';
import { Things } from './features/kitchen/Things';
import { Walls } from './features/kitchen/Walls';

export function App(): JSX.Element {
  if (!window.ReactQueryClientContext) {
    throw new Error('no react query context');
  }

  const ContextBridge = useContextBridge(window.ReactQueryClientContext);

  return (
    <main className="w-screen h-screen overflow-hidden">
      <Route path="/">
        <VRCanvas gl={{ antialias: true }}>
          <ContextBridge>
            <Lights />
            <group rotation={[0, -Math.PI / 4.4, 0]}>
              <Suspense fallback={null}>
                {/* <Kitchen /> */}
                <Walls />
                <Things />
                <Env />
                <Glass />
                <EnviromentSetup />
              </Suspense>
            </group>

            <OrbitControls />
            <DefaultXRControllers />
          </ContextBridge>
        </VRCanvas>
      </Route>
    </main>
  );
}

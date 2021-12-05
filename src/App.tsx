import { Suspense } from 'react';

import { Environment, useContextBridge } from '@react-three/drei';
import { DefaultXRControllers, VRCanvas } from '@react-three/xr';
import { Route } from 'wouter';

import { OrbitControls } from './common/components/controls/OrbitControls';
import { Lights } from './common/components/lights/Lights';
import Kitchen from './features/kitchen/Kitchen';

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
            <Suspense fallback={null}>
              <Kitchen />
              {/* <Environment preset="park" background /> */}
            </Suspense>
            <OrbitControls />
            <DefaultXRControllers />
          </ContextBridge>
        </VRCanvas>
      </Route>
    </main>
  );
}

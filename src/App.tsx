/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Suspense } from 'react';

import { Debug, Physics } from '@react-three/cannon';
import { useContextBridge } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Route } from 'wouter';

import { Lights } from './common/components/Lights';
import { Crosshair } from './features/Crosshair';
import { StaticBounds } from './features/kitchen/Bounds';
// import { Env } from './features/kitchen/Env';
import { Floor } from './features/kitchen/Floor';
// import { Glass } from './features/kitchen/Glass';
import { KitchenModel } from './features/kitchen/KitchenModel';
// import { Surroundings } from './features/kitchen/Surroundings';
import { ToukMug } from './features/kitchen/ToukMug';
import { ToukMug2 } from './features/kitchen/ToukMug2';
import { Player } from './features/player/Player';
import { Ui } from './features/Ui';

export function App(): JSX.Element {
  if (!window.ReactQueryClientContext) {
    throw new Error('no react query context');
  }

  const ContextBridge = useContextBridge(window.ReactQueryClientContext);

  return (
    <main className="w-screen h-screen overflow-hidden">
      <Route path="/">
        <Canvas gl={{ powerPreference: 'high-performance' }}>
          <ContextBridge>
            <Lights />
            <Physics gravity={[0, -4, 0]}>
              {/*
              // @ts-ignore */}
              <Debug color="black" scale={1.01}>
                <Suspense fallback={null}>
                  <KitchenModel />
                  <StaticBounds />
                  <ToukMug />
                  {/* <ToukMug2 /> */}
                  {/* <Env /> */}
                  {/* <Glass /> */}
                  <Player />
                  <Floor />
                  {/* <Surroundings /> */}
                </Suspense>
              </Debug>
            </Physics>
          </ContextBridge>
        </Canvas>
        <Ui />
        <Crosshair />
      </Route>
    </main>
  );
}

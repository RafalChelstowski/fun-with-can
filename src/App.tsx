/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Suspense } from 'react';

import { Debug, Physics } from '@react-three/cannon';
import { useContextBridge } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Route } from 'wouter';

import { Lights } from './common/components/Lights';
import { ikeaGlassMaterial } from './common/materials/materials';
import { Crosshair } from './features/Crosshair';
import { StaticBounds } from './features/kitchen/Bounds';
import { Env } from './features/kitchen/Env';
import { Floor } from './features/kitchen/Floor';
import { Glass } from './features/kitchen/Glass';
import { InstancedKitchenObject } from './features/kitchen/InstancedKitchenObject';
import { KitchenModel } from './features/kitchen/KitchenModel';
import { Surroundings } from './features/kitchen/Surroundings';
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
                  <InstancedKitchenObject
                    initialPosition={[-2.5, 1.5, -5.55]}
                    objName="mugs"
                    geometryName="toukMug1"
                    materialName="yellowToukCupMaterial"
                    gltfName="/toukMug.gltf"
                  />
                  <InstancedKitchenObject
                    initialPosition={[-2.45, 1.6, -5.57]}
                    objName="mugs2"
                    geometryName="toukMug2"
                    materialName="salmonToukCupMaterial"
                    gltfName="/toukMug2.gltf"
                    itemsNumber={8}
                    rowModifier={4}
                  />
                  <InstancedKitchenObject
                    initialPosition={[-1.93, 1.5, -5.65]}
                    objName="ikeaGlass"
                    geometryName="IKEAglass"
                    materialName="lol"
                    customMaterial={ikeaGlassMaterial}
                    gltfName="/ikeaGlass.gltf"
                    itemsNumber={18}
                    rowModifier={6}
                  />
                  <InstancedKitchenObject
                    initialPosition={[-1.25, 1.5, -5.72]}
                    objName="ikeaMug1"
                    geometryName="IKEAmug1"
                    materialName="pinkCupMaterial"
                    gltfName="/ikeaMug1.gltf"
                    itemsNumber={10}
                    rowModifier={5}
                  />
                  <InstancedKitchenObject
                    initialPosition={[-0.6, 1.5, -5.6]}
                    objName="ikeaMug2"
                    geometryName="IKEAMug2"
                    materialName="blueCupMaterial"
                    gltfName="/ikeaMug2.gltf"
                    itemsNumber={10}
                    rowModifier={5}
                  />
                  <Env />
                  <Glass />
                  <Player />
                  <Floor />
                  <Surroundings />
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

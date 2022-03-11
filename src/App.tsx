import {
  PropsWithChildren,
  ReactNode,
  Suspense,
  useEffect,
  useState,
} from 'react';

import { Physics } from '@react-three/cannon';
import {
  Environment,
  OrbitControls,
  useContextBridge,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { DefaultXRControllers, VRCanvas } from '@react-three/xr';
import { Route } from 'wouter';

import { Lights } from './common/components/lights/Lights';
import { LockButton } from './common/components/lock-button/LockButton';
import { Rain } from './features/harnasie/Rain';
import { Env } from './features/kitchen/Env';
import { Floor } from './features/kitchen/Floor';
import { Glass } from './features/kitchen/Glass';
import { Things } from './features/kitchen/Things';
import { Walls } from './features/kitchen/Walls';
import { Player } from './features/player/Player';
import { NavigatorWithXR } from './types';

// function KitchenCanvas({ children }: PropsWithChildren<ReactNode>) {
//   const [isVr, setIsVr] = useState(false);

//   if (!window.ReactQueryClientContext) {
//     throw new Error('no react query context');
//   }

//   const ContextBridge = useContextBridge(window.ReactQueryClientContext);

//   useEffect(() => {
//     async function checkForVr() {
//       const isVrSupported = await (
//         navigator as NavigatorWithXR
//       ).xr.isSessionSupported('immersive-vr');

//       setIsVr(isVrSupported);
//     }

//     checkForVr();
//   });

//   if (isVr) {
//     return (
//       <VRCanvas gl={{ antialias: true }}>
//         <ContextBridge>
//           {children}
//           <DefaultXRControllers />
//         </ContextBridge>
//       </VRCanvas>
//     );
//   }

//   return (
//     <>
//       <Canvas>
//         <ContextBridge>
//           {children}
//           {/* <OrbitControls /> */}
//           <Physics>
//             <Player />
//             <Floor />
//             <Suspense fallback={null}>
//               <Environment background files="/touk.hdr" />
//             </Suspense>
//           </Physics>
//         </ContextBridge>
//       </Canvas>
//       <LockButton />
//     </>
//   );
// }

export function App(): JSX.Element {
  return (
    <main className="w-screen h-screen overflow-hidden">
      {/* <Route path="/"> */}
      <Canvas>
        <Lights />
        {/* <group rotation={[0, -Math.PI / 4.4, 0]}>
            <Suspense fallback={null}>
              <Walls />
              <Things />
              <Env />
              <Glass />
            </Suspense>
          </group> */}
        {/* <Suspense fallback={null}>
            <Environment background files="/touk.hdr" />
          </Suspense> */}
        <Physics size={2000} gravity={[0, -1, 0]}>
          <Suspense fallback={null}>
            <Rain num={30} />
          </Suspense>
          <Floor />
          <Player />
        </Physics>
      </Canvas>
      <LockButton />
      {/* </Route> */}
    </main>
  );
}

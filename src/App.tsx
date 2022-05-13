/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ReactNode, Suspense } from 'react';
import { ToastContainer } from 'react-toastify';

import { Debug, Physics } from '@react-three/cannon';
import { useContextBridge } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import isEmpty from 'lodash/isEmpty';
import { Redirect, Route } from 'wouter';

import { useSnapshot } from './api/hooks/useSnapshot';
import { useUser } from './api/hooks/useUser';
import { Lights } from './common/components/Lights';
import { LockButton } from './common/components/LockButton';
import { PointerSpeedSlider } from './common/components/PointerSpeedSlider';
import { Crosshair } from './features/Crosshair';
import { StaticBounds } from './features/kitchen/Bounds';
import { Env } from './features/kitchen/Env';
import { Floor } from './features/kitchen/Floor';
import { Glass } from './features/kitchen/Glass';
import { InstancedKitchenObject } from './features/kitchen/InstancedKitchenObject';
import { Neon } from './features/kitchen/interactive/Neon';
import { KitchenModel } from './features/kitchen/KitchenModel';
import { Surroundings } from './features/kitchen/Surroundings';
import { Player } from './features/player/Player';
import { routes, Ui } from './features/Ui';
import { Achievements as AchievementsPage } from './features/user/Achievements';
import { PasswordForgetPage } from './features/user/PasswordForget';
import { SignInPage } from './features/user/SignIn';
import { SignOutPage } from './features/user/SignOut';
import { SignUpPage } from './features/user/SignUp';
import { UserAccountPage } from './features/user/UserAccountPage';
import { useStore } from './store/store';
import { Achievements } from './types';

function UserMenus() {
  const { uid } = useUser();
  const achievements = useStore((state) => state.achievements);
  const setAchievements = useStore((state) => state.setAchievements);

  useSnapshot<Achievements | null>(`users/${uid}/achievements`, {
    enabled: Boolean(uid) && isEmpty(achievements),
    onSuccess: (d) => {
      if (d) {
        setAchievements(d);
      }
    },
  });

  return (
    <Ui>
      <Route path="/">
        <LockButton />
        <PointerSpeedSlider />
      </Route>
      <Route
        path={routes.SIGN_IN}
        component={uid ? () => <Redirect to={routes.HOME} /> : SignInPage}
      />
      <Route
        path={routes.SIGN_UP}
        component={uid ? () => <Redirect to={routes.HOME} /> : SignUpPage}
      />
      <Route
        path={routes.ACCOUNT}
        component={uid ? UserAccountPage : () => <Redirect to={routes.HOME} />}
      />
      <Route path={routes.ACHIEVEMENTS} component={AchievementsPage} />
      <Route
        path={routes.PASSWORD_FORGET}
        component={
          uid ? () => <Redirect to={routes.HOME} /> : PasswordForgetPage
        }
      />
      <Route path={routes.SIGN_OUT} component={SignOutPage} />
    </Ui>
  );
}

function DevDebug({ children }: { children: ReactNode }): JSX.Element {
  const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

  return isDev ? (
    <Debug color="black" scale={1.01}>
      {children}
    </Debug>
  ) : (
    <>{children}</>
  );
}

export function App(): JSX.Element {
  if (!window.ReactQueryClientContext) {
    throw new Error('no react query context');
  }

  const ContextBridge = useContextBridge(window.ReactQueryClientContext);

  return (
    <main className="w-screen h-screen overflow-hidden">
      <Canvas gl={{ powerPreference: 'high-performance' }} camera={{ fov: 55 }}>
        <ContextBridge>
          <Lights />
          <Physics gravity={[0, -3, 0]}>
            <DevDebug>
              <Suspense fallback={null}>
                <KitchenModel />
                <StaticBounds />
                <InstancedKitchenObject
                  initialPosition={[-2.3, 1.5, -5.55]}
                  objName="mugs"
                  geometryName="toukMug1"
                  materialName="yellowToukCupMaterial"
                  gltfName="/toukMug.gltf"
                  itemsNumber={12}
                  rowModifier={6}
                />
                <InstancedKitchenObject
                  initialPosition={[-1.33, 1.5, -5.65]}
                  objName="mugs2"
                  geometryName="toukMug2"
                  materialName="salmonToukCupMaterial"
                  gltfName="/toukMug2.gltf"
                  itemsNumber={16}
                  rowModifier={8}
                />
                <Env />
                <Neon />
                <Glass />
                <Player />
                <Floor />
                <Surroundings />
              </Suspense>
            </DevDebug>
          </Physics>
        </ContextBridge>
      </Canvas>
      <UserMenus />
      <Crosshair />
      <ToastContainer theme="light" autoClose={3000} />
    </main>
  );
}

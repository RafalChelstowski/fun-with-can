import { isEmpty } from 'lodash';
import { Redirect, Route } from 'wouter';

import { useSnapshot } from '../../api/hooks/useSnapshot';
import { useUser } from '../../api/hooks/useUser';
import { LockButton } from '../../common/components/LockButton';
import { PointerSpeedSlider } from '../../common/components/PointerSpeedSlider';
import { useStore } from '../../store/store';
import { Achievements } from '../../types';
import { Nav, routes } from '../Nav';
import { Achievements as AchievementsPage } from './Achievements';
import { PasswordForgetPage } from './PasswordForget';
import { SignInPage } from './SignIn';
import { SignOutPage } from './SignOut';
import { SignUpPage } from './SignUp';
import { UserAccountPage } from './UserAccountPage';

export function UserMenus(): JSX.Element | null {
  const isLocked = useStore((state) => state.isLocked);
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

  if (isLocked) {
    return null;
  }

  return (
    <div className="flex absolute w-screen h-screen justify-center z-50 top-0 left-0 bg-gray-400 bg-opacity-75">
      <Nav />
      <Route path="/">
        <div className="flex-col items-center w-2/3 mt-40">
          <div className="flex w-full items-center justify-around bg-gray-50 py-8">
            <h1>Work in progress ;)</h1>
          </div>
          <div className="flex w-full items-center justify-around bg-gray-50 py-8">
            <p>WASDA to move</p>
            <p>LEFTCLICK to pick/open/interact</p>
            <p>SPACE to throw</p>
          </div>
          <div className="flex w-full items-center justify-around bg-gray-50 py-8">
            <LockButton />
            <PointerSpeedSlider />
          </div>
        </div>
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
    </div>
  );
}

import { ReactNode, useCallback } from 'react';

import { Link } from 'wouter';

import { userApi } from '../api';
import { useUser } from '../api/hooks/useUser';
import { useStore } from '../store/store';
import { SignOutButton } from './user/SignOutButton';

export const HOME = '/';
export const SIGN_UP = '/signup';
export const SIGN_IN = '/signin';
export const SIGN_OUT = '/signout';
export const ACCOUNT = '/account';
export const PASSWORD_FORGET = '/pw-forget';

export const routes = {
  HOME,
  SIGN_UP,
  SIGN_IN,
  SIGN_OUT,
  ACCOUNT,
  PASSWORD_FORGET,
};

const linkClass = 'pr-4';

export function Ui({ children }: { children: ReactNode }): JSX.Element | null {
  const isLocked = useStore(useCallback((state) => state.isLocked, []));
  const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
  const { uid } = useUser();

  if (isLocked) {
    return null;
  }

  return (
    <div className="absolute w-screen h-screen z-50 top-0 left-0 bg-gray-400 bg-opacity-75">
      <nav className="absolute z-1000 top-0 left-0">
        <Link className={linkClass} to={HOME}>
          Home
        </Link>
        {uid ? (
          <>
            <Link className={linkClass} to={ACCOUNT}>
              Account
            </Link>
            <SignOutButton route={routes.HOME} />
          </>
        ) : (
          <>
            <Link className={linkClass} to={SIGN_IN}>
              Sign In
            </Link>
            <Link className={linkClass} to={SIGN_UP}>
              Sign Up
            </Link>
            {isDev && (
              <button type="button" onClick={() => userApi.signInTestUser()}>
                Test Sign In
              </button>
            )}
          </>
        )}
      </nav>
      {children}
    </div>
  );
}

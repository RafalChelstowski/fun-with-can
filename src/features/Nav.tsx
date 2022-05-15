import { toast } from 'react-toastify';

import { Link } from 'wouter';

import { userApi } from '../api';
import { useUser } from '../api/hooks/useUser';
import { SignOutButton } from './user/SignOutButton';

export const HOME = '/';
export const SIGN_UP = '/signup';
export const SIGN_IN = '/signin';
export const SIGN_OUT = '/signout';
export const ACCOUNT = '/account';
export const ACHIEVEMENTS = '/achievements';
export const PASSWORD_FORGET = '/pw-forget';

export const routes = {
  HOME,
  SIGN_UP,
  SIGN_IN,
  SIGN_OUT,
  ACCOUNT,
  ACHIEVEMENTS,
  PASSWORD_FORGET,
};

const linkClass = 'pr-4';

export function Nav(): JSX.Element | null {
  const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
  const { uid } = useUser();

  return (
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
            Log In
          </Link>
          <Link className={linkClass} to={SIGN_UP}>
            Create account
          </Link>
          {isDev && (
            <button
              className={linkClass}
              type="button"
              onClick={async () => {
                try {
                  await userApi.signInTestUser();
                  toast.success('Signed In!');
                } catch (err) {
                  toast.error('Error signing in...');
                }
              }}
            >
              Test Sign In
            </button>
          )}
        </>
      )}
      <Link className={linkClass} to={ACHIEVEMENTS}>
        Achievements
      </Link>
    </nav>
  );
}

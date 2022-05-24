import { useLocation } from 'wouter';

import { userApi } from '../../api';

export function SignOutButton({ route }: { route: string }): JSX.Element {
  const [, setLocation] = useLocation();

  return (
    <button
      className="nav-link flex"
      type="button"
      onClick={async () => {
        try {
          await userApi.doSignOut();

          setLocation(route);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error);
        }
      }}
    >
      Sign Out
    </button>
  );
}

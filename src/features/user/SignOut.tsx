import { useEffect } from 'react';

import { userApi } from '../../api';

export function SignOutPage(): null {
  useEffect(() => {
    async function signOut() {
      try {
        await userApi.doSignOut();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }

    signOut();
  }, []);

  return null;
}

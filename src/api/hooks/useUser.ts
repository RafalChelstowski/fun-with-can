import { useEffect, useState } from 'react';

import { auth } from '../user';

export interface UseUser {
  uid?: string;
  displayName?: string | null;
}

export function useUser(): UseUser {
  const [user, setUser] = useState(() => auth.currentUser);

  useEffect(() => {
    const firebaseAuthListener = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
      } else {
        setUser(null);
      }
    });

    return () => {
      firebaseAuthListener();
      setUser(null);
    };
  }, []);

  return { uid: user?.uid, displayName: user?.displayName };
}

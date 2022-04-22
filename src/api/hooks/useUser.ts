import { useEffect, useState } from 'react';

import { auth } from '../user';

export interface UseUser {
  uid: string | undefined;
}

export function useUser(): UseUser {
  const [uid, setUid] = useState(() => auth.currentUser?.uid);

  useEffect(() => {
    const firebaseAuthListener = auth.onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(undefined);
      }
    });

    return () => {
      firebaseAuthListener();
      setUid(undefined);
    };
  }, []);

  return { uid };
}

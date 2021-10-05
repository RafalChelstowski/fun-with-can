import { useCallback } from 'react';

import { useStore } from '../../../store/store';

export function LockButton(): JSX.Element {
  const toggleIsLocked = useStore(
    useCallback((state) => state.toggleIsLocked, [])
  );

  return (
    <button onClick={toggleIsLocked} type="button">
      Lock
    </button>
  );
}

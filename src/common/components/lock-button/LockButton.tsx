import { useCallback } from 'react';

import { useStore } from '../../../store/store';

export function LockButton(): JSX.Element {
  // const toggleIsLocked = useStore(
  //   useCallback((state) => state.toggleIsLocked, [])
  // );

  return (
    <button
      className="absolute bottom-7 left-auto z-50"
      // onClick={toggleIsLocked}
      type="button"
      name="Play"
    >
      Lock
    </button>
  );
}

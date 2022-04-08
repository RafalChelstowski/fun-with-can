import { useCallback } from 'react';

import { LockButton } from '../common/components/lock-button/LockButton';
import { useStore } from '../store/store';

export function Ui(): JSX.Element | null {
  const isLocked = useStore(useCallback((state) => state.isLocked, []));

  if (isLocked) {
    return null;
  }

  return (
    <div className="absolute w-screen h-screen z-50 top-0 left-0 bg-gray-400 bg-opacity-75">
      <LockButton />
    </div>
  );
}

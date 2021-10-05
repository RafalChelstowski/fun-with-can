import { useState } from 'react';

import { KeyboardKeys } from '../../types';
import useEventListener from './useEventListener';

interface UseControlsHook {
  controlsUp: boolean;
  controlsDown: boolean;
  controlsLeft: boolean;
  controlsRight: boolean;
}

export default function useControls(): UseControlsHook {
  const [controlsUp, setControlsUp] = useState(false);
  const [controlsDown, setControlsDown] = useState(false);
  const [controlsLeft, setControlsLeft] = useState(false);
  const [controlsRight, setControlsRight] = useState(false);

  useEventListener<KeyboardEvent>('keydown', ({ key }) => {
    switch (key.toLowerCase()) {
      case KeyboardKeys.W:
        setControlsUp(true);
        break;
      case KeyboardKeys.S:
        setControlsDown(true);
        break;
      case KeyboardKeys.A:
        setControlsLeft(true);
        break;
      case KeyboardKeys.D:
        setControlsRight(true);
        break;
      default:
        break;
    }
  });

  useEventListener<KeyboardEvent>('keyup', ({ key }) => {
    switch (key.toLowerCase()) {
      case KeyboardKeys.W:
        setControlsUp(false);
        break;
      case KeyboardKeys.S:
        setControlsDown(false);
        break;
      case KeyboardKeys.A:
        setControlsLeft(false);
        break;
      case KeyboardKeys.D:
        setControlsRight(false);
        break;

      default:
        break;
    }
  });

  return {
    controlsUp,
    controlsDown,
    controlsLeft,
    controlsRight,
  };
}

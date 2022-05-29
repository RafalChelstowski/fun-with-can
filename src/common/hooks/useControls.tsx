import { useEvent } from 'react-use';

import { setState, useStore } from '../../store/store';
import { KeyboardKeys } from '../../types';

export function useControls(): void {
  const isLocked = useStore((state) => state.isLocked);

  useEvent('keydown', ({ key }) => {
    if (!key || !isLocked) {
      return;
    }

    switch (key.toLowerCase()) {
      case KeyboardKeys.W:
        setState((state) => ({
          controls: { ...state.controls, controlsUp: true },
        }));
        break;
      case KeyboardKeys.S:
        setState((state) => ({
          controls: { ...state.controls, controlsDown: true },
        }));
        break;
      case KeyboardKeys.A:
        setState((state) => ({
          controls: { ...state.controls, controlsLeft: true },
        }));
        break;
      case KeyboardKeys.D:
        setState((state) => ({
          controls: { ...state.controls, controlsRight: true },
        }));
        break;
      default:
        break;
    }
  });

  useEvent('keyup', ({ key }) => {
    if (!key || !isLocked) {
      return;
    }

    switch (key.toLowerCase()) {
      case KeyboardKeys.W:
        setState((state) => ({
          controls: { ...state.controls, controlsUp: false },
        }));
        break;
      case KeyboardKeys.S:
        setState((state) => ({
          controls: { ...state.controls, controlsDown: false },
        }));
        break;
      case KeyboardKeys.A:
        setState((state) => ({
          controls: { ...state.controls, controlsLeft: false },
        }));
        break;
      case KeyboardKeys.D:
        setState((state) => ({
          controls: { ...state.controls, controlsRight: false },
        }));
        break;

      default:
        break;
    }
  });
}

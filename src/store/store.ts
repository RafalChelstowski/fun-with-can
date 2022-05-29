import { produce } from 'immer';
import create, { StateSelector } from 'zustand';
import { devtools } from 'zustand/middleware';
import shallow from 'zustand/shallow';

import { State } from '../types';

export const initialState = {
  controls: {
    controlsUp: false,
    controlsDown: false,
    controlsLeft: false,
    controlsRight: false,
  },
  letters: {},
  achievements: {},
  playerStatus: null,
  isLocked: false,
  pointerSpeed: '0.2',
};

const useStoreImpl = create<State>(
  devtools(
    (set) => ({
      ...initialState,
      setAchievement: (name, payload) => {
        set(
          produce<State>((state) => {
            state.achievements[name] = payload;
          })
        );
      },
      setAchievements: (achievements) => {
        set(() => ({ achievements }));
      },
      toggleIsLocked: () => set((state) => ({ isLocked: !state.isLocked })),
      setPlayerStatus: (status) => set(() => ({ playerStatus: status })),
    }),
    { name: 'kitchenStore' }
  )
);

export { shallow };

const useStore = <T>(sel: StateSelector<State, T>): T =>
  useStoreImpl(sel, shallow);

Object.assign(useStore, useStoreImpl);

const { getState, setState, subscribe } = useStoreImpl;

export { getState, setState, subscribe, useStore };

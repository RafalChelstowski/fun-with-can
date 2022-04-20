import { produce } from 'immer';
import create, { StateSelector } from 'zustand';
import { devtools } from 'zustand/middleware';
import shallow from 'zustand/shallow';

import {
  InteractiveObjects,
  InteractiveObjectStatus,
  PlayerStatus,
  State,
} from '../types';

const interactiveObjectsInitialState: InteractiveObjects = {
  grip: {
    status: InteractiveObjectStatus.ATTACHED_EXPRESS,
  },
  mugs: {
    status: InteractiveObjectStatus.DROPPED,
  },
  mugs2: {
    status: InteractiveObjectStatus.DROPPED,
  },
};

export const initialState = {
  playerStatus: null,
  interactiveObjects: { ...interactiveObjectsInitialState },
  isLocked: false,
  point: null,
};

const useStoreImpl = create<State>(
  devtools(
    (set, get) => ({
      ...initialState,
      toggleIsLocked: () => set((state) => ({ isLocked: !state.isLocked })),
      setPlayerStatus: (status) => set(() => ({ playerStatus: status })),
      setInteractiveObject: (key, obj) =>
        set(
          produce<State>((state) => {
            state.interactiveObjects[key] = {
              ...state.interactiveObjects[key],
              ...obj,
            };
          })
        ),
      handleEvent: (event) => {
        if (event.distance > 2 && get().playerStatus === PlayerStatus.PICKED) {
          set(() => ({
            playerStatus: PlayerStatus.THROWING,
            point: event.point,
          }));

          return;
        }

        if (
          get().interactiveObjects.grip.status ===
          InteractiveObjectStatus.PICKED
        ) {
          set(() => ({
            point: event.point,
          }));
          set(
            produce<State>((state) => {
              state.interactiveObjects.grip.status =
                InteractiveObjectStatus.DROPPED;
              state.playerStatus = null;
            })
          );
        }

        if (
          get().interactiveObjects.mugs.status ===
          InteractiveObjectStatus.PICKED
        ) {
          set(() => ({
            point: event.point,
          }));
          set(
            produce<State>((state) => {
              state.interactiveObjects.mugs.status =
                InteractiveObjectStatus.DROPPED;
              state.playerStatus = null;
            })
          );
        }

        if (
          get().interactiveObjects.mugs2.status ===
          InteractiveObjectStatus.PICKED
        ) {
          set(() => ({
            point: event.point,
          }));
          set(
            produce<State>((state) => {
              state.interactiveObjects.mugs2.status =
                InteractiveObjectStatus.DROPPED;
              state.playerStatus = null;
            })
          );
        }
      },
    }),
    { name: 'kitchenStore' }
  )
);

export { shallow };

const useStore = <T>(sel: StateSelector<State, T>): T =>
  useStoreImpl(sel, shallow);

Object.assign(useStore, useStoreImpl);

const { getState, setState } = useStoreImpl;

export { getState, setState, useStore };

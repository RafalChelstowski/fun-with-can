import create from 'zustand';

import { State } from '../types';

export const useStore = create<State>((set) => ({
  isLocked: false,
  toggleIsLocked: () => set((state) => ({ isLocked: !state.isLocked })),
}));

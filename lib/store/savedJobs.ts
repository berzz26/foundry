'use client';

import { create } from 'zustand';

interface SavedJobsState {
  ids: string[];
  setIds: (ids: string[]) => void;
  addId: (id: string) => void;
  removeId: (id: string) => void;
}

export const useSavedJobsStore = create<SavedJobsState>((set) => ({
  ids: [],
  setIds: (ids) => set({ ids }),
  addId: (id) => set((s) => (s.ids.includes(id) ? s : { ids: [...s.ids, id] })),
  removeId: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
}));

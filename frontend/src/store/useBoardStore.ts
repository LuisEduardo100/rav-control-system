// src/store/useBoardStore.ts
import { create } from 'zustand';
import type { Group } from '../types/groupType';
import { api } from '../services/api';

interface BoardStore {
  groups: Group[];
  fetchGroups: () => Promise<void>;
  createGroup: (name: string) => Promise<void>;
  moveActivity: (
    activityId: number,
    sourceGroupId: number,
    targetGroupId: number,
    targetIndex: number
  ) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  groups: [],

  fetchGroups: async () => {
    const { data } = await api.get<Group[]>('/groups');
    set({ groups: data });
  },

  createGroup: async (name) => {
    const { data } = await api.post<Group>('/groups', { name });
    set((state) => ({ groups: [...state.groups, data] }));
  },

  moveActivity: (activityId, sourceGroupId, targetGroupId, targetIndex) => {
    set((state) => {
      const groups = [...state.groups];
      const source = groups.find((g) => g.id === sourceGroupId)!;
      const target = groups.find((g) => g.id === targetGroupId)!;

      const [moved] = source.activities.splice(
        source.activities.findIndex((a) => a.id === activityId),
        1
      );

      target.activities.splice(targetIndex, 0, moved);
      return { groups };
    });
  },
}));

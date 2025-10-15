// src/store/useBoardStore.ts
import { create } from 'zustand';
import type { GroupType } from '../types/groupType';
import { api } from '../services/api';

interface BoardStore {
  groups: GroupType[];
  fetchGroups: () => Promise<void>;
  createGroup: (name: string) => Promise<void>;
  moveActivity: (
    activityId: number,
    sourceGroupId: number,
    targetGroupId: number,
    sourceIndex: number,
    targetIndex: number
  ) => void;
  persistActivityMove: (
    activityId: number,
    payload: MoveActivityPayload
  ) => void;
}

interface MoveActivityPayload {
  targetGroupId: number;
  newPosition: number;
}

export const useBoardStore = create<BoardStore>((set) => ({
  groups: [],

  fetchGroups: async () => {
    const { data } = await api.get<GroupType[]>('/groups');

    const sortedGroups = data.sort((a, b) => a.position - b.position);
    sortedGroups.forEach((group) => {
      group.activities.sort((a, b) => a.position - b.position);
    });

    set({ groups: sortedGroups });
  },

  createGroup: async (name) => {
    const { data } = await api.post<GroupType>('/groups', { name });
    set((state) => ({ groups: [...state.groups, data] }));
  },

  moveActivity: (
    activityId,
    sourceGroupId,
    targetGroupId,
    sourceIndex,
    targetIndex
  ) => {
    set((state) => {
      const newGroups = state.groups.map((g) => ({
        ...g,
        activities: [...g.activities],
      }));

      const sourceGroup = newGroups.find((g) => g.id === sourceGroupId)!;
      const targetGroup = newGroups.find((g) => g.id === targetGroupId)!;

      // Remove a atividade do grupo de origem
      const [movedActivity] = sourceGroup.activities.splice(sourceIndex, 1);

      // Adiciona a atividade no grupo de destino na posição correta
      targetGroup.activities.splice(targetIndex, 0, movedActivity);

      return { groups: newGroups };
    });
  },

  persistActivityMove: async (
    activityId: number,
    payload: MoveActivityPayload
  ) => {
    try {
      await api.patch(`/activities/${activityId}/move`, payload);
    } catch (error) {
      console.error('Falha ao salvar a nova posição da atividade.', error);
    }
  },
}));

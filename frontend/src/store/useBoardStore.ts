import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import type { GroupType } from '../types/groupType';
import { api } from '../services/api';

interface MoveActivityPayload {
  targetGroupId: number;
  newPosition: number;
}

interface BoardStore {
  groups: GroupType[];
  fetchGroups: () => Promise<void>;
  createGroup: (name: string) => Promise<void>;
  updateGroup: (id: number, name: string) => Promise<void>;
  deleteGroup: (id: number) => Promise<void>;
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
  ) => Promise<void>;
}

export const useBoardStore = create<BoardStore>((set) => ({
  groups: [],

  fetchGroups: async () => {
    try {
      const { data } = await api.get<GroupType[]>('/groups');

      const sortedGroups = [...data].sort((a, b) => a.position - b.position);

      const groupsWithSortedActivities = sortedGroups.map((group) => ({
        ...group,
        activities: [...group.activities].sort(
          (a, b) => a.position - b.position
        ),
      }));

      set({ groups: groupsWithSortedActivities });
    } catch (error) {
      console.error('Falha ao buscar os grupos.', error);
    }
  },

  createGroup: async (name) => {
    const { data } = await api.post<GroupType>('/groups', { name });
    set((state) => ({ groups: [...state.groups, data] }));
  },

  updateGroup: async (id, name) => {
    const { data } = await api.put<GroupType>(`/groups/${id}`, { name });
    set((state) => ({
      groups: state.groups.map((g) => (g.id === id ? { ...g, ...data } : g)),
    }));
  },

  deleteGroup: async (id) => {
    await api.delete(`/groups/${id}`);
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== id),
    }));
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

      const sourceGroup = newGroups.find((g) => g.id === sourceGroupId);
      const targetGroup = newGroups.find((g) => g.id === targetGroupId);

      if (!sourceGroup || !targetGroup) {
        return { groups: state.groups };
      }

      if (sourceGroupId === targetGroupId) {
        targetGroup.activities = arrayMove(
          sourceGroup.activities,
          sourceIndex,
          targetIndex
        );
      } else {
        const [movedActivity] = sourceGroup.activities.splice(sourceIndex, 1);
        targetGroup.activities.splice(targetIndex, 0, movedActivity);
      }

      return { groups: newGroups };
    });
  },

  persistActivityMove: async (activityId, payload) => {
    try {
      await api.patch(`/activities/${activityId}/move`, payload);
    } catch (error) {
      console.error('Falha ao salvar a nova posição da atividade.', error);
    }
  },
}));

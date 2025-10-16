import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import { api } from '../services/api';
import { activityService } from '../services/activityService';
import { useActivityStore } from './useActivityStore';
import type { GroupType } from '../types/groupType';
import type {
  CreateActivityRequestDTO,
  UpdateActivityRequestDTO,
  MoveActivityRequestDTO,
} from '../types/activityType';

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
    payload: MoveActivityRequestDTO
  ) => Promise<void>;
  createActivity: (dto: CreateActivityRequestDTO) => Promise<void>;
  updateActivity: (
    activityId: number,
    dto: UpdateActivityRequestDTO
  ) => Promise<void>;
  deleteActivity: (activityId: number, groupId: number) => Promise<void>;
}

export const useBoardStore = create<BoardStore>((set, get) => ({
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
    try {
      const { data } = await api.post<GroupType>('/groups', { name });
      set((state) => ({ groups: [...state.groups, data] }));
    } catch (error) {
      console.error('Falha ao criar o grupo.', error);
    }
  },

  updateGroup: async (id, name) => {
    const previousGroups = get().groups;
    set((state) => ({
      groups: state.groups.map((g) => (g.id === id ? { ...g, name } : g)),
    }));

    try {
      await api.put(`/groups/${id}`, { name });
    } catch (error) {
      console.error('Falha ao atualizar o grupo. Revertendo.', error);
      set({ groups: previousGroups });
    }
  },

  deleteGroup: async (id) => {
    const previousGroups = get().groups;
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== id),
    }));

    try {
      await api.delete(`/groups/${id}`);
    } catch (error) {
      console.error('Falha ao excluir o grupo. Revertendo.', error);
      set({ groups: previousGroups });
    }
  },

  createActivity: async (dto) => {
    try {
      const newActivity = await activityService.create(dto);
      set((state) => ({
        groups: state.groups.map((g) =>
          g.id === dto.groupId
            ? { ...g, activities: [...g.activities, newActivity] }
            : g
        ),
      }));
      useActivityStore.getState().closeActivityModal();
    } catch (error) {
      console.error('Falha ao criar atividade.', error);
    }
  },

  updateActivity: async (activityId, dto) => {
    const previousGroups = get().groups;
    const activityToUpdate = previousGroups
      .flatMap((g) => g.activities)
      .find((a) => a.id === activityId);

    if (!activityToUpdate) return;

    const updatedActivity = { ...activityToUpdate, ...dto };
    set((state) => ({
      groups: state.groups.map((g) => ({
        ...g,
        activities: g.activities.map((a) =>
          a.id === activityId ? updatedActivity : a
        ),
      })),
    }));

    useActivityStore.getState().closeActivityModal();

    try {
      await activityService.update(activityId, dto, activityToUpdate.groupId);
    } catch (error) {
      console.error('Falha ao atualizar atividade. Revertendo.', error);
      set({ groups: previousGroups });
    }
  },

  deleteActivity: async (activityId, groupId) => {
    const previousGroups = get().groups;
    set((state) => ({
      groups: state.groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              activities: g.activities.filter((a) => a.id !== activityId),
            }
          : g
      ),
    }));

    try {
      await activityService.remove(activityId);
    } catch (error) {
      console.error('Falha ao excluir atividade. Revertendo.', error);
      set({ groups: previousGroups });
    }
  },

  moveActivity: (sourceGroupId, targetGroupId, sourceIndex, targetIndex) => {
    set((state) => {
      const newGroups = state.groups.map((g) => ({
        ...g,
        activities: [...g.activities],
      }));

      const sourceGroup = newGroups.find((g) => g.id === sourceGroupId);
      const targetGroup = newGroups.find((g) => g.id === targetGroupId);

      if (!sourceGroup || !targetGroup) return { groups: state.groups };

      if (sourceGroupId === targetGroupId) {
        targetGroup.activities = arrayMove(
          sourceGroup.activities,
          sourceIndex,
          targetIndex
        );
      } else {
        const [movedActivity] = sourceGroup.activities.splice(sourceIndex, 1);
        movedActivity.groupId = targetGroupId;
        targetGroup.activities.splice(targetIndex, 0, movedActivity);
      }

      return { groups: newGroups };
    });
  },

  persistActivityMove: async (activityId, payload) => {
    try {
      await activityService.move(activityId, payload);
    } catch (error) {
      console.error('Falha ao salvar a nova posição. Revertendo.', error);
      get().fetchGroups();
    }
  },
}));

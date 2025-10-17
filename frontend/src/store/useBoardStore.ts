import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import { activityService } from '../services/activityService';
import { useActivityStore } from './useActivityStore';
import { useToastStore } from './useToastStore';
import type { BoardStoreType } from '../types/boardStoreType';
import { groupService } from '../services/groupService';

export const useBoardStore = create<BoardStoreType>((set, get) => ({
  groups: [],

  fetchGroups: async () => {
    try {
      const data = await groupService.getAll();

      const sortedGroups = [...data].sort((a, b) => a.position - b.position);

      const groupsWithSortedActivities = sortedGroups.map((group) => ({
        ...group,
        activities: [...group.activities]
          .sort((a, b) => a.position - b.position)
          .map((activity) => ({
            ...activity,
            groupId: group.id,
          })),
      }));

      set({ groups: groupsWithSortedActivities });
    } catch (error) {
      console.error('Falha ao buscar os grupos.', error);
      useToastStore
        .getState()
        .addToast('Não foi possível carregar o quadro.', 'error');
    }
  },

  createGroup: async (name) => {
    try {
      const newGroup = await groupService.create(name);
      set((state) => ({ groups: [...state.groups, newGroup] }));
      useToastStore
        .getState()
        .addToast(`Grupo "${name}" criado com sucesso!`, 'success');
    } catch (error) {
      console.error('Falha ao criar o grupo.', error);
      useToastStore.getState().addToast('Falha ao criar o grupo.', 'error');
    }
  },

  updateGroup: async (id, name) => {
    const previousGroups = get().groups;
    set((state) => ({
      groups: state.groups.map((g) => (g.id === id ? { ...g, name } : g)),
    }));

    try {
      await groupService.update(id, name);
      useToastStore.getState().addToast('Grupo atualizado!', 'success');
    } catch (error) {
      console.error('Falha ao atualizar o grupo. Revertendo.', error);
      set({ groups: previousGroups });
      useToastStore.getState().addToast('Falha ao atualizar o grupo.', 'error');
    }
  },

  deleteGroup: async (id) => {
    const previousGroups = get().groups;
    const groupToDelete = previousGroups.find((g) => g.id === id);
    const groupName = groupToDelete ? groupToDelete.name : 'Grupo';
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== id),
    }));

    try {
      await groupService.remove(id);
      useToastStore
        .getState()
        .addToast(`"${groupName}" foi excluído.`, 'success');
    } catch (error) {
      console.error('Falha ao excluir o grupo. Revertendo.', error);
      set({ groups: previousGroups });
      useToastStore.getState().addToast('Falha ao excluir o grupo.', 'error');
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
      useToastStore.getState().addToast('Falha ao criar a atividade.', 'error');
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
      useToastStore.getState().addToast('Atividade atualizada!', 'success');
    } catch (error) {
      console.error('Falha ao atualizar atividade. Revertendo.', error);
      set({ groups: previousGroups });
      useToastStore
        .getState()
        .addToast('Falha ao atualizar a atividade.', 'error');
    }
  },

  deleteActivity: async (activityId: number, groupId: number) => {
    if (!activityId || !groupId) {
      console.error('Tentativa de deletar com IDs inválidos:', {
        activityId,
        groupId,
      });
      return;
    }
    const previousGroups = get().groups;

    set((state) => ({
      groups: state.groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            activities: group.activities.filter(
              (activity) => activity.id !== activityId
            ),
          };
        }
        return group;
      }),
    }));

    try {
      await activityService.remove(activityId);
    } catch {
      useToastStore
        .getState()
        .addToast('Falha ao excluir a atividade.', 'error');
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
    const previousGroups = get().groups;

    try {
      await activityService.move(activityId, payload);
    } catch (error) {
      console.error('Falha ao salvar a nova posição. Revertendo.', error);
      set({ groups: previousGroups });
      useToastStore
        .getState()
        .addToast('Não foi possível salvar a nova ordem.', 'error');
    }
  },
}));

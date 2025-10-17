import { create } from 'zustand';
import type { ActivityStore } from '../types/activityStoreType';

export const useActivityStore = create<ActivityStore>((set) => ({
  isActivityModalOpen: false,
  editingActivity: null,
  targetGroupIdForNewActivity: null,

  openCreateActivityModal: (groupId) => {
    set({
      isActivityModalOpen: true,
      editingActivity: null,
      targetGroupIdForNewActivity: groupId,
    });
  },

  openEditActivityModal: (activity) => {
    set({
      isActivityModalOpen: true,
      editingActivity: activity,
      targetGroupIdForNewActivity: null,
    });
  },

  closeActivityModal: () => {
    set({
      isActivityModalOpen: false,
      editingActivity: null,
      targetGroupIdForNewActivity: null,
    });
  },
}));

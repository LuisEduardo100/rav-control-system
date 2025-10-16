import { create } from 'zustand';
import type { ActivityType } from '../types/activityType';

interface ActivityStore {
  isActivityModalOpen: boolean;
  editingActivity: ActivityType | null;
  targetGroupIdForNewActivity: number | null;
  openCreateActivityModal: (groupId: number) => void;
  openEditActivityModal: (activity: ActivityType) => void;
  closeActivityModal: () => void;
}

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

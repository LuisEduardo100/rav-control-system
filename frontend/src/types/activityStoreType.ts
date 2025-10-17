import type { ActivityType } from './activityType';

export interface ActivityStore {
  isActivityModalOpen: boolean;
  editingActivity: ActivityType | null;
  targetGroupIdForNewActivity: number | null;
  openCreateActivityModal: (groupId: number) => void;
  openEditActivityModal: (activity: ActivityType) => void;
  closeActivityModal: () => void;
}

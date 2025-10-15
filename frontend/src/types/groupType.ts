import type { ActivityType } from './activityType';

export type GroupType = {
  id: number;
  name: string;
  position: number;
  activities: ActivityType[];
};

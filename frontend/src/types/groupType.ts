import type { ActivityType } from './activityType';

export type Group = {
  id: number;
  name: string;
  activities: ActivityType[];
};

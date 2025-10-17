import type { ActivityType } from './activityType';

export type GroupType = {
  id: number;
  name: string;
  position: number;
  activities: ActivityType[];
};

export interface GroupColumnProps {
  group: GroupType;
  activeActivity: ActivityType | null;
  overGroupId: number | null;
}

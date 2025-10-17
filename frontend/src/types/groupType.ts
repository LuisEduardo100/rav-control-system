import type { ActivityType } from './activityType';

export type GroupType = {
  id: number;
  name: string;
  position: number;
  activities: ActivityType[];
};

export interface CreateGroupRequestDTO {
  name: string;
}

export interface UpdateGroupRequestDTO {
  name: string;
}

export interface GroupColumnProps {
  group: GroupType;
  activeActivity: ActivityType | null;
  overGroupId: number | null;
}

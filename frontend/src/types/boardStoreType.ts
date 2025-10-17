import type {
  CreateActivityRequestDTO,
  MoveActivityRequestDTO,
  UpdateActivityRequestDTO,
} from './activityType';
import type { GroupType } from './groupType';

export interface BoardStoreType {
  groups: GroupType[];
  fetchGroups: () => Promise<void>;
  createGroup: (name: string) => Promise<void>;
  updateGroup: (id: number, name: string) => Promise<void>;
  deleteGroup: (id: number) => Promise<void>;
  moveActivity: (
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

import type {
  CreateActivityRequestDTO,
  MoveActivityRequestDTO,
  UpdateActivityRequestDTO,
} from './activityType';
import type {
  CreateGroupRequestDTO,
  GroupType,
  UpdateGroupRequestDTO,
} from './groupType';

export interface BoardStoreType {
  groups: GroupType[];
  fetchGroups: () => Promise<void>;
  createGroup: (dto: CreateGroupRequestDTO) => Promise<void>;
  updateGroup: (id: number, dto: UpdateGroupRequestDTO) => Promise<void>;
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
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isFilteringOverdue: boolean;
  toggleOverdueFilter: () => void;
}

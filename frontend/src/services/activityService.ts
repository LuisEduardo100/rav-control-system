import { api } from './api';
import type {
  ActivityResponseType,
  CreateActivityRequestDTO,
  UpdateActivityRequestDTO,
  MoveActivityRequestDTO,
} from '../types/activityType';

const BASE_URL = '/activities';

const mapActivityResponseToState = (
  response: ActivityResponseType,
  groupId: number
) => ({
  ...response,
  description: response.description ?? null,
  dueDate: response.dueDate ?? null,
  groupId,
});

export const activityService = {
  create: async (dto: CreateActivityRequestDTO) => {
    const { data } = await api.post<ActivityResponseType>(BASE_URL, dto);
    return mapActivityResponseToState(data, dto.groupId);
  },

  update: async (
    id: number,
    dto: UpdateActivityRequestDTO,
    currentGroupId: number
  ) => {
    const { data } = await api.put<ActivityResponseType>(
      `${BASE_URL}/${id}`,
      dto
    );
    return mapActivityResponseToState(data, currentGroupId);
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  move: async (id: number, dto: MoveActivityRequestDTO): Promise<void> => {
    await api.patch(`${BASE_URL}/${id}/move`, dto);
  },
};

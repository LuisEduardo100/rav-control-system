import { api } from './api';
import type {
  CreateGroupRequestDTO,
  GroupType,
  UpdateGroupRequestDTO,
} from '../types/groupType';

const BASE_URL = '/groups';

export const groupService = {
  getAll: async (): Promise<GroupType[]> => {
    const { data } = await api.get<GroupType[]>(BASE_URL);
    return data;
  },

  create: async (dto: CreateGroupRequestDTO): Promise<GroupType> => {
    const { data } = await api.post<GroupType>(BASE_URL, dto);
    return data;
  },

  update: async (id: number, dto: UpdateGroupRequestDTO): Promise<void> => {
    await api.put(`${BASE_URL}/${id}`, dto);
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },
};

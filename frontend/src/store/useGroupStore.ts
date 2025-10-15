import { create } from 'zustand';
import { api } from '../services/api';
import type { GroupType } from '../types/groupType';

interface GroupStore {
  groups: GroupType[];
  fetchGroups: () => Promise<void>;
  addGroup: (name: string) => Promise<void>;
  updateGroup: (id: number, name: string) => Promise<void>;
  deleteGroup: (id: number) => Promise<void>;
}

export const useGroupStore = create<GroupStore>((set) => ({
  groups: [],
  fetchGroups: async () => {
    const { data } = await api.get<GroupType[]>('/groups');
    set({ groups: data });
  },
  addGroup: async (name) => {
    const { data } = await api.post<GroupType>('/groups', { name });
    set((state) => ({ groups: [...state.groups, data] }));
  },
  updateGroup: async (id, name) => {
    try {
      const { data } = await api.put<GroupType>(`/groups/${id}`, { name });
      set((state) => ({
        groups: state.groups.map((g) => (g.id === id ? { ...g, ...data } : g)),
      }));
    } catch (error) {
      console.error('Falha ao atualizar o grupo.', error);
    }
  },
  deleteGroup: async (id) => {
    await api.delete(`/groups/${id}`);
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== id),
    }));
  },
}));

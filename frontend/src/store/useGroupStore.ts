// src/store/useGroupStore.ts
import { create } from 'zustand';
import { api } from '../services/api';

interface Activity {
  id: number;
  name: string;
  position: number;
  completed: boolean;
}

interface Group {
  id: number;
  name: string;
  activities: Activity[];
}

interface GroupStore {
  groups: Group[];
  fetchGroups: () => Promise<void>;
  addGroup: (name: string) => Promise<void>;
  updateGroup: (id: number, name: string) => Promise<void>;
  deleteGroup: (id: number) => Promise<void>;
}

export const useGroupStore = create<GroupStore>((set) => ({
  groups: [],
  fetchGroups: async () => {
    const { data } = await api.get<Group[]>('/groups');
    set({ groups: data });
  },
  addGroup: async (name) => {
    const { data } = await api.post<Group>('/groups', { name });
    set((state) => ({ groups: [...state.groups, data] }));
  },
  updateGroup: async (id, name) => {
    const { data } = await api.put<Group>(`/groups/${id}`, { name });
    set((state) => ({
      groups: state.groups.map((g) => (g.id === id ? data : g)),
    }));
  },
  deleteGroup: async (id) => {
    await api.delete(`/groups/${id}`);
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== id),
    }));
  },
}));

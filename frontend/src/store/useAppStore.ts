import { create } from 'zustand';

interface AppState {
  loading: boolean;
  setLoading: (state: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  loading: false,
  setLoading: (state) => set({ loading: state }),
}));

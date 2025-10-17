import { create } from 'zustand';
import type { ConfirmationState, Toast, ToastStore } from '../types/toastType';

const initialConfirmationState: ConfirmationState = {
  isOpen: false,
  title: '',
  message: '',
  onConfirm: () => {},
};

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  confirmation: initialConfirmationState,

  addToast: (message, type) => {
    const newToast: Toast = {
      id: Date.now(),
      message,
      type,
    };
    set((state) => ({ toasts: [...state.toasts, newToast] }));
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  showConfirmation: (title, message, onConfirm) => {
    set({
      confirmation: {
        isOpen: true,
        title,
        message,
        onConfirm,
      },
    });
  },

  hideConfirmation: () => {
    set({ confirmation: initialConfirmationState });
  },
}));

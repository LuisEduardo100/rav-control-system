export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface ToastStore {
  toasts: Toast[];
  confirmation: ConfirmationState;
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: number) => void;
  showConfirmation: (
    title: string,
    message: string,
    onConfirm: () => void
  ) => void;
  hideConfirmation: () => void;
}

export interface ToastMessageProps {
  toast: Toast;
  duration?: number;
}

export interface ConfirmationState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

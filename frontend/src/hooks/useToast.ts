import { useToastStore } from '../store/useToastStore';

export const useToast = () => {
  const addToast = useToastStore((state) => state.addToast);

  return {
    show: addToast,
  };
};

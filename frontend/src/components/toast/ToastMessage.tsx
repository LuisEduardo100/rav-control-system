import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';
import type { ToastMessageProps } from '../../types/toastType';

const toastConfig = {
  success: {
    icon: <CheckCircle className="text-[#155DFC]" />,
    borderColor: 'border-[#155DFC]',
  },
  error: {
    icon: <XCircle className="text-red-500" />,
    borderColor: 'border-red-500',
  },
  info: {
    icon: <Info className="text-orange-400" />,
    borderColor: 'border-blue-500',
  },
};

export default function ToastMessage({
  toast,
  duration = 3000,
}: ToastMessageProps) {
  const removeToast = useToastStore((state) => state.removeToast);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, duration]);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const config = toastConfig[toast.type as keyof typeof toastConfig];

  const handleTransitionEnd = () => {
    if (!isVisible) {
      removeToast(toast.id);
    }
  };

  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      className={`
        flex items-center gap-4 w-full max-w-sm p-4 bg-gray-800 text-white
        border-l-4 ${config.borderColor} rounded-md shadow-lg
        transition-all duration-300 ease-in-out
        ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
        }
      `}
      role="alert"
    >
      <div>{config.icon}</div>
      <p className="flex-grow text-sm">{toast.message}</p>
      <button
        onClick={() => setIsVisible(false)}
        className="text-gray-400 hover:text-red-500 cursor-pointer"
      >
        <XCircle size={20} />
      </button>
    </div>
  );
}

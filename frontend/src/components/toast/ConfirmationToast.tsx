import { useToastStore } from '../../store/useToastStore';

export default function ConfirmationToast() {
  const { confirmation, hideConfirmation } = useToastStore();
  const { isOpen, title, message, onConfirm } = confirmation;

  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm();
    hideConfirmation();
  };

  return (
    <div className="fixed inset-0 z-50 pt-15 flex items-start justify-center bg-black/60">
      <div className="flex flex-col gap-4 p-5 rounded-lg bg-gray-800 text-white shadow-xl w-full max-w-sm">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-300">{message}</p>
        <div className="flex gap-3 justify-end mt-2">
          <button
            onClick={hideConfirmation}
            className="px-4 py-2 text-sm rounded-md bg-gray-600 hover:opacity-80 font-semibold cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm rounded-md bg-[#155dfc] hover:[#155dfc] hover:opacity-80 text-white font-semibold cursor-pointer"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

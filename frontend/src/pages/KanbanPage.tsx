import ActivityFormModal from '../components/ActivityFormModal';
import Board from '../components/Board';
import ConfirmationToast from '../components/ConfirmationToast';
import Toaster from '../components/Toaster';

export default function KanbanPage() {
  return (
    <div className="flex h-screen flex-col bg-gray-900 p-4 text-white">
      <header className="mb-6 flex-shrink-0">
        <h1 className="text-3xl font-bold">Quadro de Atividades</h1>
        <p className="text-gray-400 text-sm mt-1">
          Gerencie suas atividades arrastando entre grupos.
        </p>
      </header>

      <section className="flex-1 overflow-hidden">
        <Board />
      </section>

      <ActivityFormModal />
      <Toaster />
      <ConfirmationToast />
    </div>
  );
}

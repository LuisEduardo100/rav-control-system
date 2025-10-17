import ActivityFormModal from '../components/activity/ActivityFormModal';
import Board from '../components/Board';
import ConfirmationToast from '../components/toast/ConfirmationToast';
import AppHeader from '../components/header/Header';
import Toaster from '../components/toast/Toaster';

export default function KanbanPage() {
  return (
    <div className="flex h-screen flex-col bg-gray-900 text-white">
      <AppHeader />
      <section className="flex-1 overflow-hidden">
        <Board />
      </section>

      <ActivityFormModal />
      <Toaster />
      <ConfirmationToast />
    </div>
  );
}

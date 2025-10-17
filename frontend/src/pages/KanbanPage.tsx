import ActivityFormModal from '../components/activity/ActivityFormModal';
import Board from '../components/Board';
import ConfirmationToast from '../components/toast/ConfirmationToast';
import AppHeader from '../components/header/Header';
import Toaster from '../components/toast/Toaster';

export default function KanbanPage() {
  return (
    <div className="flex h-screen flex-col bg-gray-900 text-white">
      <AppHeader />
      <main className="flex-1 overflow-hidden">
        <Board />
      </main>
      <ActivityFormModal />
      <Toaster />
      <ConfirmationToast />
    </div>
  );
}

import ActivityFormModal from '../components/ActivityFormModal';
import Board from '../components/Board';

export default function KanbanPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Quadro de Atividades</h1>
        <p className="text-gray-400 text-sm mt-1">
          Gerencie suas atividades arrastando entre grupos.
        </p>
      </header>

      <section>
        <Board />
      </section>
      <ActivityFormModal />
    </div>
  );
}

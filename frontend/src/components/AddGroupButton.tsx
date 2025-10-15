import { useState } from 'react';
import { useBoardStore } from '../store/useBoardStore';

export default function AddGroupButton() {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const { createGroup } = useBoardStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;

    await createGroup(name.trim());
    setName('');
    setIsAdding(false);
  };

  if (isAdding) {
    return (
      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-3 w-64">
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setIsAdding(false)}
          placeholder="Nome do grupo..."
          className="bg-gray-700 w-full p-2 rounded-md text-sm outline-none"
        />
      </form>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="bg-gray-700 hover:bg-gray-600 w-64 p-3 rounded-xl text-sm font-medium text-gray-200"
    >
      + Novo Grupo
    </button>
  );
}

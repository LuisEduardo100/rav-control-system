import { useState } from 'react';
import { useBoardStore } from '../store/useBoardStore';

export default function AddGroupButton() {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const { createGroup } = useBoardStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setIsAdding(false);
      return;
    }

    await createGroup(name.trim());
    setName('');
    setIsAdding(false);
  };

  const baseStyle =
    'flex w-72 h-12 flex-shrink-0 flex-col rounded-lg p-3 cursor-pointer justify-center';

  if (isAdding) {
    return (
      <form onSubmit={handleSubmit} className={`${baseStyle} bg-stone-200`}>
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setIsAdding(false)}
          placeholder="Nome do novo grupo..."
          className="w-full rounded-md border-2 border-blue-500 bg-white p-2 text-sm shadow-sm outline-none text-black placeholder:text-black"
        />
      </form>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className={`${baseStyle} bg-stone-200/50 text-stone-600 hover:bg-stone-200/80`}
    >
      + Novo Grupo
    </button>
  );
}

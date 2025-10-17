import { useState, useEffect } from 'react';
import { useBoardStore } from '../../store/useBoardStore';
import { useDebounce } from '../../hooks/useDebounce';
import { Search } from 'lucide-react';

export default function SearchInput() {
  const setSearchTerm = useBoardStore((state) => state.setSearchTerm);
  const [localSearch, setLocalSearch] = useState('');
  const debouncedSearchTerm = useDebounce(localSearch, 300);

  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);

  return (
    <div className="relative w-full max-w-xs">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={20}
      />
      <input
        type="text"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        placeholder="Localizar atividade..."
        className="w-full rounded-md border-0 bg-gray-700 py-2 pl-10 pr-4 text-white ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:outline-none focus:border-none"
      />
    </div>
  );
}

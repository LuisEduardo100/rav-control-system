import OverdueNotification from './OverdueNotification';
import SearchInput from './SearchInput';

export default function AppHeader() {
  return (
    <header className="mb-12 flex flex-wrap items-center justify-between gap-4 p-4 bg-blue-600">
      <SearchInput />
      <OverdueNotification />
    </header>
  );
}

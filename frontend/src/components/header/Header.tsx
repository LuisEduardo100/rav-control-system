import OverdueNotification from './OverdueNotification';
import SearchInput from './SearchInput';

export default function AppHeader() {
  return (
    <header className="mb-12 flex flex-wrap items-center justify-between gap-4 py-4 px-8 bg-blue-600">
      <SearchInput />
      <OverdueNotification />
    </header>
  );
}

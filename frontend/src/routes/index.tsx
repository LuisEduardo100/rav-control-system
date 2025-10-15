import { BrowserRouter, Routes, Route } from 'react-router-dom';
import KanbanPage from '../pages/KanbanPage';
import NotFoundPage from '../pages/NotFoundPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<KanbanPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/KanbanPage';
import NotFoundPage from '../pages/NotFoundPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

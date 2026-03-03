import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthContext } from '../auth/useAuthContext';
import Loading from '../shared/components/Loading';
import NotFound from '../shared/components/NotFound';
import PublicRoutes from './routes/public.routes';
import PrivateRoutes from './routes/private.routes';

export default function App() {
  const { logado } = useAuthContext();

  useEffect(() => {
    const baseUrl = (import.meta.env?.VITE_API_URL_IMG || '').replace(/\/$/, '');
    document.documentElement.style.setProperty('--asset-base-url', baseUrl);
  }, []);

  if (logado === null) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <PublicRoutes />
        <PrivateRoutes />
        <Route path="*" element={logado ? <NotFound /> : <Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

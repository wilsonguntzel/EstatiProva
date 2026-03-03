import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../auth/useAuthContext';
import Loading from '../../shared/components/Loading';

export default function ProtectedRoute({ element }) {
  const { logado } = useAuthContext();

  if (logado === null) return <Loading />;
  return logado ? element : <Navigate to="/login" replace />;
}

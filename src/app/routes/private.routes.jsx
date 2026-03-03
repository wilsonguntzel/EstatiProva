import { Route } from 'react-router-dom';
import HomeLayout from '../../features/home/HomeLayout';
import ProtectedRoute from './ProtectedRoute';

export default function PrivateRoutes() {
  return <Route path="/home/*" element={<ProtectedRoute element={<HomeLayout />} />} />;
}

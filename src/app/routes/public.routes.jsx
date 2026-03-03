import { Route } from 'react-router-dom';
import LandingPage from '../screens/LandingPage';
import LoginPage from '../screens/LoginPage';
import RecoverPasswordPage from '../screens/RecoverPasswordPage';

export default function PublicRoutes() {
  return (
    <>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recuperarSenha/:token" element={<RecoverPasswordPage />} />
    </>
  );
}

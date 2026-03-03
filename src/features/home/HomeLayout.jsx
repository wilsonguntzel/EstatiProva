import { Link, Route, Routes } from 'react-router-dom';
import DashboardPage from '../dashboard/DashboardPage';
import EstudosPage from '../estudos/EstudosPage';
import PlanejamentoPage from '../planejamento/PlanejamentoPage';
import PerfilPage from '../perfil/PerfilPage';

export default function HomeLayout() {
  return (
    <div>
      <h1>Home</h1>
      <nav>
        <Link to="dashboard">Dashboard</Link> | <Link to="estudos">Estudos</Link> |{' '}
        <Link to="planejamento">Planejamento</Link> | <Link to="perfil">Perfil</Link>
      </nav>
      <Routes>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="estudos" element={<EstudosPage />} />
        <Route path="planejamento" element={<PlanejamentoPage />} />
        <Route path="perfil" element={<PerfilPage />} />
        <Route index element={<DashboardPage />} />
      </Routes>
    </div>
  );
}

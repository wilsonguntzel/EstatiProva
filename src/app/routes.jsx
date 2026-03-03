import { Navigate, useRoutes } from 'react-router-dom';
import UserLayout from './layout/UserLayout';
import HomePage from '../pages/Home/HomePage';
import ProvasListPage from '../pages/Provas/ProvasListPage';
import ProvaOverviewPage from '../pages/Provas/ProvaOverviewPage';
import AnswerSheetPage from '../pages/Provas/AnswerSheetPage';
import ResultPage from '../pages/Provas/ResultPage';
import ProfilePage from '../pages/Profile/ProfilePage';

export default function AppRoutes() {
  return useRoutes([
    {
      path: '/',
      element: <UserLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'provas', element: <ProvasListPage /> },
        { path: 'provas/:provaId', element: <ProvaOverviewPage /> },
        { path: 'provas/:provaId/responder', element: <AnswerSheetPage /> },
        { path: 'provas/:provaId/resultado', element: <ResultPage /> },
        { path: 'perfil', element: <ProfilePage /> },
        { path: '*', element: <Navigate to="/" replace /> }
      ]
    }
  ]);
}

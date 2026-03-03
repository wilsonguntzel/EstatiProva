import { Outlet, useLocation } from 'react-router-dom';
import Topbar from './Topbar';
import BottomNav from './BottomNav';

export default function UserLayout() {
  const loc = useLocation();
  const showBottomNav = ['/', '/provas'].includes(loc.pathname) || loc.pathname.includes('/provas/');

  return (
    <div className="app-shell">
      <header><Topbar /></header>
      <main className="page-content"><Outlet /></main>
      {showBottomNav ? <BottomNav /> : null}
    </div>
  );
}

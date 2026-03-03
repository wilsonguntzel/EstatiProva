import { useLocation, useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const nav = useNavigate();
  const loc = useLocation();
  const value = loc.pathname.startsWith('/provas') ? 'provas' : loc.pathname.startsWith('/perfil') ? 'perfil' : 'home';

  return (
    <div className="bottom-nav">
      {[
        ['home', 'Minhas', '/'],
        ['provas', 'Provas', '/provas'],
        ['perfil', 'Perfil', '/perfil']
      ].map(([key, label, path]) => (
        <button key={key} type="button" className={value === key ? 'active' : ''} onClick={() => nav(path)}>{label}</button>
      ))}
    </div>
  );
}

import { useNavigate } from 'react-router-dom';

export default function Topbar() {
  const nav = useNavigate();
  return (
    <div className="topbar">
      <strong className="brand">NotaCerta</strong>
      <div className="topbar-actions">
        <button type="button" onClick={() => nav('/provas')}>Provas</button>
        <button type="button" className="primary" onClick={() => nav('/')}>Minhas</button>
        <button type="button" onClick={() => nav('/perfil')}>Perfil</button>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listProvas } from '../../services/apiClient';

export default function ProvasListPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setItems(await listProvas());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((p) => [p.orgao, p.banca, p.cargo, p.nomeProva, p.area].some((x) => String(x).toLowerCase().includes(s)));
  }, [items, q]);

  return (
    <section className="grid-gap">
      <h2>Provas</h2>
      <article className="card">
        <input placeholder="Buscar por órgão, banca, cargo..." value={q} onChange={(e) => setQ(e.target.value)} />
      </article>
      <article className="card">
        {loading ? <p>Carregando...</p> : (
          <div className="grid-gap">
            {filtered.map((p) => (
              <div key={p._id} className="list-row clickable" onClick={() => nav(`/provas/${p._id}`)}>
                <div>
                  <strong>{p.orgao} • {p.cargo}</strong>
                  <p className="muted">{p.banca} • {p.nomeProva}</p>
                </div>
                <div className="row wrap">
                  <span className="pill">{p.area}</span>
                  <span className="pill">Tipos: {p.tipoProva.join(', ')}</span>
                  <span className="pill">Inscritos: {p.totalCandidatos}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}

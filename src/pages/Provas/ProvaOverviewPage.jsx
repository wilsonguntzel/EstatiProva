import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProva } from '../../services/apiClient';

export default function ProvaOverviewPage() {
  const { provaId } = useParams();
  const nav = useNavigate();
  const [prova, setProva] = useState(null);
  const [bookletType, setBookletType] = useState('');

  useEffect(() => {
    (async () => {
      const p = await getProva(provaId);
      setProva(p);
      setBookletType(p.tipoProva?.[0] || 'UNICA');
    })();
  }, [provaId]);

  if (!prova) return <article className="card">Carregando...</article>;

  return (
    <section className="grid-gap">
      <article className="card">
        <h2>{prova.orgao} • {prova.cargo}</h2>
        <p className="muted">{prova.banca} • {prova.nomeProva}</p>
        <div className="row wrap">
          <span className="pill">{prova.area}</span>
          <span className="pill">Inscritos: {prova.totalCandidatos}</span>
          <span className="pill">Questões: {prova.questoes.length}</span>
        </div>
        <label>Tipo de prova
          <select value={bookletType} onChange={(e) => setBookletType(e.target.value)}>
            {prova.tipoProva.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <div className="row wrap">
          <button type="button" className="primary" onClick={() => nav(`/provas/${prova._id}/responder?type=${encodeURIComponent(bookletType)}`)}>Responder</button>
          <button type="button" onClick={() => nav(`/provas/${prova._id}/resultado`)}>Ver resultado estimado</button>
        </div>
      </article>
    </section>
  );
}
